"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/** Matches `lg:top-5` on StackItem — the offset a card pins at. */
const STICKY_TOP_PX = 20;

/** The stack behaviour is desktop-only, same as the sticky classes themselves. */
const DESKTOP = "(min-width: 1024px)";

/**
 * How long a card takes to travel to the top. Long enough to read as a
 * deliberate glide rather than a jump-cut; short enough that a reader moving
 * quickly through the page never feels held back.
 */
const TRAVEL_MS = 620;

/**
 * Wheel deltas below this can keep a gesture alive but never start one —
 * trackpad momentum tails off in a long drizzle of 1–3px events, and a floor
 * stops that drizzle from ever counting as a fresh instruction.
 */
const WHEEL_THRESHOLD = 4;

/**
 * A quiet gap that means "the fingers have left the trackpad". Momentum events
 * arrive in a stream — the sub-threshold drizzle keeps the timer refreshed —
 * so an unbroken stream is still *one* gesture no matter how long or hard it
 * is. Short, deliberately: a pause is only one of three ways a new gesture is
 * recognised (see the reversal and surge rules in the handler), and a long gap
 * here punishes a mouse wheel, whose notches arrive as separate events a
 * couple of hundred milliseconds apart with no drizzle between them.
 */
const GESTURE_GAP_MS = 160;

/**
 * A delta that at least doubles the previous event's and clears this floor is
 * fresh finger input, however recently the stream last spoke: momentum only
 * ever decays, so a surge cannot come from a tail. This is what lets a reader
 * step deliberately from card to card without having to wait out the previous
 * flick's dying drizzle. Above the jitter of a tail's small values, so a
 * 2px-to-5px wobble can never qualify.
 */
const SURGE_FLOOR = WHEEL_THRESHOLD * 3;

/**
 * How long the deck stays shut after a card lands, on top of the glide itself.
 * Zero: the next card can be called up the moment the current one arrives.
 *
 * Note the deck is still locked for the duration of the glide (TRAVEL_MS), which
 * is what keeps one gesture to one card — this only removes the extra pause that
 * used to follow the landing.
 */
const REST_MS = 0;

/**
 * How long the page must sit still before the safety net decides it has come to
 * rest off-pin and corrects it. Long enough not to fight a scroll still in
 * progress; short enough that a half-scrolled card is never left on screen.
 */
const SETTLE_MS = 120;

/**
 * The trip back to the hero crosses the whole deck, not one card, so it is given
 * a longer glide — at the one-card speed the journey reads as a lurch.
 */
const HOME_TRAVEL_MS = 900;

/**
 * Asks the deck to glide home to the hero. Anything outside CardStack that wants
 * to send the page to the top must fire this rather than scrolling itself: the
 * deck owns the scroll position, and a raw scrollTo would race the wheel handler
 * and then be pulled back by the off-pin safety net.
 */
export const STACK_HOME_EVENT = "cardstack:home";

/** Fire {@link STACK_HOME_EVENT}. */
export function scrollStackHome() {
  window.dispatchEvent(new Event(STACK_HOME_EVENT));
}

type Registry = {
  register: (el: HTMLElement) => () => void;
};

const StackContext = createContext<Registry | null>(null);

/**
 * A deck of stacked, sticky cards.
 *
 * Each item sticks at the same offset below the header. Because they share a
 * sticky top and z-index rises with position, a card that has stuck stays put
 * while the following card scrolls up and covers it — sections overtake each
 * other instead of scrolling past.
 *
 * Sticky is inert on browsers that lack it (the cards simply scroll normally),
 * and the whole effect is confined to lg and up — on phones a stack of
 * overlapping full-height cards would be unusable, so there the sections flow
 * one after another.
 *
 * Note: `position: sticky` fails inside any ancestor with `overflow: hidden`.
 * The stack therefore sets no overflow of its own, and globals.css puts
 * `overflow-x: clip` (not `hidden`) on <html>, which contains the decorative
 * glows without creating a scroll container.
 *
 * ## Why the wheel is intercepted
 *
 * One gesture must advance exactly one card, whatever its force. CSS scroll-snap
 * cannot promise that: it lets native momentum run its course and only then
 * snaps to whatever target is nearest, so a hard flick sails three cards down
 * and a timid nudge snaps straight back. Here the wheel's *direction* is read
 * and its *magnitude* discarded, so a flick and a nudge do the same thing —
 * advance one card — and the deck advances one card per gesture, always.
 */
