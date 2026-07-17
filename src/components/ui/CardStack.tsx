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

/**
 * The offsets a card pins at — matching StackItem's `top-3 sm:top-4 lg:top-5`,
 * which in turn match the cards' own `my-3 sm:my-4 lg:my-5` gutters, so a
 * pinned card keeps the same strip of background above it that it has in flow.
 */
const STICKY_TOP_PX = 20;
const STICKY_TOP_SM_PX = 16;
const STICKY_TOP_PHONE_PX = 12;

/**
 * The deck drives the scroll itself on every viewport — the wheel, touch and
 * key handlers below. (An earlier version left phones to native scroll-snap
 * instead; that was abandoned because Chrome's mandatory-snap resolver
 * freezes the *whole* scroll container solid the moment any upcoming snap
 * target's `scroll-snap-align` is `none` — which a "wait until this card's
 * content is finished" rule needs constantly, on the very next target. CSS
 * snap cannot express that rule at all, so touch gets the same JS-driven
 * one-gesture-one-card handling wheel already had.)
 */
const DESKTOP = "(min-width: 1024px)";

/** The sm breakpoint — only the pin offset changes across it. */
const TABLET = "(min-width: 640px)";

/** The pin offset currently in force. */
function stickyTopPx(desktop: MediaQueryList, tablet: MediaQueryList) {
  if (desktop.matches) return STICKY_TOP_PX;
  return tablet.matches ? STICKY_TOP_SM_PX : STICKY_TOP_PHONE_PX;
}

/**
 * How long a card takes to travel to the top. Long enough to read as a
 * deliberate glide rather than a jump-cut; short enough that a reader moving
 * quickly through the page never feels held back.
 */
const TRAVEL_MS = 620;

/**
 * How much of a card's still-unread content one forward gesture reveals,
 * while that card has not yet been read to the end (see `unreadTail` in the
 * effect below). Roughly two-thirds of a screen — long enough that reading a
 * short overflow (a couple of extra lines) takes one gesture, not three or
 * four; short enough that a hard flick over a long card still steps through
 * it rather than jumping straight to its end in one motion, which would read
 * as the deck ignoring the "read it first" rule it exists to enforce.
 */
