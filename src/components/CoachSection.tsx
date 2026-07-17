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
                  "radial-gradient(circle at 50% 55%, rgba(232,62,140,0.25) 0%, rgba(232,62,140,0) 70%)",
              }}
            />
            <Card className="relative overflow-hidden" contentClassName="p-0">
              <Image
                src="/images/AboutImage.png"
                alt="Portrait of Pradeep Acharya"
                width={500}
                height={500}
                loading="lazy"
                sizes="(max-width: 1024px) 340px, 420px"
                className="relative h-auto w-full object-cover"
              />
            </Card>
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
              {coach.credibility.map((point, i) => (
                <Card
                  key={point.text}
                  as="li"
                  className="list-none"
                  contentClassName={[
                    "flex items-center gap-3 p-5",
                    // Below `lg`, whichever card actually borders the card's
                    // right edge reserves the fixed WhatsApp/mute/back-to-top
                    // column's width, so its label never scrolls in
                    // underneath the buttons (globals.css, "Clearance for the
                    // floating button column"). Below `sm` this grid is a
                    // single column — every card is that right-hand edge; from
                    // `sm` it's two-up, so only the odd (right-column) cards
                    // need it, and at `lg` the reserved width is 0 anyway.
                    "pr-[calc(1.25rem+var(--fab-clear))] sm:pr-5",
                    i % 2 === 1 ? "sm:pr-[calc(1.25rem+var(--fab-clear))]" : "",
                  ].join(" ")}
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
