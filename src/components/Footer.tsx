import Link from "next/link";
import { AtSign, Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact, finalCta, footer, telHref, whatsappHref } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { Container } from "./ui/Section";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

// Sits under the footer's own <h2> (the closing CTA), so these are h3s.
function ColumnHeading({ children }: { children: string }) {
  return (
    <h3 className="text-ink mb-4 text-[13px] font-semibold tracking-wide">
      {children}
    </h3>
  );
}

const linkClass =
  "text-muted hover:text-ink text-sm transition-colors inline-block py-1";

export function Footer() {
  return (
    // Card frame, matching the sections above. A full viewport tall on desktop
    // with its content centred. The closing CTA lives here, so the height is
    // carried by real content rather than empty space. The gutter around the
    // card stays transparent — only the card itself is filled.
    <div>
      {/* The last card in the deck, with nothing stacked below it — so it is the
          only panel that glows along its bottom edge. As elsewhere, the glow
          rides this wrapper because the <footer> itself clips its overflow. */}
      <div className="glow-lg glow-y mx-3 my-3 rounded-[20px] sm:mx-5 sm:my-4 lg:mx-6 lg:my-5 lg:h-[calc(100vh-2.5rem)]">
        <footer className="border-primary/25 bg-background relative h-full overflow-hidden rounded-[20px] border lg:flex lg:flex-col lg:justify-center">
        {/* Pink is carried by the border, the glow and the button — not a slab
            of gradient. Keeps the card premium and the text legible. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full opacity-80 blur-[90px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(232,62,140,0.20) 0%, rgba(232,62,140,0) 70%)",
          }}
        />

        <Container>
          <Reveal>
            <div className="relative mx-auto max-w-2xl px-2 pt-14 pb-10 text-center sm:px-8 lg:pt-10">
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
          </Reveal>

          {/* Divider between the closing pitch and the site index. */}
          <div className="border-line relative border-t" />

          <div className="relative grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-8 lg:py-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="bg-primary/10 ring-primary/20 text-primary font-display inline-flex size-8 items-center justify-center rounded-lg text-sm font-bold ring-1">
                M
              </span>
              <span className="font-display text-ink text-[15px] font-semibold">
                Magical Students Club
              </span>
            </Link>

            <p className="text-muted mt-4 max-w-xs text-sm leading-relaxed">
              {footer.description}
            </p>

            <a
              href={`https://instagram.com/${contact.social.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-ink border-line hover:border-muted/40 mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              <AtSign className="size-3.5" aria-hidden />
              {contact.social}
            </a>
          </div>

          <nav aria-label="Quick links">
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul>
              {footer.quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Programs">
            <ColumnHeading>Programs</ColumnHeading>
            <ul>
              {footer.programs.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="space-y-3">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink flex items-start gap-2.5 text-sm transition-colors"
                >
                  <WhatsAppGlyph className="text-primary mt-0.5 size-4 shrink-0" />
                  WhatsApp {contact.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+91${contact.support}`}
                  className="text-muted hover:text-ink flex items-start gap-2.5 text-sm transition-colors"
                >
                  <Phone className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                  Support {contact.support}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-muted hover:text-ink flex items-start gap-2.5 text-sm transition-colors"
                >
                  <Mail className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                  {contact.email}
                </a>
              </li>
              <li className="text-muted flex items-start gap-2.5 text-sm">
                <Clock className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                {contact.hours}
              </li>
              <li className="text-muted flex items-start gap-2.5 text-sm">
                <MapPin className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                <address className="not-italic">{contact.address}</address>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-line relative flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row">
          <p className="text-muted text-xs">
            &copy; {new Date().getFullYear()} Magical Students Club. All rights
            reserved.
          </p>
          <ul className="flex items-center gap-6">
            {footer.legal.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted hover:text-ink text-xs transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </Container>
        </footer>
      </div>
      {/* Being the last card, nothing after it pads the document the way every
          other card is padded by the one that follows — so without this, the
          deck's scroll clamp (`max = scrollHeight - innerHeight`) can fall a
          few px short of the footer's `top-5` pin line and park it with a gap
          above. This spacer buys enough slack for it to fully reach the pin. */}
      <div aria-hidden className="lg:h-8" />
    </div>
  );
}
