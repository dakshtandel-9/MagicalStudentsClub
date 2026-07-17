import { Newspaper } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { blogPage } from "@/content/site";
import { PageHeader, PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";

export const metadata = pageMetadata({
  title: "Memory Techniques & Study Skills Blog",
  description:
    "Practical reads on memory techniques for students, study skills, exam preparation, speed reading and parenting — how to study, not just what to study.",
  path: "/blog",
  keywords: [
    "Memory Techniques for Students",
    "Study Skills for Students",
    "Learning Skills for Students",
    "Exam Preparation Skills",
    "Speed Reading Course",
  ],
});

export default function BlogPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow={blogPage.eyebrow}
        title={blogPage.heading}
        subtitle={blogPage.intro}
      />

      <Section>
        <div className="flex flex-wrap justify-center gap-2">
          {blogPage.categories.map((cat) => (
            <span
              key={cat}
              className="border-line text-muted rounded-full border px-4 py-2 text-sm font-medium"
            >
              {cat}
            </span>
          ))}
        </div>

        <Card className="mt-10 border-dashed" contentClassName="p-10 text-center">
          <span className="border-line text-muted mx-auto inline-flex size-12 items-center justify-center rounded-full border">
            <Newspaper className="size-5" aria-hidden />
          </span>
          <p className="text-muted mt-4 text-[15px]">
            The first articles are on the way.
          </p>
          <p className="text-muted/60 mt-1 text-sm">
            New posts on memory technique, study skills and exam preparation
            will appear here as they&rsquo;re published.
          </p>
        </Card>
      </Section>
    </PageShell>
  );
}
