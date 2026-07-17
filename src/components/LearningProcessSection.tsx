import { hybridIntro, hybridModel } from "@/content/site";
import { Card } from "./ui/Card";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { Eyebrow, Mark } from "./ui/SectionHeading";

const anytime = hybridModel.filter((step) => step.cadence === "anytime");
const live = hybridModel.filter((step) => step.cadence === "live");

/**
 * Two columns, not four equal boxes: the model is a weekly rhythm of two
 * self-paced pieces a student reaches for on their own time, and two human
 * ones that happen with someone else present. Grouping by *when it happens*
 * is true of the content — a plain 1-2-3-4 numbering would not be.
 */
export function LearningProcessSection() {
  return (
    <Section id="how-it-works" labelledBy="how-heading" card>
      <Reveal>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>How Learning Works</Eyebrow>
          <h2
            id="how-heading"
            className="text-ink text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl"
          >
            Two Rhythms. <Mark>One Habit.</Mark>
          </h2>
          <p className="text-muted mt-3 text-[15px] leading-relaxed text-pretty">
            {hybridIntro.lead}
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch lg:gap-10">
        <RhythmColumn
          label="On their own time"
          caption="Self-paced"
          marker="dotted"
          steps={anytime}
          delayBase={0}
        />

        {/* The seam between rhythms. A label, not a number — nothing here is a
            step order, so counting the columns would be inventing a sequence
            the content doesn't have. */}
        <div className="hidden items-center lg:flex">
          <div className="flex h-full flex-col items-center gap-3">
            <span className="spine-track-y h-full w-px flex-1" />
            <span className="text-muted font-display text-[11px] font-semibold tracking-[0.18em] uppercase [writing-mode:vertical-rl]">
              plus
            </span>
            <span className="spine-track-y h-full w-px flex-1" />
          </div>
        </div>

        <div className="flex items-center lg:hidden" aria-hidden>
          <span className="spine-track h-px flex-1" />
          <span className="text-muted font-display px-3 text-[11px] font-semibold tracking-[0.18em] uppercase">
            plus
          </span>
          <span className="spine-track h-px flex-1" />
        </div>

        <RhythmColumn
          label="With someone watching"
          caption="Live &amp; human"
          marker="live"
          steps={live}
          delayBase={2}
        />
      </div>
    </Section>
  );
}

type HybridStep = (typeof hybridModel)[number];

function RhythmColumn({
  label,
  caption,
  marker,
  steps,
  delayBase,
}: {
  label: string;
  caption: string;
  marker: "dotted" | "live";
  steps: HybridStep[];
  delayBase: number;
}) {
  return (
    <div className="flex flex-col">
      <Reveal delay={delayBase * 80}>
        <div className="flex items-center gap-2.5">
          <RhythmMarker kind={marker} />
          <span className="text-ink text-sm font-semibold">{label}</span>
          <span className="text-muted text-xs">— {caption}</span>
        </div>
      </Reveal>

      <div className="mt-5 flex flex-1 flex-col gap-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={(delayBase + i) * 80} className="flex-1">
            <Card
              hover
              className="h-full"
              // Below `lg` the outer grid is a single column (`lg:grid-cols-`
              // is the only column split), so every card here runs full width
              // and can end up scrolled behind the fixed WhatsApp/mute/
              // back-to-top column — see "Clearance for the floating button
              // column" in globals.css. `--fab-clear` itself resolves to 0 at
              // `lg` and up, so no override is needed there.
              contentClassName="flex items-start gap-4 p-6 pr-[calc(1.5rem+var(--fab-clear))]"
            >
              <span
                className={[
                  "relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full border",
                  marker === "live"
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-background border-line text-muted",
                ].join(" ")}
              >
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
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/** Encodes the same on-your-own vs. with-someone distinction as the column
 * label: a static open ring for self-paced, a quietly pulsing solid dot for
 * live. Small enough to read as punctuation, not decoration. */
function RhythmMarker({ kind }: { kind: "dotted" | "live" }) {
  if (kind === "dotted") {
    return (
      <span
        aria-hidden
        className="border-muted/60 size-2.5 shrink-0 rounded-full border border-dashed"
      />
    );
  }

  return (
    <span aria-hidden className="relative flex size-2.5 shrink-0">
      <span className="bg-primary/60 absolute inline-flex h-full w-full animate-ping rounded-full [animation-duration:2.2s]" />
      <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
    </span>
  );
}
