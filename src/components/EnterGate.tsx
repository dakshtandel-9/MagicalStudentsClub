"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { WELCOME_TRACK } from "@/content/narrationTracks";
import { audioSrc, preloadAllAudio } from "@/lib/audioPreloader";

/** How long the two halves take to clear the screen. Matches the CSS duration below. */
const OPEN_MS = 900;

/**
 * A floor under the loading phase. Assets are usually cached and `load` can fire
 * almost immediately, which would flash the curtain rather than show it — the
 * logo needs long enough on screen to read as a deliberate arrival.
 */
const MIN_LOAD_MS = 900;

/**
 * A ceiling on it too. A single slow image — or, now, a slow narration track —
 * must never hold the site hostage: if loading has not finished by now, the
 * gate stops waiting and gets on with it. Ten audio files (~1.4MB total) on a
 * poor connection can genuinely take a few seconds, so this is longer than a
 * page-load-only cap would need to be.
 */
const MAX_LOAD_MS = 10000;

/**
 * How long the "Tap to enter" prompt waits before giving up on the tap and
 * letting the sequence continue on its own. A visitor who does not tap is
 * not kept behind the curtain: the auto-continue's play() attempt carries no
 * user gesture so the browser will refuse it again, the doors open in
 * silence, and the narration then starts at their first real interaction —
 * the unlock listener in SectionAudioPlayer is already waiting for it.
 */
const TAP_AUTO_MS = 3000;

/** The greeting is played brisk rather than at its recorded pace. */
const AUDIO_RATE = 1.25;

/**
 * A fallback for the doors, not a schedule. Normally they wait for the audio's
 * `ended` event; this covers an element that errors or never fires it, so the
 * curtain cannot hang on a sound that is not coming. Derived from the clip's
 * ~6.3s at {@link AUDIO_RATE}, plus a margin — it must always outlast a normal
 * playthrough, or it would cut the greeting off.
 */
const AUDIO_FALLBACK_MS = (6400 / AUDIO_RATE) * 1.2;

type Phase = "loading" | "greeting" | "opening";

/**
 * Fired once the curtain has fully cleared the screen. Section narration
 * waits for this before its first track — the deck mounts under the still-
 * closed gate, so playing on mount would talk over the welcome greeting.
 */
export const GATE_OPENED_EVENT = "entergate:opened";

/**
 * The curtain the site opens behind.
 *
 * Two panels meet at the middle of the screen and cover the page, with the club
 * badge beating between them. The sequence runs itself when the browser lets
 * it, and asks for one tap when it does not:
 *
 *   loading  — the badge pulses while the page (and every narration track,
 *              in full) comes in.
 *   greeting — the welcome plays against the closed curtain; if autoplay is
 *              refused, a "Tap to enter" prompt collects the gesture first.
 *   opening  — the halves part, left and right, and the site is revealed.
 *
 * ## The audio is asked for politely, then unlocked by a tap
 *
 * Browsers refuse to play sound on a page the visitor has not yet interacted
 * with. Autoplay is still *tried* first — a returning visitor with engagement
 * history gets the fully automatic sequence — but when the browser refuses
 * (the normal case on a first visit to the deployed domain), the curtain does
 * not open onto silence. It shows "Tap to enter" instead, and that tap is the
 * user gesture that unlocks audio for the whole page: the greeting plays, the
 * doors part, and every section track after that is allowed to sound. If even
 * the gesture-retry fails (broken file, exotic browser), the doors open
 * anyway — the visitor is never stranded behind the curtain.
 *
 * ## Why the page is covered rather than withheld
 *
 * The site renders from the first paint and is merely hidden under the gate. The
 * deck below measures card positions on mount, so mounting it late would have it
 * measuring against a page that is not yet scrollable. The gate is `fixed` above
 * everything, so covering is enough.
 */
