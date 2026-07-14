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
 * `fullscreen` gives a section a presentation-slide feel on desktop: at least
 * one viewport tall, with its content centred in the leftover space. It is a
 * min-height, never a fixed one — a section whose content runs taller than the
 * viewport grows rather than clipping, which matters on short laptop screens.
 * Below lg the rule is dropped and sections size to their content.
 */
export function Section({
  children,
  id,
  className,
  labelledBy,
  fullscreen = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
  fullscreen?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[
        "py-16 sm:py-20 lg:py-24",
        fullscreen ? "lg:flex lg:min-h-screen lg:items-center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Container className={fullscreen ? "lg:py-8" : undefined}>
        {children}
      </Container>
    </section>
  );
}
