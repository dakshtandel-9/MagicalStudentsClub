import Image from "next/image";

/**
 * Sits inside the hero, between the hero content and the stats bar. The source
 * SVGs are already white-on-transparent, so they need no filter on the dark
 * card — only the opacity dip that keeps them subordinate to the headline.
 *
 * Deliberately not a box: no border, no background, no card frame. It is a bare
 * strip of logos on the hero panel, and the BorderGlow treatment applied to the
 * cards elsewhere is not applied here.
 */
const logos = [
  { src: "/featuredIn/featuredIn1.svg", alt: "YourStory", width: 147, height: 32 },
  { src: "/featuredIn/featuredIn2.svg", alt: "Outlook", width: 156, height: 32 },
  { src: "/featuredIn/featuredIn3.svg", alt: "Forbes", width: 108, height: 28 },
  { src: "/featuredIn/featuredIn4.svg", alt: "Entrepreneur India", width: 142, height: 32 },
  { src: "/featuredIn/featuredIn6.svg", alt: "Moneycontrol", width: 148, height: 32 },
];

export function FeaturedIn() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <p className="text-muted shrink-0 text-[11px] font-medium tracking-[0.18em] uppercase">
        Featured in
      </p>

      {/* Hairline lead-in, mirroring the separators used across the cards. */}
      <div className="bg-line hidden h-px w-8 shrink-0 sm:block" aria-hidden />

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:justify-start sm:gap-x-10">
        {logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-4 w-auto opacity-55 transition-opacity duration-200 hover:opacity-90 sm:h-5"
          />
        ))}
      </div>
    </div>
  );
}
