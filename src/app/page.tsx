import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { ChallengesSection } from "@/components/ChallengesSection";
import { LearningMethodSection } from "@/components/LearningMethodSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import { LearningProcessSection } from "@/components/LearningProcessSection";
import { CoachSection } from "@/components/CoachSection";
import { ResultsSection } from "@/components/ResultsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { EnterGate } from "@/components/EnterGate";
import { CardStack, StackItem } from "@/components/ui/CardStack";
import {
  SectionAudioPlayer,
  NarrationSection,
} from "@/components/SectionAudioPlayer";

/** Title, description and Open Graph inherit the root layout's defaults. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * The page scrolls as a deck: each card pins near the top of the viewport while
 * the next rides up and covers it. Order here is the stacking order — z-index is
 * derived from position, so moving a section moves its layer.
 *
 * The footer is the last card in the deck: the FAQ card slides up over it just
 * like every other pair.
 */
const stacked = [
  HeroSection,
  ChallengesSection,
  LearningMethodSection,
  ProgramsSection,
  LearningProcessSection,
  CoachSection,
  ResultsSection,
  FAQSection,
  Footer,
];

export default function HomePage() {
  return (
    <SectionAudioPlayer>
      <main>
        <CardStack>
          {stacked.map((SectionComponent, i) => (
            <NarrationSection key={SectionComponent.name} index={i}>
              <StackItem index={i}>
                <SectionComponent />
              </StackItem>
            </NarrationSection>
          ))}
        </CardStack>
      </main>
      {/* The mute button inside here reads the narration state, so this must
          stay within SectionAudioPlayer's subtree, not just the card stack. */}
      <WhatsAppFloatingButton />
      {/* Covers the page on arrival and parts to reveal it. Last, so it lands
          over the deck and the floating button alike. */}
      <EnterGate />
    </SectionAudioPlayer>
  );
}
