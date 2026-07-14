import { stats, trust } from "@/content/site";
import { Card, IconChip } from "./ui/Card";
import type { IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHeading } from "./ui/SectionHeading";

export function StatsBar() {
  return (
    <Section id="trust" labelledBy="trust-heading" fullscreen>
      <Reveal>
        <div className="flex justify-center">
          <SectionHeading
            eyebrow={trust.eyebrow}
            title={<span id="trust-heading">{trust.heading}</span>}
            subtitle={trust.intro}
          />
        </div>
      </Reveal>

      <Reveal delay={80}>
        <Card className="mt-14 overflow-hidden lg:mt-16">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "flex flex-col items-center p-7 text-center sm:p-8 lg:p-10",
                  "border-line",
                  i % 2 === 0 ? "border-r" : "",
                  i < 2 ? "border-b lg:border-b-0" : "",
                  "lg:border-b-0",
                  i !== stats.length - 1 ? "lg:border-r" : "lg:border-r-0",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <IconChip name={stat.icon as IconName} />
                <dt className="sr-only">{stat.label}</dt>
                <dd className="mt-5">
                  <span className="font-display text-ink tabular block text-3xl leading-none font-bold sm:text-4xl lg:text-[2.75rem]">
                    {stat.value}
                  </span>
                  <span className="text-ink mt-3 block text-sm font-medium">
                    {stat.label}
                  </span>
                  <span className="text-muted mx-auto mt-2 block max-w-[15rem] text-[13px] leading-relaxed">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </Reveal>

      <Reveal delay={140}>
        <p className="text-muted mx-auto mt-12 max-w-2xl text-center text-[15px] leading-relaxed text-balance lg:mt-14">
          {trust.statement}
        </p>
      </Reveal>
    </Section>
  );
}
