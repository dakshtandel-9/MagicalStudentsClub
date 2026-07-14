import { fiveR, learningSteps, methodIntro } from "@/content/site";
import { Card } from "./ui/Card";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { Eyebrow, Mark } from "./ui/SectionHeading";

export function LearningMethodSection() {
  return (
    <Section id="method" labelledBy="method-heading" card>
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* 5R panel. Labels only — the guide defines no copy for each R, and
            inventing it would mean inventing the method. */}
        <Reveal>
          <Card className="relative overflow-hidden p-7 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-70 blur-[70px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,62,140,0.14) 0%, rgba(232,62,140,0) 70%)",
              }}
            />

            <div className="relative">
              <Eyebrow>The 5R System</Eyebrow>
              <h3 className="font-display text-ink text-2xl leading-tight font-semibold text-balance">
                Our Anti-Boring Learning System
              </h3>

              {/* The recall spine, vertical: dotted between steps, solid nodes. */}
              <ol className="mt-7 space-y-0">
                {fiveR.map((r, i) => (
                  <li key={r} className="relative flex items-center gap-4 pb-6 last:pb-0">
                    {i !== fiveR.length - 1 ? (
                      <span
                        aria-hidden
                        className="spine-track-y absolute top-9 bottom-0 left-[17px] w-px"
                      />
                    ) : null}

                    <span className="border-primary/40 bg-primary/10 text-primary font-display tabular relative z-10 inline-flex size-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold">
                      {i + 1}
                    </span>
                    <span className="font-display text-ink text-lg font-medium">
                      {r}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Card>
        </Reveal>

        <div>
          <Reveal>
            <h2
              id="method-heading"
              className="font-display text-ink text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl"
            >
              We Teach Students{" "}
              <Mark>How to Learn Effectively</Mark>
            </h2>
            <p className="text-muted mt-5 max-w-xl text-[15px] leading-relaxed text-pretty">
              {methodIntro.lead}
            </p>
          </Reveal>

          {/* Understand → Remember → Recall → Apply → Achieve.
              A real sequence, so the connector carries meaning. */}
          <Reveal delay={80}>
            <ol className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:mt-14 lg:flex lg:items-start lg:justify-between lg:gap-3">
              {learningSteps.map((step, i) => (
                <li
                  key={step.label}
                  className="relative flex flex-col items-center text-center lg:flex-1"
                >
                  {i !== learningSteps.length - 1 ? (
                    <span
                      aria-hidden
                      className="spine-track absolute top-7 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] lg:block"
                    />
                  ) : null}

                  <span className="bg-card border-line text-primary hover:border-primary/40 relative z-10 inline-flex size-14 items-center justify-center rounded-full border transition-colors">
                    <Icon name={step.icon as IconName} className="size-6" />
                  </span>
                  <span className="text-ink mt-4 text-sm font-medium">
                    {step.label}
                  </span>
                  <span className="text-muted mt-2 block text-[13px] leading-relaxed text-pretty">
                    {step.detail}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
