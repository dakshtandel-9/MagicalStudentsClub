import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { hero, whatsappHref } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Section";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";
import { StatsBar } from "./StatsBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 lg:pt-16 lg:pb-20">
      {/* Single soft pink glow behind the portrait. The only glow on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-6rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full opacity-60 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,62,140,0.16) 0%, rgba(232,62,140,0) 68%)",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="order-2 lg:order-1">
            <h1 className="font-display text-ink text-[2.1rem] leading-[1.1] font-bold text-balance sm:text-5xl lg:text-[3.4rem]">
              Schools tell your child{" "}
              <span className="text-muted">WHAT</span> to study.
              <br className="hidden sm:block" /> We teach them{" "}
              <span className="text-primary">HOW</span> to study.
            </h1>

            <p className="text-muted mt-6 max-w-xl text-[15px] leading-relaxed text-pretty sm:text-base">
              {hero.supporting}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={whatsappHref} size="lg">
                <WhatsAppGlyph className="size-[18px]" />
                Chat on WhatsApp
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" size="lg">
                Explore Programs
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            {/* Dotted field: the "unretained" texture the spine motif resolves. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-6 top-6 bottom-0 rounded-full opacity-[0.35]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #242832 1px, transparent 1px)",
                backgroundSize: "16px 16px",
                maskImage:
                  "radial-gradient(circle at 50% 45%, black 30%, transparent 72%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 45%, black 30%, transparent 72%)",
              }}
            />

            <div className="relative mx-auto flex max-w-[380px] items-end justify-center lg:max-w-[460px]">
              <Image
                src="/images/pradeep-acharya.png"
                alt="Pradeep Acharya, memory and learning coach at Magical Students Club"
                width={500}
                height={500}
                priority
                sizes="(max-width: 1024px) 380px, 460px"
                className="h-auto w-full object-contain"
              />

              {/* Experience callout, anchored to the portrait. */}
              <div className="bg-card/90 border-line absolute bottom-6 -left-2 rounded-2xl border px-4 py-3 backdrop-blur-sm sm:-left-4">
                <p className="font-display text-ink tabular text-2xl leading-none font-bold">
                  20+
                </p>
                <p className="text-muted mt-1 text-[11px] leading-tight">
                  Years coaching
                  <br />
                  memory &amp; learning
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 lg:mt-16">
          <StatsBar />
        </div>
      </Container>
    </section>
  );
}
