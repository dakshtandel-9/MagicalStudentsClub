import { ArrowRight, Play, Quote } from "lucide-react";
import Image from "next/image";
import {
  results,
  videoTestimonials,
  writtenTestimonials,
} from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Card, IconChip } from "./ui/Card";
import type { IconName } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";

/**
 * Video facade. Renders a thumbnail + play button and only swaps in the iframe
 * on click, so no YouTube embed is loaded on first paint. Where no asset has
 * been supplied yet it renders an empty frame rather than a fake person.
 */
function VideoTestimonial({
  item,
}: {
  item: (typeof videoTestimonials)[number];
}) {
  if (item.placeholder || !item.youtubeId) {
    return (
      <Card className="border-dashed">
        <div className="flex aspect-video flex-col items-center justify-center gap-2 p-4 text-center">
          <span className="border-line text-muted inline-flex size-10 items-center justify-center rounded-full border">
            <Play className="size-4" aria-hidden />
          </span>
          <p className="text-muted text-xs">Video testimonial</p>
          <p className="text-muted/60 text-[11px]">Awaiting client asset</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden">
      <a
        href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <span className="relative block aspect-video">
          <Image
            src={item.thumbnail ?? ""}
            alt={`Video testimonial from ${item.name ?? "a parent"}`}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 280px"
            className="object-cover"
          />
          <span className="absolute inset-0 grid place-items-center bg-black/35 transition-colors group-hover:bg-black/25">
            <span className="bg-primary inline-flex size-11 items-center justify-center rounded-full text-white">
              <Play className="size-4 translate-x-px fill-current" aria-hidden />
            </span>
          </span>
        </span>
        {item.name ? (
          <span className="block p-4">
            <span className="text-ink block text-sm font-medium">
              {item.name}
            </span>
            {item.role ? (
              <span className="text-muted block text-xs">{item.role}</span>
            ) : null}
          </span>
        ) : null}
      </a>
    </Card>
  );
}

function WrittenTestimonial({
  item,
}: {
  item: (typeof writtenTestimonials)[number];
}) {
  if (item.placeholder || !item.quote) {
    return (
      <Card className="border-dashed p-6">
        <Quote className="text-muted/40 size-6" aria-hidden />
        <p className="text-muted mt-4 text-sm">
          Written testimonial
        </p>
        <p className="text-muted/60 mt-1 text-xs">
          Awaiting a verified quote with permission to publish.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Quote className="text-primary size-6" aria-hidden />
      <blockquote className="text-ink mt-4 text-[15px] leading-relaxed">
        {item.quote}
      </blockquote>
      <footer className="mt-4">
        <p className="text-ink text-sm font-medium">{item.name}</p>
        {item.role ? <p className="text-muted text-xs">{item.role}</p> : null}
      </footer>
    </Card>
  );
}

export function ResultsSection() {
  return (
    <Section id="results" labelledBy="results-heading">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <Reveal>
            <h2
              id="results-heading"
              className="font-display text-ink text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl"
            >
              Real Results. Real Transformations.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4">
            {results.map((result, i) => (
              <Reveal key={result.title} delay={i * 80}>
                <Card hover className="flex items-start gap-4 p-5">
                  <IconChip name={result.icon as IconName} size="sm" />
                  <div>
                    <h3 className="text-ink text-[15px] font-semibold">
                      {result.title}
                    </h3>
                    <p className="text-muted mt-1 text-sm leading-relaxed">
                      {result.body}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <Reveal delay={160}>
            <div className="mt-8">
              <ButtonLink href="/results" variant="secondary">
                View All Results
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <h2 className="font-display text-ink text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl">
              What Parents &amp; Students Say
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {videoTestimonials.map((item) => (
                <VideoTestimonial key={item.id} item={item} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-4 grid gap-4">
              {writtenTestimonials.map((item) => (
                <WrittenTestimonial key={item.id} item={item} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-8">
              <ButtonLink href="/testimonials" variant="secondary">
                View All Testimonials
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
