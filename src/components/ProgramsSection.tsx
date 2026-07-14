import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { programs, programsIntro } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Card, IconChip } from "./ui/Card";
import type { IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHeading } from "./ui/SectionHeading";

export function ProgramsSection() {
  return (
    <Section id="programs" labelledBy="programs-heading" fullscreen>
      <Reveal>
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="Our Programs"
            title={
              <span id="programs-heading">Programs Built for Smarter Learning</span>
            }
            subtitle={programsIntro.lead}
          />
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {programs.map((program, i) => (
          <Reveal key={program.title} delay={i * 80} className="h-full">
            <Card hover as="article" className="flex h-full flex-col p-7 lg:p-8">
              <IconChip name={program.icon as IconName} />

              <h3 className="text-ink mt-5 text-lg font-semibold">
                {program.title}
              </h3>
              <p className="text-muted mt-3 text-[15px] leading-relaxed">
                {program.body}
              </p>
              <p className="text-muted mt-3 text-[14px] leading-relaxed text-pretty">
                {program.detail}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 pt-7">
                <span className="border-line text-muted rounded-full border px-2.5 py-1 text-[11px] font-medium">
                  {program.audience}
                </span>

                <Link
                  href="/services"
                  className="text-primary hover:text-primary-hover group inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  Learn More
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                  <span className="sr-only">about {program.title}</span>
                </Link>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={160}>
        <div className="mt-14 flex flex-col items-center gap-5 lg:mt-16">
          <p className="text-muted max-w-md text-center text-[15px] leading-relaxed text-balance">
            {programsIntro.cta}
          </p>
          <ButtonLink href="/services" variant="secondary" size="lg">
            View All Programs
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
