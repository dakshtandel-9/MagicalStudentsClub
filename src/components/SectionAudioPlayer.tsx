"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { GATE_OPENED_EVENT } from "./EnterGate";
import { SECTION_TRACKS } from "@/content/narrationTracks";
import { unlockAudioOnFirstInteraction } from "@/lib/unlockAudioOnFirstInteraction";

const MUTE_STORAGE_KEY = "msc:narration-muted";

type Registry = {
  register: (el: HTMLElement, index: number) => () => void;
};

const NarrationContext = createContext<Registry | null>(null);

type MuteState = {
  muted: boolean;
  toggle: () => void;
};

const MuteContext = createContext<MuteState | null>(null);

/**
 * Reads the last-chosen mute state before paint, so a returning visitor never
 * hears a flash of audio while React hydrates.
 */
function readStoredMute() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(MUTE_STORAGE_KEY) === "1";
}

/**
 * Owns the one-narration-track-per-section behaviour for the whole deck.
 *
 * Each `<audio>` is the same on-screen switch as the sticky card stack: the
 * section whose top has reached (or passed) the top of the viewport is the
 * one currently "parked", and its track is the one that should be sounding.
 * Unlike CardStack's own pin tracking, this does not require the desktop
 * sticky layout — it watches real scroll position via IntersectionObserver,
 * so the same logic drives narration on the mobile flow, where sections
 * scroll past normally rather than stacking.
 *
 * Sections register themselves as they mount (see {@link NarrationSection}),
 * so this component owns no knowledge of the page's section list beyond the
 * track URLs, and the mute button lives wherever `useNarrationMute` is
 * called from — the same button component used elsewhere in the page.
 */
