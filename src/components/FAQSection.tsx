import { ArrowRight, Minus, Plus } from "lucide-react";
import { faqIntro, faqs } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * Native <details>/<summary>: focusable, toggles on Enter and Space, exposes
 * expanded state to assistive tech, and needs no client JS. Several items may
 * be open at once, which is the behaviour people expect when scanning answers.
 */
export function FAQSection() {
  return (
    <Section id="faq" labelledBy="faq-heading" fullscreen>
      <Reveal>
        <div className="flex justify-center">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <span id="faq-heading">Quick Answers to Common Questions</span>
            }
            subtitle={faqIntro.lead}
          />
        </div>
      </Reveal>

      <div className="mx-auto mt-14 max-w-3xl lg:mt-16">
        <ul className="grid gap-4">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <li className="list-none">
                <details className="group bg-card border-line hover:border-muted/30 rounded-[16px] border transition-colors">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-ink text-[15px] font-medium">
                      {faq.q}
                    </h3>
                    <span className="border-line text-primary inline-flex size-7 shrink-0 items-center justify-center rounded-full border">
                      <Plus
                        className="size-3.5 group-open:hidden"
                        aria-hidden
                      />
                      <Minus
                        className="hidden size-3.5 group-open:block"
                        aria-hidden
                      />
                    </span>
                  </summary>
                  <p className="text-muted px-6 pb-6 text-[15px] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-12 flex justify-center">
            <ButtonLink href="/faq" variant="secondary">
              View All FAQs
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
