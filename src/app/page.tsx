import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsBar } from "@/components/StatsBar";
import { ChallengesSection } from "@/components/ChallengesSection";
import { LearningMethodSection } from "@/components/LearningMethodSection";
import { ProgramsSection } from "@/components/ProgramsSection";
import { LearningProcessSection } from "@/components/LearningProcessSection";
import { CoachSection } from "@/components/CoachSection";
import { ResultsSection } from "@/components/ResultsSection";
import { FAQSection } from "@/components/FAQSection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StatsBar />
        <ChallengesSection />
        <LearningMethodSection />
        <ProgramsSection />
        <LearningProcessSection />
        <CoachSection />
        <ResultsSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
