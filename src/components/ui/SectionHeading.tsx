import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-primary mb-4 text-xs font-medium tracking-[0.18em] uppercase">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  as?: "h2" | "h3";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`${alignment} max-w-2xl`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className="text-ink text-3xl leading-[1.15] font-semibold text-balance sm:text-4xl">
        {title}
      </Tag>
      {subtitle ? (
        <p className="text-muted mt-4 text-base leading-relaxed text-pretty">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/** Pink emphasis for the one word that carries the meaning of a heading. */
export function Mark({ children }: { children: ReactNode }) {
  return <span className="text-primary">{children}</span>;
}
