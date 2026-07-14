import { whatsappHref } from "@/content/site";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";
import { PageBackToTopButton } from "./PageBackToTopButton";

/**
 * The floating corner controls for ordinary pages. Same look as the homepage's
 * {@link WhatsAppFloatingButton}, minus the narration mute toggle — inner pages
 * carry no section narration to mute.
 */
export function PageWhatsAppButton() {
  return (
    <div className="fixed right-7 bottom-7 z-40 flex flex-col items-center gap-3 sm:right-10 sm:bottom-9 lg:right-11 lg:bottom-10">
      <PageBackToTopButton />

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
