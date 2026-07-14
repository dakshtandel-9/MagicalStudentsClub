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
import { CardStack, StackItem } from "@/components/ui/CardStack";

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
    <>
      <main>
        <CardStack>
          {stacked.map((SectionComponent, i) => (
            <StackItem key={SectionComponent.name} index={i}>
              <SectionComponent />
            </StackItem>
          ))}
        </CardStack>
      </main>
      <WhatsAppFloatingButton />
    </>
  );
}
