import { whatsappHref } from "@/content/site";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Magical Students Club on WhatsApp"
      className="bg-primary hover:bg-primary-hover fixed right-5 bottom-5 z-40 inline-flex size-14 items-center justify-center rounded-full text-white shadow-lg shadow-black/40 transition-[background-color,transform] duration-200 hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppGlyph className="size-7" />
    </a>
  );
}
