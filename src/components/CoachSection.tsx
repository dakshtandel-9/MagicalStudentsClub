import Image from "next/image";
import { coach } from "@/content/site";
import { Card } from "./ui/Card";
import { Icon, type IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { Eyebrow } from "./ui/SectionHeading";

export function CoachSection() {
  return (
    <Section id="coach" labelledBy="coach-heading" card>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
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
              sizes="(max-width: 1024px) 340px, 420px"
              className="relative h-auto w-full object-contain [mask-image:linear-gradient(to_bottom,black_64%,transparent_93%)] [-webkit-mask-image:linear-gradient(to_bottom,black_64%,transparent_93%)]"
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
            <p className="text-muted mt-6 text-[15px] leading-relaxed text-pretty sm:text-base">
              {coach.bio}
            </p>
            <p className="text-muted mt-4 text-[15px] leading-relaxed text-pretty">
              {coach.bioExtra}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12">
              {coach.credibility.map((point) => (
                <Card
                  key={point.text}
                  as="li"
                  className="flex list-none items-center gap-3 p-5"
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