export function CardStack({ children }: { children: ReactNode }) {
  // Sentinels in DOM order. Each marks where its card comes to rest.
  const sentinels = useRef<HTMLElement[]>([]);
  // Held from the moment a card is sent on its way until a full REST_MS after it
  // lands. While it is set, the deck takes no instructions.
  const locked = useRef(false);
  const unlockAt = useRef<number | undefined>(undefined);
  const lastWheel = useRef(0);
  // Direction of the gesture being served: +1 down, -1 up, 0 before the first.
  // Momentum decays but never reverses, so a sign flip is always a human.
  const lastDir = useRef(0);
  // Magnitude of the previous wheel event, drizzle included — the baseline the
  // surge rule measures fresh input against.
  const lastMag = useRef(0);
  // The card the deck last sent itself to, and therefore the one it steps from.
  //
  // The deck cannot ask the DOM where it is: `locked` is released on a timer, and
  // a smooth scroll routinely outlives that timer on a tall card. Measuring at
  // that moment reads the *coasting* scroll position — already past the current
  // card's pin line — so the next step is counted from the card below and one
  // card is skipped. Remembering the destination is exact whether the glide has
  // finished or not. `undefined` means "the deck has not moved itself yet", so
  // the first step measures instead.
  const parked = useRef<number | undefined>(undefined);

  const register = useCallback((el: HTMLElement) => {
    const list = sentinels.current;
    list.push(el);
    // Registration order follows mount order, which React does not promise
    // matches DOM order. Sort by document position so "the next card" is really
    // the next one down the page.
    list.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
    return () => {
      const i = list.indexOf(el);
      if (i !== -1) list.splice(i, 1);
    };
  }, []);

  const registry = useMemo<Registry>(() => ({ register }), [register]);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onWheel = (e: WheelEvent) => {
      // Below lg the deck does not stack, so the page scrolls normally.
      if (!desktop.matches) return;

      // A wheel event inside a scrollable region (a card whose content overflows
      // on a short screen) belongs to that region, not to the deck.
      //
      // The target is not always an Element — it can be a text node, or `window`
      // itself — so `closest` cannot be called on it blindly. Walk up to the
      // nearest Element first.
      const node = e.target as Node | null;
      const el =
        node instanceof Element
          ? node
          : node instanceof Node
            ? node.parentElement
            : null;
      if (el?.closest("[data-stack-scrollable]")) return;

      // The deck owns the wheel: never let the page free-scroll underneath.
      // Every event, however small — the 1–3px momentum drizzle would
      // otherwise drift the page off-pin and leave the safety net to snap it
      // back, a wobble the reader can see.
      e.preventDefault();

      // Firefox reports a plain mouse wheel in lines (deltaMode 1), not pixels
      // — a couple of "3"s that a pixel threshold would swallow whole.
      const dy =
        e.deltaY *
        (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);

      const mag = Math.abs(dy);
      const now = e.timeStamp;
      const paused = now - lastWheel.current >= GESTURE_GAP_MS;
      // Always refreshed, even for sub-threshold drizzle and while the deck is
      // locked mid-glide: an unbroken stream must read as one gesture for its
      // whole life, or the sparse end of a hard flick's tail counts as a second
      // instruction and one long scroll runs the deck two cards.
      lastWheel.current = now;

      // Too small to be an instruction — but it has kept the gesture alive
      // above and sets the surge baseline below, which is its whole job.
      if (mag < WHEEL_THRESHOLD) {
        lastMag.current = mag;
        return;
      }

      const dir = dy > 0 ? 1 : -1;
      // Momentum cannot change sign and cannot grow, so either one is
      // certainly a new gesture and is served at once — making it wait out the
      // gap would leave the reader feeling ignored.
      const reversed = lastDir.current !== 0 && dir !== lastDir.current;
      const surged = mag >= SURGE_FLOOR && mag > lastMag.current * 2;
      lastDir.current = dir;
      lastMag.current = mag;

      // None of the three signs of a new gesture: this is the tail of the one
      // already served, whatever its length or force — swallow it.
      if (!paused && !reversed && !surged) return;

      go(dir);
    };

    /**
     * The index of the card currently at the pin: the last sentinel at or above
     * the pin line. The epsilon absorbs sub-pixel rounding at rest.
     *
     * Only honest when the page is at rest. Mid-glide it reports whatever card
     * the scroll happens to have reached, so the deck reads {@link parked}
     * instead and keeps this for scrolls it did not itself initiate.
     */
    const measuredIndex = () => {
      let current = 0;
      sentinels.current.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= STICKY_TOP_PX + 2) current = i;
      });
      return current;
    };

    /** Send the deck `step` cards along (+1 down, -1 up) and then rest. */
    const go = (step: number) => {
      // Mid-glide or resting after a landing: not taking instructions.
      if (locked.current) return;

      const list = sentinels.current;
      if (!list.length) return;

      // Step from where the deck last *sent* itself, not from where the page
      // happens to be — see `parked`. Falls back to measuring only when the deck
      // has not moved itself yet, or when something else moved the page and the
      // safety net handed control back with no remembered card.
      const from = parked.current ?? measuredIndex();
      const next = from + step;
      if (next < 0 || next >= list.length) return; // at an end: nowhere to go

      scrollToCard(next);
    };

    /**
     * Glide to card `i`, pin it, then hold the deck shut for the rest period.
     * `travelMs` overrides the glide length for journeys longer than one card.
     */
    const scrollToCard = (i: number, travelMs = TRAVEL_MS) => {
      const el = sentinels.current[i];
      if (!el) return;

      // Clamped to what the document can actually scroll. The last card sits
      // against the end of the page, so its pin position lies past the maximum
      // scroll — asking for it would land short, and the safety net would then
      // read that shortfall as "off-pin" and try to correct it forever.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const to = Math.min(
        el.getBoundingClientRect().top + window.scrollY - STICKY_TOP_PX,
        max,
      );

      locked.current = true;
      // Recorded before the glide, not after it: this is the deck's answer to
      // "which card are we on", and the next gesture may arrive while the page
      // is still coasting towards it.
      parked.current = i;

      // Reduced motion gets the same one-card step and the same rest afterwards
      // — it simply arrives instantly instead of gliding.
      const travel = reduced.matches ? 0 : travelMs;
      window.scrollTo({
        top: to,
        behavior: reduced.matches ? "auto" : "smooth",
      });

      // Held for the glide *and* the rest that follows it, so the quiet period
      // begins when the card lands rather than when it set off.
      //
      // `scrollend` would be the honest signal for the arrival, but Safari does
      // not fire it, so the flight is timed instead — erring long, since
      // releasing early would let leftover momentum count as a second gesture.
      window.clearTimeout(unlockAt.current);
      unlockAt.current = window.setTimeout(() => {
        locked.current = false;
      }, travel + REST_MS);
    };

    // Keys scroll the page too, and a key the deck does not handle would
    // free-scroll it to an arbitrary offset — leaving a card stranded half-way
    // up, mid-overtake. Every key that moves the viewport is therefore either
    // translated into a one-card step or stopped.
    const KEY_STEP: Record<string, number> = {
      ArrowDown: 1,
      ArrowUp: -1,
      PageDown: 1,
      PageUp: -1,
      " ": 1, // space, and shift+space goes back
    };

    const onKey = (e: KeyboardEvent) => {
      if (!desktop.matches) return;

      // Never hijack keys aimed at a control or a text field.
      const el = e.target as HTMLElement | null;
      if (
        el?.closest("[data-stack-scrollable]") ||
        el?.closest("input, textarea, select, [contenteditable]")
      ) {
        return;
      }

      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        if (!locked.current) {
          scrollToCard(e.key === "Home" ? 0 : sentinels.current.length - 1);
        }
        return;
      }

      const step = KEY_STEP[e.key];
      if (step === undefined) return;

      e.preventDefault();
      go(e.key === " " && e.shiftKey ? -1 : step);
    };

    // Last line of defence. Anything that moves the page without going through
    // the handlers above — dragging the scrollbar, a browser find-on-page jump,
    // an anchor link — can leave the deck at rest between two cards, which is
    // the half-scrolled state the whole design exists to prevent. If the page
    // settles off-pin, glide to the nearest card.
    let idle: number | undefined;
    const onScroll = () => {
      if (!desktop.matches || locked.current) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (locked.current) return;
        const list = sentinels.current;
        if (!list.length) return;

        // At the very bottom the last card cannot reach the pin — the page runs
        // out of scroll first. That shortfall is not a half-scroll, and trying
        // to "fix" it would mean scrolling against the end of the document on
        // every settle. It is as parked as it can be, on the last card: say so,
        // and leave the scroll alone. (Measuring here would name some earlier
        // card as "nearest the pin", which is true and useless — the deck is on
        // the last one, and the next step up must come from there.)
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= max - 2) {
          parked.current = list.length - 1;
          return;
        }

        // Nearest sentinel to the pin line, by absolute distance.
        let nearest = 0;
        let best = Infinity;
        list.forEach((el, i) => {
          const d = Math.abs(el.getBoundingClientRect().top - STICKY_TOP_PX);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });

        // Whatever moved the page, it has come to rest on `nearest` — so that is
        // the card the deck steps from now, including in the branch below that
        // makes no correction. Leaving the old value would step from a card that
        // is no longer on screen.
        parked.current = nearest;

        // Already parked (within a pixel or two): nothing to correct.
        if (best <= 2) return;

        scrollToCard(nearest);
      }, SETTLE_MS);
    };

    // The back-to-top button lives outside the deck, so it asks for the journey
    // by event rather than scrolling the page itself — a raw scrollTo would race
    // the wheel handler and then be "corrected" by the safety net above.
    //
    // The trip home crosses the whole deck rather than one card, so it is given
    // a longer glide; at the one-card speed it would be a lurch.
    const onHome = () => {
      if (!desktop.matches) {
        // Below lg there is no deck — just go.
        window.scrollTo({
          top: 0,
          behavior: reduced.matches ? "auto" : "smooth",
        });
        return;
      }
      scrollToCard(0, HOME_TRAVEL_MS);
    };

    // Not passive: the handlers must be able to preventDefault the page scroll.
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(STACK_HOME_EVENT, onHome);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(STACK_HOME_EVENT, onHome);
      window.clearTimeout(unlockAt.current);
      window.clearTimeout(idle);
    };
  }, []);

  return (
    <StackContext.Provider value={registry}>
      <div className="lg:relative">{children}</div>
    </StackContext.Provider>
  );
}