export function SectionAudioPlayer({
  children,
}: {
  children: React.ReactNode;
}) {
  const sentinels = useRef<Array<{ el: HTMLElement; index: number }>>([]);
  const audios = useRef<(HTMLAudioElement | null)[]>([]);
  const active = useRef<number | null>(null);
  const [muted, setMuted] = useState(readStoredMute);

  // Kept in a ref too, so the scroll observer's callback (registered once)
  // always reads the current mute flag rather than one captured at mount.
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  // The section deck mounts the instant the page does, underneath the still-
  // closed entrance gate — held true from the start means the very first
  // section (the hero, already parked at load) is chosen as "active" as
  // usual but does not actually sound until the gate says its own greeting
  // has finished and the curtain has cleared.
  const gateHeld = useRef(true);

  // Tries to (re)start whatever section is currently active. Used wherever a
  // gate that was blocking playback has just lifted — the gate opening, an
  // unmute, or the visitor's first interaction unlocking autoplay — so a
  // browser that refused the very first attempt still ends up sounding once
  // any of those later happen.
  const tryPlayActive = () => {
    const i = active.current;
    if (i === null || mutedRef.current || gateHeld.current) return;
    const audio = audios.current[i];
    if (!audio || !audio.paused) return;
    audio.play().catch(() => {
      // Still refused — nothing left to retry from here but the visitor's
      // own next interaction, which the listener below is waiting for.
    });
  };

  useEffect(() => {
    const onGateOpened = () => {
      gateHeld.current = false;
      tryPlayActive();
    };

    window.addEventListener(GATE_OPENED_EVENT, onGateOpened);
    return () => window.removeEventListener(GATE_OPENED_EVENT, onGateOpened);
  }, []);

  // A fresh production domain has no autoplay history with the browser, so a
  // real first-time visitor's very first `play()` call is routinely refused —
  // silently, by design, everywhere in this file. This is what actually
  // starts the narration for that visitor: the moment they interact with the
  // page at all (click, tap, key, or scroll), retry whatever should currently
  // be sounding.
  useEffect(() => unlockAudioOnFirstInteraction(tryPlayActive), []);

  const toggle = () => {
    setMuted((m) => {
      const next = !m;
      window.localStorage.setItem(MUTE_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  // Muting silences whatever is currently playing immediately, without
  // touching which section is considered "active" — unmuting resumes the
  // same track rather than restarting the sequence.
  useEffect(() => {
    const i = active.current;
    if (i === null) return;
    if (muted) {
      audios.current[i]?.pause();
    } else {
      tryPlayActive();
    }
  }, [muted]);

  const playSection = (index: number) => {
    if (active.current === index) return;

    const prev = active.current;
    if (prev !== null) {
      audios.current[prev]?.pause();
    }

    active.current = index;
    const audio = audios.current[index];
    if (!audio) return;

    audio.currentTime = 0;
    // If held or muted, `tryPlayActive` is a no-op here — the gate opening,
    // an unmute, or the visitor's first interaction will each try again later
    // and pick up this section from the top, since `currentTime` is already
    // reset. If autoplay simply refuses despite none of those holds being in
    // effect, the first-interaction listener is still there to retry.
    tryPlayActive();
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    // On the desktop stack, cards pin `STICKY_TOP_PX` (20px) below the
    // viewport top — matching that offset here means a section is judged
    // "arrived" at the same instant it visually parks. On the mobile flow
    // there is no pin, so the same margin just marks a section as current
    // once its top nears the top of the screen.
    const STICKY_TOP_PX = 20;

    // Geometry alone decides which section is current — never `isIntersecting`.
    // That flag is false for a sentinel that has scrolled *past* the line, but
    // it is equally false for the hero on first paint, whose sentinel sits at
    // the very top of the page and has never crossed anything. Reading only
    // `top` treats "already there since load" and "just arrived by crossing"
    // as the same state, which they are.
    const parkedIndex = () => {
      let current: { index: number; top: number } | null = null;
      for (const { el, index } of sentinels.current) {
        const top = el.getBoundingClientRect().top;
        if (top > STICKY_TOP_PX + 2) continue;
        if (!current || top > current.top) current = { index, top };
      }
      return current?.index ?? null;
    };

    const observer = new IntersectionObserver(
      () => {
        // The entries themselves are not read: an observer fires once per
        // observed target with its state *at the moment of observation*, so
        // reacting only to the targets included in this batch would miss a
        // section that was already parked when it started being watched (the
        // hero on first paint) as well as sections whose crossing this batch
        // does not mention. Recomputing from all sentinels' live geometry
        // whenever anything changes is simpler and cannot miss either case.
        const index = parkedIndex();
        if (index !== null) playSection(index);
      },
      { rootMargin: `-${STICKY_TOP_PX}px 0px 0px 0px`, threshold: 0 },
    );

    const attachAll = () => {
      observer.disconnect();
      sentinels.current.forEach(({ el }) => observer.observe(el));
    };

    attachAll();

    // Belt-and-braces for the very first paint: `observe()` does queue an
    // initial callback with each target's current state, but that callback
    // arrives asynchronously (a microtask at the earliest). Checking geometry
    // synchronously here as well means the hero's track can start the instant
    // this effect runs rather than waiting on the observer's own schedule.
    const index = parkedIndex();
    if (index !== null) playSection(index);

    // The desktop/mobile switch changes nothing about which layout this
    // observer serves — it works unchanged on both — but re-observing on
    // resize keeps element geometry fresh if sections reflow across the
    // breakpoint.
    desktop.addEventListener("change", attachAll);

    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", attachAll);
    };
  }, []);

  const register = (el: HTMLElement, index: number) => {
    sentinels.current.push({ el, index });
    return () => {
      const i = sentinels.current.findIndex((s) => s.el === el);
      if (i !== -1) sentinels.current.splice(i, 1);
    };
  };

  return (
    <NarrationContext.Provider value={{ register }}>
      <MuteContext.Provider value={{ muted, toggle }}>
        {SECTION_TRACKS.map((src, i) => (
          <audio
            key={src}
            ref={(el) => {
              audios.current[i] = el;
            }}
            src={src}
            // The entrance gate holds the door shut until every track here has
            // buffered (see EnterGate's preload check), so eager loading is
            // safe rather than wasteful — by the time these can play, the
            // browser has usually already cached the bytes from that check.
            preload="auto"
          />
        ))}
        {children}
      </MuteContext.Provider>
    </NarrationContext.Provider>
  );
}

/**
 * Marks one section as a narration track boundary. Wraps its children in a
 * zero-height sentinel at the section's natural top, the same technique
 * `StackItem` uses for its own pin tracking — the sentinel keeps scrolling
 * with the document even once the section itself has stuck in place.
 *
 * Must wrap `StackItem` from the outside, not sit inside it. `StackItem`'s
 * child becomes `position: sticky` on desktop — a sentinel placed inside that
 * subtree would inherit the sticky behaviour, pin at the same offset once
 * parked, and then never register as "passed" for the next section to take
 * over. Sitting outside, in normal flow, is what lets it keep scrolling.
 */
export function NarrationSection({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const registry = useContext(NarrationContext);

  useEffect(() => {
    const el = ref.current;
    if (!el || !registry) return;
    return registry.register(el, index);
  }, [registry, index]);

  return (
    <>
      <div ref={ref} aria-hidden className="h-0" />
      {children}
    </>
  );
}

/** Reads the shared mute flag and its toggle — for the mute button. */
export function useNarrationMute() {
  const ctx = useContext(MuteContext);
  if (!ctx) {
    throw new Error("useNarrationMute must be used within SectionAudioPlayer");
  }
  return ctx;
}
