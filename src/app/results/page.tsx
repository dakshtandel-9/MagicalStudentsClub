import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { resultsPage, whatsappHref } from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconChip } from "@/components/ui/Card";
import type { IconName } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { Mark, SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = pageMetadata({
  title: "Student Results — Academic Excellence & Exam Success",
  description:
    "Real results from students who learned how to learn — academic improvements, better retention and recall, and verified rank holders in competitive exams.",
  path: "/results",
  keywords: [
    "Academic Excellence Program",
    "Student Success Program",
    "Exam Preparation Skills",
    "Memory Training for Students",
  ],
});

export default function ResultsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={resultsPage.eyebrow}
        title={resultsPage.heading}
        subtitle={resultsPage.intro}
      />

      {/* Overview categories */}
      <Section>
        <div className="grid gap-5 sm:grid-cols-3">
          {resultsPage.categories.map((result) => (
            <Card key={result.title} hover contentClassName="flex items-start gap-4 p-5">
              <IconChip name={result.icon as IconName} size="sm" />
              <div>
                <h3 className="text-ink text-[15px] font-semibold">
                  {result.title}
                </h3>
                <p className="text-muted mt-1 text-sm leading-relaxed">
                  {result.body}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Featured stories */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="Featured Stories"
          title={
            <>
              Students Who <Mark>Changed Their Method</Mark>
            </>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {resultsPage.featuredStories.map((story) => (
            <Card key={story.id} className="border-dashed" contentClassName="p-6">
              <p className="text-muted text-sm">Student story</p>
              <p className="text-muted/60 mt-1 text-xs">
                Awaiting a verified story with permission to publish.
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Rank holders */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="Rank Holders"
          title={
            <>
              Aspirants Who <Mark>Carried Technique</Mark> Into Their Exams
            </>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {resultsPage.rankHolders.map((holder) => (
            <Card key={holder.id} className="border-dashed" contentClassName="p-6 text-center">
              <p className="text-muted text-sm">Rank holder</p>
              <p className="text-muted/60 mt-1 text-xs">
                Awaiting verified name, exam and rank.
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Before / after demonstration */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="Before & After"
          title={
            <>
              What Changes When a Student <Mark>Learns How to Learn</Mark>
            </>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Card contentClassName="p-6">
            <span className="border-line text-muted inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium">
              Before
            </span>
            <p className="text-muted mt-4 text-[15px] leading-relaxed text-pretty">
              {resultsPage.demonstration.before}
            </p>
          </Card>
          <Card contentClassName="p-6">
            <span className="border-primary/40 text-primary inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium">
              After
            </span>
            <p className="text-muted mt-4 text-[15px] leading-relaxed text-pretty">
              {resultsPage.demonstration.after}
            </p>
          </Card>
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-line border-t">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-ink text-2xl font-semibold sm:text-3xl">
            Want results like these for your child?
          </h2>
          <p className="text-muted max-w-md text-[15px] leading-relaxed text-pretty">
            Speak with our team and find the right learning program.
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
