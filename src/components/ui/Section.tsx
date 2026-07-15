import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { BorderGlow } from "./BorderGlow";

/**
 * Content column. 1280px cap, generous gutters — per the design rules.
 *
 * Forwards any extra `<div>` props (e.g. `data-stack-scrollable`, so a
 * Container that scrolls its own overflow on a phone is not read by CardStack
 * as a deck gesture).
 */
export function Container({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 ${className ?? ""}`}
      {...rest}
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
          // On phones each card is exactly one screen tall — the viewport less
          // this wrapper's `my-3` gutter (0.75rem top + bottom = 1.5rem) — so
          // every section reads as its own full panel rather than a ragged
          // run of differently-sized boxes. `dvh`, not `vh`: mobile browser
          // chrome shrinks the visible viewport, and `vh` ignores that and
          // overshoots under the address bar.
          "flex h-[calc(100dvh-1.5rem)] flex-col",
          // Desktop keeps the growing card instead: min-height, never fixed, so
          // content taller than the viewport simply extends the card and the
          // deck scrolls it past like any other (a fixed card there would clip
          // or hand off to a scroller that slides the heading out of view).
          // `justify-center` centres the content in the leftover space, the way
          // the row layout used to with `items-center`.
          "lg:h-auto lg:min-h-[calc(100vh-2.5rem)] lg:justify-center",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* The scroll region. On a phone a card whose content runs taller than
            one screen scrolls here, inside its own panel, rather than growing
            the box or clipping against the section's overflow-hidden. It is a
            flex column so the inner block's `my-auto` centres it vertically
            when it fits and yields to scrolling when it does not — plain
            `justify-center` would strand the top of overflowing content
            off-screen. `data-stack-scrollable` tells CardStack this region
            owns its own wheel gestures. On desktop the section itself is the
            flex parent and this collapses to a plain full-width block. */}
        <div
          data-stack-scrollable
          className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-2 py-14 sm:py-16 lg:block lg:flex-none lg:overflow-visible lg:py-6"
        >
          <Container className="relative my-auto lg:my-0">{children}</Container>
        </div>
      </section>
    </BorderGlow>
  );
}
