import { AtSign, Clock, Mail, MapPin, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { contact, contactPage, telHref, whatsappHref } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { WhatsAppGlyph } from "@/components/ui/WhatsAppGlyph";

export const metadata = pageMetadata({
  title: "Contact Our Memory Training Institute in Bengaluru",
  description:
    "Reach Magical Students Club on WhatsApp, phone or email, or visit our memory training institute in Bengaluru. Open 10 AM–5 PM.",
  path: "/contact",
  keywords: [
    "Memory Training Institute",
    "Memory Workshop",
    "Magical Students Club",
  ],
});

const detailClass =
  "text-muted hover:text-ink flex items-start gap-3 text-[15px] transition-colors";

export default function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={contactPage.eyebrow}
        title={contactPage.heading}
        subtitle={contactPage.intro}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <Card contentClassName="p-6 sm:p-7">
              <h2 className="text-ink text-lg font-semibold">Send a message</h2>
              <div className="mt-5">
                <ContactForm />
              </div>
            </Card>
          </div>

          <div className="grid gap-5">
            <Card contentClassName="grid gap-4 p-6 sm:p-7">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={detailClass}>
                <WhatsAppGlyph className="text-primary mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="text-ink block font-medium">WhatsApp</span>
                  {contact.whatsapp}
                </span>
              </a>

              <a href={`tel:+91${contact.support}`} className={detailClass}>
                <Phone className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <span className="text-ink block font-medium">Support</span>
                  {contact.support}
                </span>
              </a>

              <a href={`mailto:${contact.email}`} className={detailClass}>
                <Mail className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <span className="text-ink block font-medium">Email</span>
                  {contact.email}
                </span>
              </a>

              <div className={detailClass}>
                <Clock className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <span className="text-ink block font-medium">Hours</span>
                  {contact.hours}
                </span>
              </div>

              <div className={detailClass}>
                <MapPin className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <span className="text-ink block font-medium">Address</span>
                  <address className="not-italic">{contact.address}</address>
                </span>
              </div>

              <a
                href={`https://instagram.com/${contact.social.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={detailClass}
              >
                <AtSign className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
                <span>
                  <span className="text-ink block font-medium">Social</span>
                  {contact.social}
                </span>
              </a>
            </Card>

            <a
              href={telHref}
              className="border-primary/40 bg-primary/5 text-ink hover:bg-primary/10 flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-[15px] font-medium transition-colors"
            >
              <Phone className="size-4" aria-hidden />
              Call {contact.whatsapp.slice(0, 5)} {contact.whatsapp.slice(5)}
            </a>

            <Card className="overflow-hidden" contentClassName="p-0">
              <iframe
                title="Magical Students Club location"
                src="https://www.google.com/maps?q=No.+57,+6th+Main,+Nagendra+Block,+BSK+II+Stage,+Bengaluru&output=embed"
                className="h-64 w-full grayscale-[40%] sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Card>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
