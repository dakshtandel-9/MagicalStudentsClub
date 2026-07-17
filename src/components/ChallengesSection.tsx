import { challenges, challengesIntro } from "@/content/site";
import { FeatureCard } from "./ui/Card";
import type { IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { Mark, SectionHeading } from "./ui/SectionHeading";

export function ChallengesSection() {
  return (
    <Section id="challenges" labelledBy="challenges-heading" card>
      <Reveal>
        <div className="flex justify-center">
          <SectionHeading
            title={
              <span id="challenges-heading">
                Is Your Child Facing These <Mark>Challenges?</Mark>
              </span>
            }
            subtitle={challengesIntro.lead}
          />
        </div>
      </Reveal>

      {/* `items-stretch` is the grid default, so every Reveal is already the
          height of the tallest in its row — but a Reveal is a plain div that
          sizes to its child, so the stretch stopped there and the card inside
          kept its own text height. `h-full` on the wrapper passes the row height
          down to the card, which fills it. */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {challenges.map((item, i) => (
          <Reveal key={item.title} delay={i * 80} className="h-full">
            <FeatureCard
              icon={item.icon as IconName}
              title={item.title}
              body={item.body}
              // Below `sm` this grid is a single column, so every card runs
              // full width; from `sm` to `lg` it's 2-up, so only the
              // right-hand column (odd index) borders the card's edge and can
              // land behind the fixed WhatsApp/mute/back-to-top column — see
              // "Clearance for the floating button column" in globals.css.
              // `--fab-clear` resolves to 0 at `lg` and up.
              contentClassName={
                i % 2 === 1
                  ? "pr-[var(--fab-clear)]"
                  : "pr-[var(--fab-clear)] sm:pr-6"
              }
            />
          </Reveal>
        ))}
      </div>

      <Reveal delay={140}>
        <p className="text-muted mx-auto mt-14 max-w-xl text-center text-[15px] leading-relaxed text-balance lg:mt-16">
          {challengesIntro.transition}
        </p>
      </Reveal>

      <Reveal delay={180}>
        <p className="text-muted mt-8 text-center text-lg text-balance sm:text-xl">
          Your child isn&rsquo;t slow.{" "}
          <span className="text-ink font-medium">
            Their <Mark>study method</Mark> may be the problem.
          </span>
        </p>
      </Reveal>
    </Section>
  );
}
