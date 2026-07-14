import { stats } from "@/content/site";
import { Card, IconChip } from "./ui/Card";
import type { IconName } from "./ui/Icon";

/**
 * Sits inside the hero, directly beneath the hero content. Not a section of its
 * own — it is part of the approved hero composition.
 */
export function StatsBar() {
  return (
    // No `overflow-hidden` here: it would clip the pointer-tracked bloom that
    // spills outside the card. Card clips its own content to the rounded
    // corners internally, which is all this needed it for.
    <Card contentClassName="p-0">
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={[
              "flex items-center gap-3.5 p-5 sm:p-6",
              // Hairline separators: right edge except last in row, bottom on
              // the first mobile row only.
              "border-line",
              i % 2 === 0 ? "border-r" : "",
              i < 2 ? "border-b lg:border-b-0" : "",
              "lg:border-b-0",
              i !== stats.length - 1 ? "lg:border-r" : "lg:border-r-0",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <IconChip name={stat.icon as IconName} size="sm" />
            <div className="min-w-0">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="font-display text-ink tabular block text-xl leading-none font-bold sm:text-2xl">
                  {stat.value}
                </span>
                <span className="text-muted mt-1.5 block text-xs leading-tight sm:text-[13px]">
                  {stat.label}
                </span>
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
}
