/**
 * Every audio file the entrance sequence and the section narration depend on.
 * Kept in one place so the gate can preload exactly what the page is about to
 * need, rather than guessing or duplicating the list.
 */
export const WELCOME_TRACK = "/Audio/welcome.mp3";

/** One narration track per stacked section, in deck order. */
export const SECTION_TRACKS = [
  "/Audio/section1.mp3",
  "/Audio/section2.mp3",
  "/Audio/section3.mp3",
  "/Audio/section4.mp3",
  "/Audio/section5.mp3",
  "/Audio/section6.mp3",
  "/Audio/section7.mp3",
  "/Audio/section8.mp3",
  "/Audio/section9.mp3",
] as const;
