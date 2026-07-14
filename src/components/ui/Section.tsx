import type { ReactNode } from "react";

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
    // The pink glow cannot live on the <section> itself: that element is
    // overflow-hidden (which would clip the bloom) and opaque (which would hide
    // it). So the glow rides on this wrapper, which is neither, and paints in
    // the margin around the panel.
    //
    // Bare .glow-lg is the top edge only. The sides belong to the hero and the
    // bottom to the footer; a mid-stack card is flanked and covered, so a glow
    // there would read as a seam rather than a halo.
    <div
      className={[
        "glow-lg rounded-[20px]",
        "mx-3 my-3 sm:mx-5 sm:my-4 lg:mx-6 lg:my-5",
        "lg:h-[calc(100vh-2.5rem)]",
      ].join(" ")}
    >
      <section
        id={id}
        aria-labelledby={labelledBy}
        className={[
          "border-line bg-background relative h-full overflow-hidden rounded-[20px] border",
          // Exactly one viewport tall on desktop, with its vertical margin and the
          // sticky top offset accounted for, so a pinned card sits fully on screen.
          "px-2 py-14 sm:py-16 lg:flex lg:items-center lg:py-6",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Safety net: the card is a fixed 100vh, so on an unusually short screen
            content could otherwise be clipped by the card's overflow-hidden and
            become unreachable. Let it scroll within the card instead.

            data-stack-scrollable tells the deck's wheel handler to keep its hands
            off: a wheel here is meant to scroll this overflow, not advance the
            deck, which would otherwise make the clipped content unreachable —
            the very thing this container exists to prevent. */}
        <Container
          data-stack-scrollable
          className="relative max-h-full overflow-y-auto"
        >
          {children}
        </Container>
      </section>
    </div>
  );
}
