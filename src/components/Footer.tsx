import Link from "next/link";
import { AtSign, Clock, Mail, MapPin, Phone } from "lucide-react";
import { contact, footer, whatsappHref } from "@/content/site";
import { Container } from "./ui/Section";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

function ColumnHeading({ children }: { children: string }) {
  return (
    <h2 className="text-ink mb-4 text-[13px] font-semibold tracking-wide">
      {children}
    </h2>
  );
}

const linkClass =
  "text-muted hover:text-ink text-sm transition-colors inline-block py-1";

export function Footer() {
  return (
    <footer className="border-line border-t">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-8 lg:py-16">
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

        <div className="border-line flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row">
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
  );
}
