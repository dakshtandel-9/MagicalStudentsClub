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

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {challenges.map((item, i) => (
          <Reveal key={item.title} delay={i * 80}>
            <FeatureCard
              icon={item.icon as IconName}
              title={item.title}
              body={item.body}
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
