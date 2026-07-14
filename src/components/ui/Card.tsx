import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Card({
  children,
  className,
  hover = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={[
        "bg-card border-line rounded-[16px] border",
        hover
          ? "hover:border-primary/30 transition-[transform,border-color] duration-200 hover:-translate-y-1"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
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
}: {
  icon: IconName;
  title: string;
  body: string;
}) {
  return (
    <Card hover as="article" className="p-6">
      <IconChip name={icon} />
      <h3 className="text-ink mt-5 text-lg font-semibold">{title}</h3>
      <p className="text-muted mt-2 text-[15px] leading-relaxed">{body}</p>
    </Card>
  );
}
