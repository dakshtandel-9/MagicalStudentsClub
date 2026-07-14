import type { Metadata } from "next";
import { contact, legalPage } from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Privacy Policy | Magical Students Club",
  description: "How Magical Students Club collects, uses and protects your information.",
};

const h2 = "text-ink mt-10 text-xl font-semibold first:mt-0";
const p = "text-muted mt-3 text-[15px] leading-relaxed text-pretty";
const li = "text-muted text-[15px] leading-relaxed";

export default function PrivacyPolicyPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={legalPage.privacy.eyebrow}
        title={legalPage.privacy.heading}
        subtitle={legalPage.privacy.updated}
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className={p}>
              This policy explains what information Magical Students Club
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you use this
              website or enquire about our programs, and how that information
              is used.
            </p>

            <h2 className={h2}>Information we collect</h2>
            <ul className="mt-3 grid gap-2">
              <li className={li}>
                Contact details you share with us — name, phone number, and
                email — when you fill in a form or message us on WhatsApp.
              </li>
              <li className={li}>
                Your child&rsquo;s grade or exam target, where you choose to
                share it, so we can recommend the right program.
              </li>
              <li className={li}>
                Basic usage data (pages visited, device type) collected
                through standard analytics tools.
              </li>
            </ul>

            <h2 className={h2}>How we use it</h2>
            <p className={p}>
              We use your information to respond to enquiries, recommend
              programs, and keep you informed about sessions you&rsquo;ve
              enrolled in. We do not sell your information to third parties.
            </p>

            <h2 className={h2}>WhatsApp communication</h2>
            <p className={p}>
              Messaging us on WhatsApp is subject to WhatsApp&rsquo;s own
              privacy terms in addition to this policy. We use WhatsApp only
              to communicate about your enquiry or enrollment.
            </p>

            <h2 className={h2}>Data retention</h2>
            <p className={p}>
              We retain enquiry and enrollment information for as long as
              needed to provide our programs and to meet legal or accounting
              requirements, after which it is deleted or anonymised.
            </p>

            <h2 className={h2}>Your rights</h2>
            <p className={p}>
              You can ask us to access, correct, or delete the information we
              hold about you at any time by contacting us using the details
              below.
            </p>

            <h2 className={h2}>Contact us</h2>
            <p className={p}>
              For any privacy question, write to{" "}
              <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary-hover">
                {contact.email}
              </a>{" "}
              or message us on WhatsApp at {contact.whatsapp}.
            </p>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
