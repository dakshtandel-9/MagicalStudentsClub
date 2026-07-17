import type { ReactNode } from "react";
import { BorderGlow } from "./BorderGlow";
import { Icon, type IconName } from "./Icon";

/**
 * Every box inside a section panel. Built on BorderGlow, so the border and a
 * soft bloom track the pointer along whichever edge it is nearest.
 *
 * The base border stays: BorderGlow's lit border is a masked cone that only
 * covers the arc facing the pointer, so without a resting border underneath it
 * the rest of the card's outline would simply be missing.
 */
export function Card({
  children,
  className,
  contentClassName = "p-5",
  hover = false,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  /**
   * Applied to an inner div, not to BorderGlow's own `className`. BorderGlow
   * clips content to its rounded corners via `.border-glow-inner`, which has
   * no padding of its own — padding passed to `className` instead lands on
   * the unclipped outer element, so content sits flush against the rounded
   * corners and looks cut off. Pass layout-only classes (h-full, relative,
   * group) via `className`; pass padding/spacing/flex classes for the
   * content here.
   */
  contentClassName?: string;
  hover?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <BorderGlow
      as={as}
      className={[
        "bg-card border-line border",
        // The lift is on the card, not on BorderGlow's inner wrapper, so the
        // bloom travels with it.
        hover ? "transition-transform duration-200 hover:-translate-y-1" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["h-full", contentClassName].filter(Boolean).join(" ")}>
        {children}
      </div>
    </BorderGlow>
  );
}

/** Circular pink-tinted icon chip. The one repeated pink detail across sections. */
export function IconChip({
  name,
  size = "md",
}: {
  name: IconName;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "size-9" : "size-11";
  const glyph = size === "sm" ? "size-4" : "size-5";

  return (
    <span
      className={`bg-primary/10 ring-primary/15 text-primary inline-flex ${box} shrink-0 items-center justify-center rounded-full ring-1`}
    >
      <Icon name={name} className={glyph} />
    </span>
  );
}

export function FeatureCard({
  icon,
  title,
  body,
  contentClassName,
}: {
  icon: IconName;
  title: string;
  body: string;
  /** Appended to the base `p-6`, e.g. so a caller in a grid can add extra
   * right clearance on whichever cards land in the rightmost column. */
  contentClassName?: string;
}) {
  // `h-full`: in a grid the card fills its row rather than shrinking to its own
  // text, so a two-line body and a three-line one leave cards the same height.
  // This only works if every wrapper between the grid and the card is also full
  // height — see the Reveal wrappers at the call sites.
  return (
    <Card
      hover
      as="article"
      className="h-full"
      contentClassName={["p-6", contentClassName].filter(Boolean).join(" ")}
    >
      <IconChip name={icon} />
      <h3 className="text-ink mt-5 text-lg font-semibold">{title}</h3>
      <p className="text-muted mt-2 text-[15px] leading-relaxed">{body}</p>
    </Card>
  );
}
