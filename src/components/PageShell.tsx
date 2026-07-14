import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PageWhatsAppButton } from "./PageWhatsAppButton";
import { Container } from "./ui/Section";
import { Eyebrow } from "./ui/SectionHeading";

/**
 * Chrome for every page except the homepage. The homepage is a pinned card
 * deck (`CardStack` + `EnterGate` + section narration) built specifically for
 * that one scroll-driven experience — inner pages are ordinary documents that
 * flow top to bottom, sharing only the header, footer and floating WhatsApp
 * button with it.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main>
      <Header />
      {children}
      <Footer />
      <PageWhatsAppButton />
    </main>
  );
}

/**
 * The banner every inner page opens with: eyebrow, title, one line of support.
 * Deliberately plain — no portrait, no glow, no stat bar. The brief reserves
 * that treatment for the homepage hero alone.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="border-line border-b pt-32 pb-12 sm:pt-36 sm:pb-14 lg:pt-40 lg:pb-16">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display text-ink text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-muted mt-4 text-[15px] leading-relaxed text-pretty sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
