"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Back-to-top for ordinary flowing pages (everything but the homepage deck).
 * The homepage's {@link BackToTopButton} hands scroll off to the card stack's
 * own controller — inner pages have no such controller, so this one simply
 * scrolls the window.
 */
export function PageBackToTopButton() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={[
        "border-line bg-card text-ink inline-flex size-12 items-center justify-center",
        "rounded-full border shadow-lg shadow-black/50 sm:size-14",
        "hover:border-primary hover:text-primary",
        "transition-[opacity,transform,border-color,color] duration-200",
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <ArrowUp className="size-5 sm:size-6" aria-hidden />
    </button>
  );
}
