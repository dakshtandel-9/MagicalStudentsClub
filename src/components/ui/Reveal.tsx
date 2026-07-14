"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fade/slide a block in when it first scrolls into view.
 *
 * Visibility never depends on an async callback arriving. A block is only ever
 * hidden while `armed` is true, and `armed` is set synchronously in the same
 * effect that starts the observer — but only for blocks that are measurably
 * below the fold at mount. Anything already on screen is shown immediately and
 * never armed, and if JS or IntersectionObserver is unavailable nothing is
 * armed at all. A decorative animation must not be able to hide real content.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Below the fold at mount? Only then is it safe to hide it, because the
    // user must scroll to reach it and the observer will fire on the way.
    if (node.getBoundingClientRect().top < window.innerHeight) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);

    // Safety net: if the observer somehow never reports (headless capture,
    // odd scroll container, resize-to-full-height), reveal anyway rather than
    // leaving the section blank.
    const failsafe = window.setTimeout(() => setShown(true), 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={armed ? (hidden ? "hidden" : "shown") : undefined}
      style={hidden ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
