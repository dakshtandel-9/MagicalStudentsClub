import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { hero, whatsappHref } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { BorderGlow } from "./ui/BorderGlow";
import { Container } from "./ui/Section";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";
import { StatsBar } from "./StatsBar";
import { FeaturedIn } from "./FeaturedIn";
import { Header } from "./Header";

export function HeroSection() {
  return (
    // Card frame matches the stacked sections, with the same all-round margin.
    // The nav is the card's own top row — a fixed part of the hero, not a
    // floating bar. Exactly one viewport tall, margins included.
    //
    // The hero hand-rolls its panel rather than using <Section card>, because it
    // needs the nav as its own top row. That means it must also hand-roll the
    // panel's two glows, and they have to stay in step with the ones Section
    // gives every other boulder — same BorderGlow props, same brand pink.
    // Neither glow can sit on the <section>: it is overflow-hidden (which clips
    // the bloom) and opaque (which hides it), so both ride on this wrapper.
    <div className="bg-background">
      {/* glow-x: the hero is the one panel seen whole against the page on both
          sides, so its static halo runs left and right as well as on top. */}
      <BorderGlow
        // One screen tall on every device — the phone viewport less this
        // wrapper's `my-3` gutter (1.5rem), and one full viewport less the
        // `my-5` gutter (2.5rem) on desktop. `dvh` on mobile so browser chrome
        // does not push the card's bottom under the address bar.
        className="glow-lg glow-x mx-3 my-3 h-[calc(100dvh-1.5rem)] sm:mx-5 sm:my-4 sm:h-[calc(100dvh-2rem)] lg:mx-6 lg:my-5 lg:h-[calc(100vh-2.5rem)]"
        borderRadius={20}
        backgroundColor="var(--color-background)"
        edgeSensitivity={20}
        glowRadius={60}
        coneSpread={30}
        fillOpacity={0.25}
      >
        <section className="border-line bg-background relative flex h-full flex-col overflow-hidden rounded-[20px] border">
        <Header />

        {/* Single soft pink glow behind the portrait. The only glow on the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-6rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full opacity-60 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,62,140,0.16) 0%, rgba(232,62,140,0) 68%)",
        }}
      />

      {/* Fills the height left by the nav row, so the hero content sits centred
          in the card rather than pinned under the nav. On a phone, if the
          content runs past that height it scrolls here inside the card rather
          than growing the box or clipping — `min-h-0` lets a flex child
          actually shrink to enable the scroll, and `data-stack-scrollable`
          keeps that scroll from advancing the deck.

          Centring is `my-auto` on the inner column, never `justify-content` on
          this scroller: centring content taller than a scroller strands its
          top half above the scrollport, unreachably — which is how the phone
          hero used to open on the featured-in strip with the portrait and
          headline lost off the top. Auto margins collapse to zero once the
          content overflows, so the same markup centres when it fits and
          scrolls from the very top when it does not. */}
      <div
        data-stack-scrollable
        className="relative flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-visible"
      >
        <Container className="my-auto py-6 sm:py-10 lg:py-4">
        <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="order-2 lg:order-1">
            {/* Four deliberate lines: the WHAT/HOW contrast has to land on its
                own line for the antithesis to read. The phone size is clamped
                against the *available* width, not the viewport, so the
                longest line ("Schools tell your child") never wraps and
                breaks the four-line lockup — the column is narrower than the
                viewport by the floating button column's reserved clearance
                (globals.css), so the fluid term is tuned against that
                narrower column, not a bare vw. */}
            <h1 className="font-display text-ink text-[clamp(1.3rem,6vw,2.1rem)] leading-[1.12] font-bold sm:text-[2.75rem] lg:text-[3.25rem]">
              <span className="block">Schools tell your child</span>
              <span className="block">
                <span className="text-muted">WHAT</span> to study.
              </span>
              <span className="mt-2 block">We teach them</span>
              <span className="block">
                <span className="text-primary">HOW</span> to study.
              </span>
            </h1>

            {/* `pr-[var(--fab-clear)]` below `lg`: this paragraph runs the
                full width of its column, so its last line or two can land
                right where the fixed WhatsApp/mute/back-to-top column sits
                once the hero's own content is scrolled — see "Clearance for
                the floating button column" in globals.css. Reset at `lg`
                since the deck's centred column already clears that corner
                there. */}
            <p className="text-muted mt-4 max-w-xl pr-[var(--fab-clear)] text-[15px] leading-relaxed text-pretty sm:mt-6 sm:text-base lg:pr-0">
              {hero.supporting}
            </p>

            {/* Capped so the floating WhatsApp button in the bottom-right can
                never come to rest on top of a CTA on a phone. */}
            <div className="mt-6 flex max-w-[19rem] flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center">
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

          {/* Nudged down: the portrait is the tallest cell, so without this its
              crown rides up into the nav row above. */}
          <div className="relative order-1 lg:order-2 lg:pt-14">
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

            {/* The portrait is the tallest cell in the grid, so it alone decides
                the row height — and therefore whether the featured-in strip and
                the stats bar still fit inside the 100vh card. Cap it against the
                viewport so a short screen shrinks the portrait instead of
                pushing the stats bar out through the card's bottom edge.

                Below lg the hero's own content scroll is gated (see the phone
                deck in globals.css) rather than free — a card only advances
                once its content is read to the end — so the first screen no
                longer has to fit the whole hero at once, and the portrait can
                run larger: 46dvh/50dvh rather than the tighter 30/38 it needed
                back when everything had to land above the fold. The cap sits
                on the image itself, not this wrapper: `max-h-full` on the
                image cannot resolve against a wrapper whose own height is
                auto, so a wrapper-only cap lets the image spill past it and
                crop into the nav. */}
            <div className="relative mx-auto flex max-w-[360px] items-end justify-center sm:max-w-[440px] lg:max-h-[42vh] lg:max-w-[440px]">
              {/* The source cutout is square and ends in a flat bottom edge.
                  Fade the last strip out so it dissolves into the page instead
                  of stopping on a hard horizontal line. */}
              <Image
                src="/images/pradeep-acharya.png"
                alt="Pradeep Acharya, memory and learning coach at Magical Students Club"
                width={500}
                height={500}
                priority
                sizes="(max-width: 1024px) 440px, 480px"
                className="h-auto max-h-[46dvh] w-full object-contain sm:max-h-[50dvh] lg:max-h-full [mask-image:linear-gradient(to_bottom,black_62%,transparent_92%)] [-webkit-mask-image:linear-gradient(to_bottom,black_62%,transparent_92%)]"
              />

              {/* Experience callout, clear of the portrait's lower edge. */}
              <div className="bg-card/90 border-line absolute bottom-10 -left-1 rounded-2xl border px-4 py-3 backdrop-blur-sm sm:-left-6">
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

        <div className="mt-10 lg:mt-8">
          <FeaturedIn />
        </div>

        <div className="mt-8 lg:mt-6">
          <StatsBar />
        </div>
        </Container>
      </div>
        </section>
      </BorderGlow>
    </div>
  );
}
