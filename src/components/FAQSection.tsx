import { ArrowRight, Minus, Plus } from "lucide-react";
import { faqIntro, faqs } from "@/content/site";
import { BorderGlow } from "./ui/BorderGlow";
import { ButtonLink } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { Section } from "./ui/Section";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * Native <details>/<summary>: focusable, toggles on Enter and Space, exposes
 * expanded state to assistive tech, and needs no client JS.
 *
 * The shared `name` makes them an exclusive accordion — the browser closes the
 * open item when another is opened, so only one answer shows at a time. This is
 * the platform's own behaviour (the same rule radio buttons share a name for),
 * which is why this section needs no state and stays a server component.
 */
export function FAQSection() {
  return (
    <Section id="faq" labelledBy="faq-heading" card>
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

      <div className="mx-auto mt-9 max-w-3xl lg:mt-8">
        <ul className="grid gap-2.5">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 60}>
              <li className="list-none">
                {/* The glow wraps the row rather than living on the <details>
                    itself: BorderGlow needs an inner wrapper it can clip, and a
                    <details> must keep <summary> as its own first child for the
                    native disclosure behaviour to work. */}
                <BorderGlow className="bg-card border-line border">
                  <details name="faq" className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:px-5 [&::-webkit-details-marker]:hidden">
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
                    <p className="text-muted px-5 pb-5 text-[15px] leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                </BorderGlow>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={120}>
          <div className="mt-8 flex justify-center">
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
