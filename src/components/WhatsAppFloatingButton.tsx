import { whatsappHref } from "@/content/site";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";
import { BackToTopButton } from "./BackToTopButton";
import { NarrationMuteButton } from "./NarrationMuteButton";

/**
 * The floating controls in the bottom-right corner: narration mute, back-to-top,
 * then WhatsApp. They share one fixed container so the corner insets are
 * declared once and the three can never drift apart.
 *
 * The offsets are measured from the viewport, but the section cards are
 * themselves inset from it (mx-3/my-3 → sm:mx-5/my-4 → lg:mx-6/my-5). A plain
 * corner inset would therefore drop the buttons on the card's rounded edge, half
 * out of the panel. Each breakpoint clears its own card margin and then adds a
 * gap, so they always rest inside the corner rather than straddling it.
 *
 * Nothing tappable is allowed to end up underneath: the page carries matching
 * bottom padding on a phone.
 */
export function WhatsAppFloatingButton() {
  return (
    <div className="fixed right-7 bottom-7 z-40 flex flex-col items-center gap-3 sm:right-10 sm:bottom-9 lg:right-11 lg:bottom-10">
      <NarrationMuteButton />
      <BackToTopButton />

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Magical Students Club on WhatsApp"
        className="bg-primary hover:bg-primary-hover inline-flex size-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/50 transition-[background-color,transform] duration-200 hover:scale-105 sm:size-14"
      >
        <WhatsAppGlyph className="size-6 sm:size-7" />
      </a>
    </div>
  );
}
