import Image from "next/image";
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
          {/* Padding moves inside, onto the content: the decorative blob and the
              brain are absolutely positioned and meant to bleed to the card's
              rim, which they can only do if the padding is not on the element
              they are positioned against. Card clips them to the rounded corners
              on its inner wrapper — the `overflow-hidden` that used to do that
              job here would now also clip the card's outer bloom. */}
          <Card className="relative" contentClassName="relative p-0">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-70 blur-[70px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,62,140,0.14) 0%, rgba(232,62,140,0) 70%)",
              }}
            />

            {/* Neon brain fills the empty right half, clear of the 5R column.
                The drop-shadows stack into a pink halo around the strokes —
                a box-shadow would glow the element's rect, not the artwork. */}
            <Image
              aria-hidden
              src="/images/brain-neon.png"
              alt=""
              width={900}
              height={870}
              priority={false}
              className="pointer-events-none absolute top-[58%] right-2 w-56 -translate-y-1/2 opacity-90 select-none sm:w-72 lg:w-80"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(232,62,140,0.55)) drop-shadow(0 0 22px rgba(232,62,140,0.4)) drop-shadow(0 0 48px rgba(232,62,140,0.25))",
              }}
            />

            <div className="relative p-7 sm:p-8">
              <Eyebrow>The 5R System</Eyebrow>
              <h3 className="font-display text-ink max-w-[75%] text-2xl leading-tight font-semibold text-balance">
                Our Anti-Boring Learning System
              </h3>

              {/* The recall spine, vertical: dotted between steps, solid nodes.
                  Width is capped so the labels never run under the brain. */}
              <ol className="mt-7 max-w-[58%] space-y-0">
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
                  className="group relative flex flex-col items-center text-center lg:flex-1"
                >
                  {i !== learningSteps.length - 1 ? (
                    <span
                      aria-hidden
                      className="spine-track absolute top-7 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] lg:block"
                    />
                  ) : null}

                  {/* A pink bloom behind the chip. Painted as its own blurred
                      layer rather than a box-shadow: the chip is `bg-card` and
                      opaque, so it covers the middle of the bloom and only the
                      light spilling past the rim shows. Sized past the chip and
                      pushed under it (`-z-10` inside the chip's own stacking
                      context) so it never tints the icon or the border. */}
                  <span className="relative z-10 isolate inline-flex">
                    <span
                      aria-hidden
                      className="bg-primary absolute -inset-1.5 -z-10 rounded-full opacity-30 blur-lg transition-opacity duration-300 group-hover:opacity-50"
                    />
                    <span className="bg-card border-line text-primary hover:border-primary/40 inline-flex size-14 items-center justify-center rounded-full border transition-colors">
                      <Icon name={step.icon as IconName} className="size-6" />
                    </span>
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