const CARD_READ_STEP_PX = 420;

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
 * Sticky is inert on browsers that lack it (the cards simply scroll normally).
 * The stack itself works on every viewport, and so does the driver: the wheel
 * and touch handlers below both funnel into the same `go`/`scrollToCard`
 * machinery, so a trackpad on desktop and a finger on a phone produce
 * identical behaviour — one gesture, one card, and a card's own content must
 * be read to the end before the next card is allowed up.
 *
 * Note: `position: sticky` fails inside any ancestor with `overflow: hidden`.
 * The stack therefore sets no overflow of its own, and globals.css puts
 * `overflow-x: clip` (not `hidden`) on <html>, which contains the decorative
 * glows without creating a scroll container.
 *
 * ## Why the gesture is intercepted
 *
 * One gesture must advance exactly one card, whatever its force. CSS scroll-snap
 * cannot promise that: it lets native momentum run its course and only then
 * snaps to whatever target is nearest, so a hard flick sails three cards down
 * and a timid nudge snaps straight back — and, on top of that, cannot express
 * "wait for this card's content to be read" at all (a card ready to compare
 * notes: pushing mandatory snap to fake that rule by disabling an upcoming
 * snap target froze the whole scroll container solid in Chrome — see the
 * removed `data-stack-snap-hold` machinery in git history if reviving that
 * idea). So the gesture's *direction* is read and its *magnitude* discarded —
 * a flick and a nudge do the same thing, either finish the current card's
 * content or advance one card — and the deck moves exactly one step per
 * gesture, always, on every input device.
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
    const tablet = window.matchMedia(TABLET);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /**
     * The index of the card currently at the pin: the last sentinel at or above
     * the pin line. The epsilon absorbs sub-pixel rounding at rest.
     *
     * Only honest when the page is at rest. Mid-glide it reports whatever card
     * the scroll happens to have reached, so the deck reads {@link parked}
     * instead and keeps this for scrolls it did not itself initiate.
     */
    const measuredIndex = () => {
      const top = stickyTopPx(desktop, tablet);
      let current = 0;
      sentinels.current.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= top + 2) current = i;
      });
      return current;
    };

    /**
     * The still-unread tail of card `i`'s own content, in pixels — 0 once it
     * has been scrolled to the end or has nothing to scroll to begin with.
     *
     * A forward gesture must finish a card's own content before it is allowed
     * to advance the deck to the next card — see the call site in `go` below.
     * This is the rule CSS scroll-snap could not express (see the block
     * comment on {@link DESKTOP}): mandatory snap only ever watches sentinel
     * positions, so it has no notion of "wait until the reader is done", and
     * — worse, discovered the hard way — Chrome's snap resolver simply
     * refuses to scroll at all once an upcoming snap target's alignment is
     * withdrawn to express that wait. Driving the scroll here instead sidesteps
     * the browser's snap machinery entirely, so nothing depends on it.
     */
    const unreadTail = (i: number) => {
      const card = sentinels.current[i]?.nextElementSibling;
      const scroller = card?.querySelector<HTMLElement>(
        "[data-stack-scrollable]",
      );
      if (!scroller) return 0;
      return Math.max(
        0,
        scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight,
      );
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

      // A forward gesture on a card whose content is not yet fully read scrolls
      // that content instead of advancing the deck — the tail is walked off by
      // however much this one gesture is worth, capped at what is left. A
      // backward gesture is never gated: reading is a one-way requirement, and
      // gating retreat too would trap a reader who overshot on the way down.
      if (step > 0) {
        const tail = unreadTail(from);
        if (tail > 0) {
          const card = sentinels.current[from]?.nextElementSibling;
          const scroller = card?.querySelector<HTMLElement>(
            "[data-stack-scrollable]",
          );
          scroller?.scrollBy({
            top: Math.min(tail, CARD_READ_STEP_PX),
            behavior: reduced.matches ? "auto" : "smooth",
          });
          return;
        }
      }

      const next = from + step;
      if (next < 0 || next >= list.length) return; // at an end: nowhere to go

      scrollToCard(next);
    };

    /**
     * True while `scroller` still has room to move one step further in
     * direction `dir` (+1 down, -1 up). A gesture over a card's own content is
     * let through to the browser's native scroll only while this holds —
     * dragging text down (`dir` +1) once the scroller has hit its end must
     * fall through to `go` and advance the deck instead of rubber-banding
     * forever, which is the whole point of the read-it-first rule. Scrolling
     * back up (`dir` -1) is excused whenever there is anything above to
     * reveal, mirroring the forward case.
     */
    const hasRoom = (scroller: HTMLElement, dir: number) =>
      dir > 0
        ? scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight >
          1
        : scroller.scrollTop > 1;

    const onWheel = (e: WheelEvent) => {
      // A wheel event inside a scrollable region (a card whose content
      // overflows on a short screen) belongs to that region, not to the deck
      // — but only while that region still has somewhere left to go in this
      // direction. Once it has hit its end, the same gesture falls through to
      // `go` below and is free to advance (or retreat) the deck: without this
      // a reader whose mouse happens to sit over the text could scroll to the
      // bottom of a card and then find every further wheel notch swallowed by
      // a maxed-out scroller that never hands off to the deck.
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
      const scroller = el?.closest<HTMLElement>("[data-stack-scrollable]");
      if (scroller && hasRoom(scroller, e.deltaY > 0 ? 1 : -1)) return;

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

    // Touch: the same one-gesture-one-card contract as the wheel, driven from
    // a drag instead of a wheel delta. A finger's vertical travel since the
    // last touchmove is fed through the identical threshold/pause/reversal/
    // surge state machine above (shared refs), so a slow drag and a hard flick
    // both resolve to exactly one step, and a drag inside a still-reading
    // card's content is consumed by `go` itself rather than the browser's own
    // touch-scroll — which is why `touchmove` is not passive here either.
    let touchY: number | undefined;

    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (touchY === undefined || y === undefined) return;

      // Dragging a finger up moves content up, the same visual direction as a
      // positive (downward-scrolling) wheel delta — so up-drag maps to +1,
      // matching `deltaY > 0` in the wheel handler.
      const dy = touchY - y;
      touchY = y;

      const node = e.target as Node | null;
      const el =
        node instanceof Element
          ? node
          : node instanceof Node
            ? node.parentElement
            : null;
      // Same exclusion as the wheel handler, and the same escape hatch: once
      // the card's own content has nowhere left to go in this drag's
      // direction, the touch falls through to `go` instead of rubber-banding
      // forever against a maxed-out scroller.
      const scroller = el?.closest<HTMLElement>("[data-stack-scrollable]");
      if (scroller && hasRoom(scroller, dy > 0 ? 1 : -1)) return;

      e.preventDefault();

      const mag = Math.abs(dy);
      const now = e.timeStamp;
      const paused = now - lastWheel.current >= GESTURE_GAP_MS;
      lastWheel.current = now;

      if (mag < WHEEL_THRESHOLD) {
        lastMag.current = mag;
        return;
      }

      const dir = dy > 0 ? 1 : -1;
      const reversed = lastDir.current !== 0 && dir !== lastDir.current;
      const surged = mag >= SURGE_FLOOR && mag > lastMag.current * 2;
      lastDir.current = dir;
      lastMag.current = mag;

      if (!paused && !reversed && !surged) return;

      go(dir);
    };

    const onTouchEnd = () => {
      touchY = undefined;
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
        el.getBoundingClientRect().top +
          window.scrollY -
          stickyTopPx(desktop, tablet),
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
      if (locked.current) return;
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

        const top = stickyTopPx(desktop, tablet);

        // Nearest sentinel to the pin line, by absolute distance.
        let nearest = 0;
        let best = Infinity;
        list.forEach((el, i) => {
          const d = Math.abs(el.getBoundingClientRect().top - top);
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
      scrollToCard(0, HOME_TRAVEL_MS);
    };

    // Not passive: the handlers must be able to preventDefault the page scroll.
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(STACK_HOME_EVENT, onHome);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(STACK_HOME_EVENT, onHome);
      window.clearTimeout(unlockAt.current);
      window.clearTimeout(idle);
    };
  }, []);

  return (
    <StackContext.Provider value={registry}>
      {/* `data-card-stack` scopes the x-axis clip in globals.css to pages that
          actually have a deck — the flowing inner pages must never have
          their scrolling touched. */}
      <div data-card-stack className="lg:relative">
        {children}
      </div>
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
    if (!card || !sentinel) return;

    const desktop = window.matchMedia(DESKTOP);
    const tablet = window.matchMedia(TABLET);

    let observer: IntersectionObserver | undefined;

    // The card itself cannot be observed to find out whether it has stuck: once
    // pinned it stays pinned at the top of the viewport with its full height
    // below, so it never stops intersecting and would always look "on screen".
    //
    // The sentinel is a zero-height marker sitting at the card's natural top in
    // normal flow, so unlike the card it keeps scrolling. Pulling the observer
    // root down by the sticky offset puts the boundary exactly on the pin line:
    // the moment the sentinel leaves the root through the top, the card's own
    // top has reached that line and it has pinned.
    //
    // Which edge it left by is the whole question, and `isIntersecting` alone
    // cannot answer it — a sentinel still far below the fold is just as
    // "not intersecting" as one that has scrolled off the top. So the sign of
    // the sentinel's position decides: above the pin line means pinned; below
    // the viewport means the card is simply not there yet.
    const sync = () => {
      observer?.disconnect();
      // The boundary sits 2px *past* the pin line, never on it. A card at
      // rest sits exactly on the line — that is what pinning means — and a
      // sentinel exactly on the root's edge still counts as intersecting, so
      // a boundary on the line itself would never see the landing cross it
      // and the flags would never flip. Two pixels down, every landing
      // decisively crosses. Rebuilt on breakpoint change because the pin
      // offset moves and rootMargin cannot be updated in place.
      const boundary = stickyTopPx(desktop, tablet) + 2;

      observer = new IntersectionObserver(
        (entries) => {
          // Only the newest record matters: acting on an older one would leave
          // the flags describing a state the card has already left. And the
          // rect alone decides the side — `isIntersecting` is false both far
          // below the fold and past the pin, and ambiguous exactly on the
          // boundary, so it cannot.
          const entry = entries[entries.length - 1];
          const pinned = entry.boundingClientRect.top <= boundary;

          // The glow douse — hero exempt (see `parks` above).
          if (parks) card.toggleAttribute("data-parked", pinned);
        },
        { rootMargin: `-${boundary}px 0px 0px 0px`, threshold: 0 },
      );
      observer.observe(sentinel);
    };

    sync();
    desktop.addEventListener("change", sync);
    tablet.addEventListener("change", sync);

    return () => {
      observer?.disconnect();
      desktop.removeEventListener("change", sync);
      tablet.removeEventListener("change", sync);
    };
  }, [parks]);

  return (
    <>
      {/* Marks where this card comes to rest: the deck scrolls to it (on every
          viewport now — see the touch handling in CardStack), and the
          observer above watches it to know when the card has parked. The card
          itself can do neither job — once parked it is sticky and has stopped
          moving with the scroller. Zero-height so it measures a position, not
          an area. */}
      <div ref={sentinelRef} aria-hidden className="h-0" />
      <div
        ref={cardRef}
        // Pins just below the top of the viewport, so a stuck card keeps a strip
        // of background above it and its rounded top corners stay clear of the
        // screen edge — matching the margin it has when scrolling freely, at
        // every breakpoint (top-3/4/5 ↔ the cards' my-3/4/5).
        className="sticky top-3 sm:top-4 lg:top-5"
        // z-index must rise with position so each card covers the one before it.
        // Inline because Tailwind cannot generate a class from a runtime value.
        style={{ zIndex: index + 1 }}
      >
        {children}
      </div>
    </>
  );
}
