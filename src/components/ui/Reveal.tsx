"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Fade/slide a block in when it first enters the viewport.
 *
 * Content is visible by default and is only hidden once the effect has run and
 * armed the observer. If JS never executes, or IntersectionObserver is missing,
 * or the observer never fires, the content simply stays visible — a decorative
 * animation must never be able to hide real content.
 *
 * One observer per block, disconnected after it fires. Reduced motion is
 * handled in CSS.
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
  const [state, setState] = useState<"idle" | "armed" | "shown">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setState("shown");
      return;
    }

    // Already on screen at mount (e.g. above the fold): show it without
    // arming, so it never flashes out and back in.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setState("shown");
      return;
    }

    setState("armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={state === "armed" ? "hidden" : "shown"}
      style={delay && state === "armed" ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
