"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useNarrationMute } from "./SectionAudioPlayer";

/**
 * Toggles the section-narration audio on and off. Styled identically to
 * {@link BackToTopButton} so the two read as one family of floating controls.
 */
export function NarrationMuteButton() {
  const { muted, toggle } = useNarrationMute();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? "Unmute section narration" : "Mute section narration"}
      aria-pressed={muted}
      className={[
        "border-line bg-card text-ink inline-flex size-12 items-center justify-center",
        "rounded-full border shadow-lg shadow-black/50 sm:size-14",
        "hover:border-primary hover:text-primary",
        "transition-[border-color,color] duration-200",
      ].join(" ")}
    >
      {muted ? (
        <VolumeX className="size-5 sm:size-6" aria-hidden />
      ) : (
        <Volume2 className="size-5 sm:size-6" aria-hidden />
      )}
    </button>
  );
}
