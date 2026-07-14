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
 */
export function Section({
  children,
  id,
  className,
  labelledBy,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
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
