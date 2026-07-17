import { ArrowRight, Minus, Plus } from "lucide-react";
import { pageMetadata, JsonLd, faqJsonLd } from "@/lib/seo";
import { faqPage, whatsappHref } from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { BorderGlow } from "@/components/ui/BorderGlow";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Section";

export const metadata = pageMetadata({
  title: "Memory Training FAQ for Parents & Students",
  description:
    "Answers about our memory training programs — age groups, online and hybrid learning, competitive exam preparation, fees and enrollment.",
  path: "/faq",
  keywords: [
    "Memory Training for Students",
    "Memory Improvement Course",
    "Exam Preparation Skills",
  ],
});

export default function FAQPage() {
  return (
    <PageShell>
      <JsonLd data={faqJsonLd} />
      <PageHeader
        eyebrow={faqPage.eyebrow}
        title={faqPage.heading}
        subtitle={faqPage.intro}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {faqPage.groups.map((group) => (
            <div key={group.key}>
              <h2 className="text-ink text-lg font-semibold">{group.label}</h2>
              <ul className="mt-4 grid gap-2.5">
                {group.items.map((faq) => (
                  <li key={faq.q} className="list-none">
                    <BorderGlow className="bg-card border-line border">
                      <details name={`faq-${group.key}`} className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                          <h3 className="text-ink text-[15px] font-medium">
                            {faq.q}
                          </h3>
                          <span className="border-line text-primary inline-flex size-7 shrink-0 items-center justify-center rounded-full border">
                            <Plus className="size-3.5 group-open:hidden" aria-hidden />
                            <Minus className="hidden size-3.5 group-open:block" aria-hidden />
                          </span>
                        </summary>
                        <p className="text-muted px-5 pb-5 text-[15px] leading-relaxed">
                          {faq.a}
                        </p>
                      </details>
                    </BorderGlow>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-line border-t">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-ink text-2xl font-semibold sm:text-3xl">
            Still have a question?
          </h2>
          <p className="text-muted max-w-md text-[15px] leading-relaxed text-pretty">
            Message us on WhatsApp and we&rsquo;ll answer it directly.
          </p>
          <ButtonLink href={whatsappHref} size="lg">
            Chat on WhatsApp
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </Container>
      </Section>
    </PageShell>
  );
}
