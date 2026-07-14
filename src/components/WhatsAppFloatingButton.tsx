import { whatsappHref } from "@/content/site";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

/**
 * Sits above the page but must never cover a control. It is inset from the
 * corner and the page carries matching bottom padding, so nothing tappable
 * ends up underneath it on a phone.
 *
 * The offsets are measured from the viewport, but the section cards are
 * themselves inset from it (mx-3/my-3 → sm:mx-5/my-4 → lg:mx-6/my-5). A plain
 * corner inset would therefore drop the button on the card's rounded edge, half
 * out of the panel. Each breakpoint clears its own card margin and then adds a
 * gap, so the button always rests inside the corner rather than straddling it.
 */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Magical Students Club on WhatsApp"
      className="bg-primary hover:bg-primary-hover fixed right-7 bottom-7 z-40 inline-flex size-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/50 transition-[background-color,transform] duration-200 hover:scale-105 sm:right-10 sm:bottom-9 sm:size-14 lg:right-11 lg:bottom-10"
    >
      <WhatsAppGlyph className="size-6 sm:size-7" />
    </a>
  );
}
