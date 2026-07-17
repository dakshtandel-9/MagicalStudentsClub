import { galleryPage } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Section } from "@/components/ui/Section";

export const metadata = pageMetadata({
  title: "Memory Workshop & Training Gallery",
  description:
    "Photos and videos from memory workshops, academy sessions, events and media coverage of Magical Students Club.",
  path: "/gallery",
  keywords: [
    "Memory Workshop",
    "Memory Training Institute",
    "Brain Training for Students",
  ],
});

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
