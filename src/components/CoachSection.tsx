import Image from "next/image";
import { coach } from "@/content/site";
import { Card } from "./ui/Card";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { Eyebrow } from "./ui/SectionHeading";

export function CoachSection() {
  return (
    <Section id="coach" labelledBy="coach-heading">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative mx-auto max-w-[420px]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full opacity-70 blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, rgba(232,62,140,0.13) 0%, rgba(232,62,140,0) 70%)",
              }}
            />
            <Image
              src="/images/pradeep-acharya.png"
              alt="Portrait of Pradeep Acharya"
              width={500}
              height={500}
              loading="lazy"
              sizes="(max-width: 1024px) 420px, 420px"
              className="relative h-auto w-full object-contain"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>{coach.eyebrow}</Eyebrow>
            <h2
              id="coach-heading"
              className="font-display text-ink text-3xl leading-tight font-semibold sm:text-4xl"
            >
              {coach.name}
            </h2>
            <p className="text-muted mt-5 text-[15px] leading-relaxed text-pretty sm:text-base">
              {coach.bio}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {coach.credibility.map((point) => (
                <Card
                  key={point.text}
                  as="li"
                  className="flex list-none items-center gap-3 p-4"
                >
                  <Icon
                    name={point.icon as IconName}
                    className="text-primary size-[18px] shrink-0"
                  />
                  <span className="text-ink text-[13px] leading-snug font-medium">
                    {point.text}
                  </span>
                </Card>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
