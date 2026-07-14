import type { Metadata } from "next";
import { galleryPage } from "@/content/site";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Gallery | Magical Students Club",
  description:
    "Workshops, academy sessions, events, media coverage and videos from Magical Students Club.",
};

export default function GalleryPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={galleryPage.eyebrow}
        title={galleryPage.heading}
        subtitle={galleryPage.intro}
      />

      <Section>
        <GalleryGrid />
      </Section>
    </PageShell>
  );
}
