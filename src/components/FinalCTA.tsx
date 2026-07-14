import { Phone } from "lucide-react";
import { contact, finalCta, telHref, whatsappHref } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

export function FinalCTA() {
  return (
    <Section labelledBy="cta-heading">
      <Reveal>
        {/* Pink is carried by the border, the glow and the button — not a slab
            of gradient. Keeps the card premium and the text legible. */}
        <div className="border-primary/25 bg-card relative overflow-hidden rounded-[20px] border px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full opacity-80 blur-[90px]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(232,62,140,0.20) 0%, rgba(232,62,140,0) 70%)",
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <h2
              id="cta-heading"
              className="font-display text-ink text-2xl leading-[1.2] font-semibold text-balance sm:text-[2rem]"
            >
              {finalCta.headline}
            </h2>
            <p className="text-muted mt-4 text-[15px] text-pretty sm:text-base">
              {finalCta.supporting}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={whatsappHref}
                size="lg"
                className="w-full sm:w-auto"
              >
                <WhatsAppGlyph className="size-[18px]" />
                Chat on WhatsApp
              </ButtonLink>
              <ButtonLink
                href={telHref}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Phone className="size-4" aria-hidden />
                Call {contact.whatsapp.slice(0, 5)}&nbsp;
                {contact.whatsapp.slice(5)}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
