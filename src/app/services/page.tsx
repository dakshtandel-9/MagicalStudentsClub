import { ArrowRight, Check } from "lucide-react";
import { pageMetadata, JsonLd, coursesJsonLd } from "@/lib/seo";
import {
  programs,
  hybridModel,
  servicesPage,
  whatsappHref,
} from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { ButtonLink } from "@/components/ui/Button";
import { Card, IconChip } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, Section } from "@/components/ui/Section";
import { Mark, SectionHeading } from "@/components/ui/SectionHeading";
import { BorderGlow } from "@/components/ui/BorderGlow";

export const metadata = pageMetadata({
  title: "Memory Improvement Courses & Programs for Students",
  description:
    "Memory Mastery Workshop, Hybrid Learning Program and Competitive Exam Track — memory improvement courses that teach students how to learn, from Grade 5 to UPSC, NEET, JEE, SSC and Banking prep.",
  path: "/services",
  keywords: [
    "Memory Improvement Course",
    "Memory Workshop",
    "Speed Reading Course",
    "Brain Training for Students",
    "Student Success Program",
    "Memory Training for Students",
  ],
});

export default function ServicesPage() {
  return (
    <PageShell>
      <JsonLd data={coursesJsonLd} />
      <PageHeader
        eyebrow={servicesPage.eyebrow}
        title={servicesPage.heading}
        subtitle={servicesPage.intro}
      />

      {/* Who it's for */}
      <Section>
        <div className="grid gap-5 sm:grid-cols-2">
          {servicesPage.audiences.map((a) => (
            <Card key={a.key} contentClassName="p-6">
              <span className="border-line text-muted inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium">
                {a.label}
              </span>
              <p className="text-muted mt-4 text-[15px] leading-relaxed text-pretty">
                {a.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Program cards */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="The Programs"
          title={
            <>
              Three Routes Into the <Mark>Same Skill</Mark>
            </>
          }
          subtitle="Chosen by where a student is and what they are working towards."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {programs.map((program) => (
            <Card
              key={program.title}
              hover
              as="article"
              className="h-full"
              contentClassName="flex h-full flex-col p-6"
            >
              <IconChip name={program.icon as IconName} />
              <h3 className="text-ink mt-5 text-lg font-semibold">
                {program.title}
              </h3>
              <p className="text-muted mt-2.5 text-[15px] leading-relaxed">
                {program.body}
              </p>
              <p className="text-muted mt-2.5 text-[14px] leading-relaxed text-pretty">
                {program.detail}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="border-line text-muted rounded-full border px-2.5 py-1 text-[11px] font-medium">
                  {program.audience}
                </span>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  Ask About This
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* How the hybrid model works */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              The <Mark>Hybrid Learning</Mark> Model
            </>
          }
          subtitle="Recorded lessons alone do not change how a student studies — the model pairs them with live practice, daily doubt clearing and a facilitator."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {hybridModel.map((step) => (
            <Card key={step.title} hover contentClassName="flex items-start gap-4 p-5">
              <span className="bg-primary/10 ring-primary/15 text-primary inline-flex size-11 shrink-0 items-center justify-center rounded-full ring-1">
                <Icon name={step.icon as IconName} className="size-5" />
              </span>
              <div>
                <h3 className="text-ink text-[15px] font-semibold">
                  {step.title}
                </h3>
                <p className="text-muted mt-1 text-sm">{step.body}</p>
                <p className="text-muted mt-2 text-[13px] leading-relaxed text-pretty">
                  {step.detail}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Academic and life skills */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="Beyond Marks"
          title={
            <>
              Academic <Mark>and</Mark> Life Skills
            </>
          }
          subtitle="The same techniques carry past the exam a student is preparing for right now."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicesPage.lifeSkills.map((skill) => (
            <Card key={skill.title} hover as="article" contentClassName="p-6">
              <IconChip name={skill.icon as IconName} />
              <h3 className="text-ink mt-5 text-[15px] font-semibold">
                {skill.title}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {skill.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Certificates / credentials */}
      <Section className="border-line border-t">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Credentials"
              title={
                <>
                  Taught With <Mark>Real Experience</Mark> Behind It
                </>
              }
            />
          </div>
          <ul className="grid gap-3">
            {servicesPage.credentials.map((line) => (
              <li key={line} className="flex items-start gap-3">
                <span className="bg-primary/10 text-primary mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full">
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span className="text-muted text-[15px] leading-relaxed text-pretty">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Program FAQs */}
      <Section className="border-line border-t">
        <SectionHeading eyebrow="FAQ" title="Program Questions, Answered" />

        <div className="mx-auto mt-10 max-w-3xl">
          <ul className="grid gap-2.5">
            {servicesPage.faqs.map((faq) => (
              <li key={faq.q} className="list-none">
                <BorderGlow className="bg-card border-line border">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:px-5 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-ink text-[15px] font-medium">
                        {faq.q}
                      </h3>
                      <span className="border-line text-primary inline-flex size-7 shrink-0 items-center justify-center rounded-full border transition-transform group-open:rotate-45">
                        <ArrowRight className="size-3.5 -rotate-45" aria-hidden />
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

          <div className="mt-8 flex justify-center">
            <ButtonLink href="/faq" variant="secondary">
              View All FAQs
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* WhatsApp CTA */}
      <Section className="border-line border-t">
        <Container className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-ink text-2xl font-semibold sm:text-3xl">
            Not sure which program fits?
          </h2>
          <p className="text-muted max-w-md text-[15px] leading-relaxed text-pretty">
            Tell us the grade or the exam on WhatsApp and we&rsquo;ll point you
            to the right one.
          </p>
          <ButtonLink href={whatsappHref} size="lg">
            Chat on WhatsApp
          </ButtonLink>
        </Container>
      </Section>
    </PageShell>
  );
}
