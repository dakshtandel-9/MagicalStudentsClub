import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
  secondary:
    "bg-card text-ink border border-line hover:border-muted/40 hover:bg-[#161a24]",
  ghost: "text-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2.5",
};

function classes(variant: Variant, size: Size, className?: string) {
  return [
    "inline-flex items-center justify-center rounded-full font-medium",
    "transition-colors duration-200 whitespace-nowrap",
    variants[variant],
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
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

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes(variant, size, className)}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
