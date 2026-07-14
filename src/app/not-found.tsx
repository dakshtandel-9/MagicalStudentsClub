import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { FuzzyText } from "@/components/ui/FuzzyText";

export const metadata: Metadata = {
  title: "404 — Page not found | Magical Students Club",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6 py-20">
      <div className="flex flex-col items-center text-center">
        <div className="font-display">
          <FuzzyText
            fontSize="clamp(5rem, 20vw, 12rem)"
            color="#f8f8fa"
            baseIntensity={0.18}
            hoverIntensity={0.5}
            clickEffect
          >
            404
          </FuzzyText>
        </div>

        <h1 className="text-ink mt-8 text-2xl sm:text-3xl">
          This page pulled a disappearing act.
        </h1>
        <p className="text-muted mt-3 max-w-md text-[15px] leading-relaxed">
          The link you followed is broken or the page has moved. Head back to the
          homepage and pick up where you left off.
        </p>

        <ButtonLink href="/" size="lg" className="mt-8">
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </ButtonLink>
      </div>
    </main>
  );
}
