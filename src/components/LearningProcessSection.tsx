import { hybridIntro, hybridModel } from "@/content/site";
import { Card } from "./ui/Card";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHeading } from "./ui/SectionHeading";

export function LearningProcessSection() {
  return (
    <Section id="how-it-works" labelledBy="how-heading" card>
      <Reveal>
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="How Learning Works"
            title={<span id="how-heading">Our Hybrid Learning Model</span>}
            subtitle={hybridIntro.lead}
          />
        </div>
      </Reveal>

      <ol className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {/* Connector runs behind the cards on desktop only, where the steps sit
            on one line and the sequence reads left-to-right. */}
        {/* Sits on the icon centre line: card padding (2rem) + half the 3.5rem icon. */}
        <span
          aria-hidden
          className="spine-track absolute top-[3.75rem] right-[12.5%] left-[12.5%] hidden h-px lg:block"
        />

        {hybridModel.map((step, i) => (
          <Reveal key={step.title} delay={i * 80} className="h-full">
            <Card
              hover
              as="li"
              className="relative flex h-full list-none flex-col items-center p-7 text-center lg:p-8"
            >
              <span className="bg-card border-line text-primary relative z-10 inline-flex size-14 items-center justify-center rounded-full border">
                <Icon name={step.icon as IconName} className="size-6" />
              </span>

              <span className="border-primary/40 bg-background text-primary font-display tabular absolute top-4 right-4 inline-flex size-6 items-center justify-center rounded-full border text-[11px] font-bold">
                {i + 1}
              </span>

              <h3 className="text-ink mt-5 text-[15px] font-semibold">
                {step.title}
              </h3>
              <p className="text-muted mt-1.5 text-sm">{step.body}</p>
              <p className="text-muted mt-3 text-[13px] leading-relaxed text-pretty">
                {step.detail}
              </p>
            </Card>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