export function StackItem({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const registry = useContext(StackContext);

  // Every card registers a sentinel, the hero included — it is the target the
  // deck scrolls back to at the top of the page. Only the parking behaviour
  // below is conditional.
  //
  // A card's glow is the leading edge of a card in motion. Once the card has
  // parked at the top and the next one rides over it, that same glow is trapped
  // in the seam between two panels and reads as a magenta line rather than a
  // halo — so it is switched off the moment the card stops moving.
  //
  // The hero (index 0) is exempt: it is the one panel meant to be seen whole,
  // glowing on all sides, and it is parked from the very first paint.
  const parks = index > 0;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !registry) return;
    return registry.register(sentinel);
  }, [registry]);

  useEffect(() => {
    const card = cardRef.current;
    const sentinel = sentinelRef.current;
    if (!card || !sentinel || !parks) return;

    const desktop = window.matchMedia(DESKTOP);

    // The card itself cannot be observed to find out whether it has stuck: once
    // pinned it stays pinned at the top of the viewport with its full height
    // below, so it never stops intersecting and would always look "on screen".
    //
    // The sentinel is a zero-height marker sitting at the card's natural top in
    // normal flow, so unlike the card it keeps scrolling. Pulling the observer
    // root down by the sticky offset puts the boundary exactly on the pin line:
    // the moment the sentinel leaves the root through the top, the card's own
    // top has reached that line and it has parked.
    //
    // Which edge it left by is the whole question, and `isIntersecting` alone
    // cannot answer it — a sentinel still far below the fold is just as
    // "not intersecting" as one that has scrolled off the top. So the sign of
    // the sentinel's position decides: above the pin line means parked; below
    // the viewport means the card is simply not there yet.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const parked =
          !entry.isIntersecting &&
          entry.boundingClientRect.top <= STICKY_TOP_PX;
        card.toggleAttribute("data-parked", parked);
      },
      { rootMargin: `-${STICKY_TOP_PX}px 0px 0px 0px`, threshold: 0 },
    );

    const sync = () => {
      observer.disconnect();
      if (desktop.matches) {
        observer.observe(sentinel);
      } else {
        // Below lg nothing sticks, so nothing parks — clear any stale flag left
        // behind by a resize down from desktop.
        card.removeAttribute("data-parked");
      }
    };

    sync();
    desktop.addEventListener("change", sync);

    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", sync);
    };
  }, [parks]);

  return (
    <>
      {/* Marks where this card comes to rest: the deck scrolls to it, and the
          observer above watches it to know when the card has parked. The card
          itself can do neither job — once parked it is sticky and has stopped
          moving with the scroller. Zero-height so it measures a position, not
          an area. */}
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        ref={cardRef}
        // Pins just below the top of the viewport, so a stuck card keeps a strip
        // of background above it and its rounded top corners stay clear of the
        // screen edge — matching the margin it has when scrolling freely.
        className="lg:sticky lg:top-5"
        // z-index must rise with position so each card covers the one before it.
        // Inline because Tailwind cannot generate a class from a runtime value.
        style={{ zIndex: index + 1 }}
      >
        {children}
      </div>
    </>
  );
}
