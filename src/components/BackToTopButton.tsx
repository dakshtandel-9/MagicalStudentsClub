"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollStackHome } from "./ui/CardStack";

/**
 * Appears once the hero has been scrolled past, and takes the page back to it.
 *
 * It does not scroll the page itself. The deck owns the scroll position — it
 * pins each card and pulls the page back onto a card whenever it settles between
 * two — so a raw scrollTo here would race the deck's own handler and then be
 * corrected out from under itself. Instead it asks the deck to go home, and the
 * deck performs the journey with its own glide and locking.
 */
export function BackToTopButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // One viewport down is exactly "past the hero": the hero card is sized to
    // the viewport, so clearing it and clearing a screen are the same thing.
    // A little less than a full screen, so the button is there as soon as the
    // hero has genuinely gone rather than a beat later.
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);

    onScroll(); // a reload can restore a mid-page scroll position
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollStackHome}
      aria-label="Back to top"
      // Hidden from assistive tech and taken out of the tab order while it is
      // invisible, so a keyboard user cannot land on a button that is not there.
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={[
        "border-line bg-card text-ink inline-flex size-12 items-center justify-center",
        "rounded-full border shadow-lg shadow-black/50 sm:size-14",
        "hover:border-primary hover:text-primary",
        "transition-[opacity,transform,border-color,color] duration-200",
        // Fades and lifts into place rather than appearing abruptly. Invisible
        // state is also non-interactive, or it would swallow clicks aimed at the
        // page beneath it.
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <ArrowUp className="size-5 sm:size-6" aria-hidden />
    </button>
  );
}
