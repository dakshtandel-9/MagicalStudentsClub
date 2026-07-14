import type { Metadata } from "next";
import { contact, legalPage } from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Terms & Conditions | Magical Students Club",
  description: "Terms and conditions for using the Magical Students Club website and programs.",
};

const h2 = "text-ink mt-10 text-xl font-semibold first:mt-0";
const p = "text-muted mt-3 text-[15px] leading-relaxed text-pretty";

export default function TermsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={legalPage.terms.eyebrow}
        title={legalPage.terms.heading}
        subtitle={legalPage.terms.updated}
      />

      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <p className={p}>
              These terms govern your use of the Magical Students Club
              website and enrollment in our programs. By using this site or
              enrolling in a program, you agree to the terms below.
            </p>

            <h2 className={h2}>Programs</h2>
            <p className={p}>
              Program names, formats, and schedules described on this website
              are subject to change. Exact fees, dates, and inclusions are
              confirmed directly with our team before enrollment.
            </p>

            <h2 className={h2}>Enrollment</h2>
            <p className={p}>
              Enrollment is confirmed once a student or parent has agreed to
              the specific program details shared by our team and completed
              any required payment.
            </p>

            <h2 className={h2}>Results and outcomes</h2>
            <p className={p}>
              Our programs teach study and memory techniques; outcomes depend
              on individual practice and application. Results shown on this
              website reflect verified student experiences and are not a
              guarantee of similar outcomes for every student.
            </p>

            <h2 className={h2}>Intellectual property</h2>
            <p className={p}>
              Course material, techniques, and content shared during our
              programs are for the enrolled student&rsquo;s personal use and
              may not be reproduced or redistributed without permission.
            </p>

            <h2 className={h2}>Cancellations and refunds</h2>
            <p className={p}>
              Cancellation and refund terms are confirmed at the time of
              enrollment and may vary by program. Contact our support team
              for the terms applicable to your enrollment.
            </p>

            <h2 className={h2}>Contact us</h2>
            <p className={p}>
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${contact.email}`} className="text-primary hover:text-primary-hover">
                {contact.email}
              </a>{" "}
              or via WhatsApp at {contact.whatsapp}.
            </p>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
