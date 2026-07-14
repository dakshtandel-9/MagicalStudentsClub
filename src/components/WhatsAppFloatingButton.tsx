import { whatsappHref } from "@/content/site";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

/**
 * Sits above the page but must never cover a control. It is inset from the
 * corner and the page carries matching bottom padding, so nothing tappable
 * ends up underneath it on a phone.
 */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Magical Students Club on WhatsApp"
      className="bg-primary hover:bg-primary-hover fixed right-4 bottom-4 z-40 inline-flex size-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/50 transition-[background-color,transform] duration-200 hover:scale-105 sm:right-6 sm:bottom-6 sm:size-14"
    >
      <WhatsAppGlyph className="size-6 sm:size-7" />
    </a>
  );
}