export function EnterGate() {
  const [phase, setPhase] = useState<Phase>("loading");
  // Unmounted once the halves are off-screen — a fixed layer left behind would
  // still sit over the page in every stacking context.
  const [gone, setGone] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  // Bumped once every track has fully downloaded, so the welcome `<audio>`
  // below can swap its network `src` for the in-memory `blob:` URL before the
  // greeting plays — same technique the section player uses for its tracks.
  const [, setPreloaded] = useState(false);
  // True when the browser refused to autoplay the greeting: the curtain then
  // waits for a tap instead of opening onto silence. The tap is the user
  // gesture that unlocks audio for the whole page.
  const [needsTap, setNeedsTap] = useState(false);
  // The greeting attempt, re-invokable from the tap handler with the gesture
  // attached. Owned by the greeting effect below.
  const retryGreeting = useRef<() => void>(() => {});

  const opening = phase === "opening";

  // The page must not move while the curtain is up, or a wheel behind it would
  // advance the deck and the doors would open onto some section halfway down.
  //
  // Not `body { overflow: hidden }`: CardStack drives the scroll itself and
  // measures against `scrollHeight - innerHeight`, so making the document
  // unscrollable — even briefly — collapses that measurement to zero and the
  // deck parks every card at the top. The scroll stays available; the events are
  // simply intercepted before anything can act on them.
  //
  // Capture phase, so these run ahead of CardStack's own window listeners.
  useEffect(() => {
    if (gone) return;

    // A reload restores the previous scroll position, which would open the
    // curtain onto the middle of the page. The gate always reveals the hero.
    window.scrollTo(0, 0);

    const swallow = (e: Event) => {
      // Keys aimed at the gate's own "Tap to enter" button (Enter/Space
      // activation) must go through — everything else is scroll input and
      // is stopped.
      const el = e.target as HTMLElement | null;
      if (e.type === "keydown" && el?.closest("button")) return;
      e.preventDefault();
    };

    // Not passive, or preventDefault is ignored on scroll-triggering events.
    const opts = { capture: true, passive: false } as const;
    window.addEventListener("wheel", swallow, opts);
    window.addEventListener("touchmove", swallow, opts);
    window.addEventListener("keydown", swallow, opts);
    return () => {
      window.removeEventListener("wheel", swallow, opts);
      window.removeEventListener("touchmove", swallow, opts);
      window.removeEventListener("keydown", swallow, opts);
    };
  }, [gone]);

  // Loading → greeting. Held for at least MIN_LOAD_MS and at most MAX_LOAD_MS,
  // and until both the page itself and every narration track (the welcome
  // greeting plus all nine section tracks) has finished *downloading in full*.
  //
  // `preloadAllAudio` fetches each track as a blob — so when it resolves,
  // every byte is in memory, not merely "probably enough to stream". That is
  // the whole fix for the deployed lag: `<audio preload="auto">` +
  // `canplaythrough` only ever gave the browser's optimistic *estimate* that
  // it could stream without stalling, and on a slower host that estimate fired
  // early, the curtain opened, and `play()` then had to wait for bytes. With
  // the bytes already downloaded and the elements pointed at `blob:` URLs,
  // playback starts on the same frame the door opens — and on every later
  // section the same way.
  useEffect(() => {
    if (phase !== "loading") return;

    let cancelled = false;
    const started = Date.now();
    let pageLoaded = false;
    let audioLoaded = false;
    let min: number | undefined;

    const maybeDone = () => {
      if (cancelled || !pageLoaded || !audioLoaded) return;
      // Serve out whatever is left of the minimum before moving on, so a warm
      // cache does not flash the curtain past the eye.
      const remaining = Math.max(0, MIN_LOAD_MS - (Date.now() - started));
      min = window.setTimeout(() => setPhase("greeting"), remaining);
    };

    const onPageLoaded = () => {
      pageLoaded = true;
      maybeDone();
    };

    // `load` has already fired if the bundle hydrated after it — in that case it
    // will never fire again, and waiting for it would hang the gate forever.
    if (document.readyState === "complete") {
      onPageLoaded();
    } else {
      window.addEventListener("load", onPageLoaded, { once: true });
    }

    preloadAllAudio().then(() => {
      if (cancelled) return;
      audioLoaded = true;
      // Re-render so the welcome `<audio>` picks up its blob URL before the
      // greeting phase calls play() on it.
      setPreloaded(true);
      maybeDone();
    });

    // Whichever of the two is slower, this cap still wins: a bad connection
    // must never strand the visitor behind the curtain indefinitely.
    const cap = window.setTimeout(() => setPhase("greeting"), MAX_LOAD_MS);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onPageLoaded);
      window.clearTimeout(min);
      window.clearTimeout(cap);
    };
  }, [phase]);

  // Greeting → opening. The doors wait for the welcome to finish. If the
  // browser refuses to autoplay it (a first visit, no engagement history),
  // the curtain shows "Tap to enter" and waits: the tap re-runs the attempt
  // with a real user gesture attached, which the autoplay policy always
  // honours — and that one gesture unlocks every later track on the page too.
  useEffect(() => {
    if (phase !== "greeting") return;

    const audio = audioRef.current;
    let fallback: number | undefined;
    const open = () => setPhase("opening");

    if (!audio) {
      open();
      return;
    }

    audio.addEventListener("ended", open, { once: true });
    audio.addEventListener("error", open, { once: true });

    // Not a JSX attribute — `playbackRate` exists only on the element, so it is
    // set here, before play(), rather than in the markup.
    audio.playbackRate = AUDIO_RATE;

    const attempt = (fromGesture: boolean) => {
      audio
        .play()
        .then(() => {
          // Playing: the tap prompt (if it was up) has served its purpose, and
          // the doors wait on `ended`. The timer is only a safety net for an
          // `ended` that never comes.
          setNeedsTap(false);
          fallback = window.setTimeout(open, AUDIO_FALLBACK_MS);
        })
        .catch(() => {
          if (fromGesture) {
            // Even a real tap could not start it — a broken element, not the
            // autoplay policy. Nothing is going to sound; open rather than
            // strand the visitor behind a prompt that does nothing.
            open();
          } else {
            // The expected cold-load refusal: ask for the tap.
            setNeedsTap(true);
          }
        });
    };

    retryGreeting.current = () => attempt(true);
    attempt(false);

    return () => {
      audio.removeEventListener("ended", open);
      audio.removeEventListener("error", open);
      window.clearTimeout(fallback);
    };
  }, [phase]);

  // The tap prompt only waits so long. After TAP_AUTO_MS the same retry runs
  // by itself — as `fromGesture`, so its (inevitable, gestureless) refusal
  // opens the doors rather than re-arming the prompt. A tap before the timer
  // fires clears `needsTap` on success, which unmounts this effect and
  // cancels the timer.
  useEffect(() => {
    if (!needsTap || phase !== "greeting") return;
    const auto = window.setTimeout(() => retryGreeting.current(), TAP_AUTO_MS);
    return () => window.clearTimeout(auto);
  }, [needsTap, phase]);

  // Opening → gone, once the halves have cleared the screen.
  useEffect(() => {
    if (phase !== "opening") return;
    const t = window.setTimeout(() => setGone(true), OPEN_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Tells the rest of the page the curtain is fully clear. Section narration
  // listens for this rather than starting the moment it mounts — it mounts
  // the instant the page does, underneath the still-closed gate, and would
  // otherwise talk over the welcome greeting.
  useEffect(() => {
    if (gone) window.dispatchEvent(new Event(GATE_OPENED_EVENT));
  }, [gone]);

  if (gone) return null;

  // Each half slides out by its own full width, so it clears the screen whatever
  // the viewport. Transform only — the panels never reflow the page.
  const half =
    "bg-background border-line absolute inset-y-0 w-1/2 transition-transform duration-[900ms] ease-in-out motion-reduce:transition-none";

  return (
    <div
      className="fixed inset-0 z-100"
      // Nothing here is interactive, but the page beneath must not be reachable
      // by tab or by screen reader while it is covered.
      role="dialog"
      aria-modal="true"
      aria-label="Loading Magical Students Club"
    >
      {/* Points at the in-memory `blob:` URL once the greeting has finished
          downloading (see preloadAllAudio), so play() starts on the same
          frame the loading phase ends rather than opening the curtain on a
          buffering sound. Falls back to the network URL until then. */}
      <audio ref={audioRef} src={audioSrc(WELCOME_TRACK)} preload="auto" />

      <div
        className={`${half} left-0 border-r ${opening ? "-translate-x-full" : "translate-x-0"}`}
      />
      <div
        className={`${half} right-0 border-l ${opening ? "translate-x-full" : "translate-x-0"}`}
      />

      {/* The seam between the halves, lit in brand pink — the line the two panels
          are about to open along. It travels with neither half, so it simply
          fades as they part. */}
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2",
          "bg-primary blur-[2px] transition-opacity duration-300",
          opening ? "opacity-0" : "opacity-40",
        ].join(" ")}
      />

      {/* The badge sits above both halves rather than on one of them, so it is
          centred on the seam and not carried off with a panel. It leaves on its
          own, a beat ahead of the doors. */}
      <div
        className={[
          "pointer-events-none absolute inset-0 flex items-center justify-center px-6",
          "transition-opacity duration-300",
          opening ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <div className="relative">
          {/* The pulse's own halo, beating with it — the badge alone reads as a
              scaling picture, while the light behind it reads as a pulse. */}
          <div
            aria-hidden
            className="animate-heartbeat bg-primary absolute inset-4 rounded-full opacity-25 blur-2xl"
          />
          {/* `priority`: the only thing on screen at first paint, so it must not
              lazy-load — the gate would otherwise pulse an empty space. */}
          <Image
            src="/images/logoMSC.png"
            alt="Magical Students Club"
            width={1061}
            height={1046}
            priority
            className="animate-heartbeat relative h-auto w-40 sm:w-52"
          />
        </div>
      </div>

      {/* Shown only when the browser refused to autoplay the greeting: the
          whole curtain becomes the tap target, so any touch or click anywhere
          is the gesture that unlocks audio and lets the sequence run. */}
      {needsTap && !opening && (
        <button
          type="button"
          onClick={() => retryGreeting.current()}
          className="absolute inset-0 flex cursor-pointer items-end justify-center bg-transparent pb-20 sm:pb-24"
        >
          <span className="border-primary/40 text-ink animate-pulse rounded-full border px-6 py-3 text-sm tracking-wide sm:text-base">
            Tap to enter
          </span>
        </button>
      )}
    </div>
  );
}
