import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { SpecularRim } from "./SpecularRim";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
  // The pink border is also the fallback: the rim's WebGL base stroke paints
  // over it, so if the context fails — or reduced-motion declines it — the
  // button is still correctly outlined rather than borderless.
  secondary:
    "bg-card text-ink border border-primary/40 hover:border-primary hover:bg-[#161a24]",
  ghost: "text-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2.5",
};

/**
 * Only the dark secondary button takes the specular rim. The primary button is
 * a filled pink slab whose own hover carries it, and a ghost button has no edge
 * to trace at all — it is a bare text link.
 */
const hasRim = (variant: Variant) => variant === "secondary";

function classes(variant: Variant, size: Size, className?: string) {
  return [
    "inline-flex items-center justify-center rounded-full font-medium",
    "transition-colors duration-200 whitespace-nowrap",
    // The rim canvas is absolutely positioned against the button, and bleeds
    // outside it — hence `relative` here, and `isolate` so its stacking context
    // is the button's own rather than the section's.
    "relative isolate",
    variants[variant],
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * The label has to sit above the rim canvas, which is painted over the button's
 * whole face. It inherits the button's own flex layout so gaps and icon
 * alignment are unchanged by the extra element.
 */
function Content({ children }: { children: ReactNode }) {
  return (
    <span className="relative z-10 inline-flex items-center justify-center gap-[inherit]">
      {children}
    </span>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("tel:");

  const inner = (
    <>
      {hasRim(variant) && <SpecularRim />}
      <Content>{children}</Content>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {inner}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"button">, "className" | "children">;

/** The same button, for the cases that genuinely act rather than navigate. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, className)} {...rest}>
      {hasRim(variant) && <SpecularRim />}
      <Content>{children}</Content>
    </button>
  );
}
