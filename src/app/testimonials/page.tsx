import type { Metadata } from "next";
import { Play, Quote, Star } from "lucide-react";
import Image from "next/image";
import {
  testimonialsPage,
  videoTestimonials,
  writtenTestimonials,
} from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Container, Section } from "@/components/ui/Section";
import { Mark, SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Testimonials | Magical Students Club",
  description:
    "What parents, students and competitive exam aspirants say about learning with Magical Students Club.",
};

function VideoTestimonial({ item }: { item: (typeof videoTestimonials)[number] }) {
  if (item.placeholder || !item.youtubeId) {
    return (
      <Card className="border-dashed" contentClassName="p-0">
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
    <Card className="group relative" contentClassName="p-0">
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

function WrittenTestimonial({ item }: { item: (typeof writtenTestimonials)[number] }) {
  if (item.placeholder || !item.quote) {
    return (
      <Card className="border-dashed" contentClassName="p-6">
        <Quote className="text-muted/40 size-6" aria-hidden />
        <p className="text-muted mt-4 text-sm">Written testimonial</p>
        <p className="text-muted/60 mt-1 text-xs">
          Awaiting a verified quote with permission to publish.
        </p>
      </Card>
    );
  }

  const rating = "rating" in item ? item.rating : null;
  const initials = item.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Card contentClassName="p-6">
      <Quote className="text-primary size-6" aria-hidden />
      <blockquote className="text-ink mt-4 text-[15px] leading-relaxed">
        {item.quote}
      </blockquote>
      <footer className="mt-4 flex items-center gap-3">
        {initials ? (
          <span className="border-primary/40 text-ink inline-flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
            {initials}
          </span>
        ) : null}
        <div>
          <p className="text-ink text-sm font-medium">{item.name}</p>
          {item.role ? <p className="text-muted text-xs">{item.role}</p> : null}
          {rating ? (
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="fill-primary text-primary size-3.5" aria-hidden />
              ))}
            </div>
          ) : null}
        </div>
      </footer>
    </Card>
  );
}

export default function TestimonialsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={testimonialsPage.eyebrow}
        title={testimonialsPage.heading}
        subtitle={testimonialsPage.intro}
      />

      {/* Rating summary */}
      <Section>
        <Container className="flex justify-center">
          <Card contentClassName="flex items-center gap-4 px-8 py-6">
            <span className="font-display text-ink tabular text-3xl font-bold">
              {testimonialsPage.ratingSummary.value}
              <span className="text-primary">★</span>
            </span>
            <div className="border-line border-l pl-4">
              <p className="text-ink text-sm font-semibold">
                {testimonialsPage.ratingSummary.label}
              </p>
              <p className="text-muted text-xs">
                {testimonialsPage.ratingSummary.detail}
              </p>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Video testimonials */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="On Camera"
          title={
            <>
              Hear It <Mark>Directly</Mark>
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {videoTestimonials.map((item) => (
            <VideoTestimonial key={item.id} item={item} />
          ))}
        </div>
      </Section>

      {/* Written testimonials, grouped */}
      <Section className="border-line border-t">
        <SectionHeading
          eyebrow="In Their Words"
          title={
            <>
              Parents, Students <Mark>and Aspirants</Mark>
            </>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {writtenTestimonials.map((item) => (
            <WrittenTestimonial key={item.id} item={item} />
          ))}

          {/* Remaining group slots, awaiting quotes with permission to publish. */}
          {testimonialsPage.groups.slice(writtenTestimonials.length).map((group) => (
            <Card key={group.key} className="border-dashed" contentClassName="p-6">
              <Quote className="text-muted/40 size-6" aria-hidden />
              <p className="text-muted mt-4 text-sm">{group.label}</p>
              <p className="text-muted/60 mt-1 text-xs">
                Awaiting a verified quote with permission to publish.
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
