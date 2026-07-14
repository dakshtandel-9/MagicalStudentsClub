import type { ReactNode } from "react";
import { BorderGlow } from "./BorderGlow";

/** Content column. 1280px cap, generous gutters — per the design rules. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/**
 * Vertical rhythm lives here and nowhere else, so no section can quietly
 * disagree with its neighbours about spacing.
 *
 * `card` renders the section as a bordered, rounded surface on the page
 * background — the unit that stacks and overtakes on scroll. It also gives the
 * section a min-height of 80vh on desktop, with content centred in the leftover
 * space. Min-height, never fixed: a section whose content runs taller simply
 * grows rather than clipping. Below lg both the card framing and the height rule
 * relax, and sections size to their content.
 */
export function Section({
  children,
  id,
  className,
  labelledBy,
  card = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
  card?: boolean;
}) {
  if (!card) {
    return (
      <section
        id={id}
        aria-labelledby={labelledBy}
        className={`py-16 sm:py-20 lg:py-24 ${className ?? ""}`}
      >
        <Container>{children}</Container>
      </section>
    );
  }

  return (
    // Margin on all four sides, so each card floats as its own panel with page
    // background around it. The card stays opaque — cards overlap as they
    // scroll, and a translucent one would leak the card beneath.
    //
    // Neither glow can live on the <section> itself: that element is
    // overflow-hidden (which would clip both blooms) and opaque (which would
    // hide them). Both ride on this wrapper, which is neither, and paint in the
    // margin around the panel:
    //
    //   .glow-lg   the static pink halo. Bare, it is the top edge only — the
    //              leading edge of a card riding up. The sides belong to the
    //              hero and the bottom to the footer; a mid-stack card is
    //              flanked and covered, so a glow there would read as a seam.
    //   BorderGlow the pointer-tracked lit border and bloom, same brand pink,
    //              on whichever edge the pointer is nearest.
    //
    // The BorderGlow radius/background are matched to the panel below so its
    // mesh-gradient border traces the panel's own outline rather than a
    // differently-rounded ghost of it.
    <BorderGlow
      className={["glow-lg", "mx-3 my-3 sm:mx-5 sm:my-4 lg:mx-6 lg:my-5"].join(
        " ",
      )}
      borderRadius={20}
      backgroundColor="var(--color-background)"
      // The panels are far larger than the inner cards, so the pointer spends
      // most of its life in the dead centre of one. A lower sensitivity lights
      // the edge from further out; a wider bloom keeps it in proportion to the
      // panel rather than looking like a hairline on a wall.
      edgeSensitivity={20}
      glowRadius={60}
      coneSpread={30}
      // The static .glow-lg halo is already pink light around this panel — a
      // full-strength wash on top of it turns the panel edge magenta. This
      // layer only has to add the pointer-tracked highlight.
      fillOpacity={0.25}
    >
      <section
        id={id}
        aria-labelledby={labelledBy}
        className={[
          "border-line bg-background relative overflow-hidden rounded-[20px] border",
          // One viewport tall on desktop, with its vertical margin and the sticky
          // top offset accounted for, so a pinned card sits fully on screen.
          //
          // min-height, never a fixed height. A fixed card cannot hold content
          // that runs taller than the viewport, so it either clips it against the
          // overflow-hidden above or hands it to an inner scroller — and an inner
          // scroller slides the section's own heading up under that same clipped
          // edge the moment it is touched. A card that simply grows has neither
          // problem: nothing is ever cut off, and the deck scrolls the taller card
          // past like any other.
          "px-2 py-14 sm:py-16 lg:flex lg:min-h-[calc(100vh-2.5rem)] lg:items-center lg:py-6",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Container className="relative">{children}</Container>
      </section>
    </BorderGlow>
  );
}
