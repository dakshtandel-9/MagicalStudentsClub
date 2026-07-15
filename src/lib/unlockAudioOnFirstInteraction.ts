/**
 * Browsers refuse `audio.play()` with sound until the visitor has interacted
 * with the page — a fresh production domain has no engagement history, so a
 * real first-time visitor hits this on essentially every load. Call this once
 * with a callback that (re)starts whatever should currently be sounding; it
 * fires that callback on the visitor's first click, tap, key press, or
 * scroll, whichever comes first, then stops listening.
 *
 * Capture phase, so it still fires even where a listener elsewhere (the
 * entrance gate's scroll lock) calls `preventDefault` on the same event —
 * that only suppresses the event's default action, not its delivery to other
 * listeners.
 */
export function unlockAudioOnFirstInteraction(onUnlock: () => void) {
  const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
  const opts = { capture: true, passive: true } as const;

  const handler = () => {
    events.forEach((e) => window.removeEventListener(e, handler, opts));
    onUnlock();
  };

  events.forEach((e) => window.addEventListener(e, handler, opts));
  return () => events.forEach((e) => window.removeEventListener(e, handler, opts));
}
