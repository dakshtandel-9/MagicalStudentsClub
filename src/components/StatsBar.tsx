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
    //
    // One column on phone: below `sm` the card's own width is squeezed by the
    // floating button column's reserved clearance (globals.css, "clearance
    // for the floating button column"), and two columns at that width leaves
    // a cell too narrow for its own label — "Years of Experience" wrapped to
    // three lines and clipped against the card edge. One column gives every
    // stat the card's full width, so the longest label still resolves in two
    // clean lines. Two columns returns at `sm`, where that squeeze is milder
    // (the reserved clearance grows, but so does the viewport it's a
    // fraction of), and four across returns at `lg` as before.
    <Card contentClassName="p-0">
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={[
              "flex items-center gap-3.5 p-5 sm:p-6",
              // Below `lg` the deck is a phone card and the fixed
              // WhatsApp/mute/back-to-top column sits in its bottom-right
              // corner (see "Clearance for the floating button column" in
              // globals.css) — reserve that column's width in whichever cell
              // actually borders the card's right edge at each breakpoint, so
              // its stat number/label never scrolls in underneath the
              // buttons. Below `sm` that is every row (one column, grid-cols-1
              // — each stat is its own full-width row); from `sm` to `lg` it
              // narrows to just the right-hand column (`sm:grid-cols-2`, even
              // indices sit left, odd sit right).
              "pr-[var(--fab-clear)] sm:pr-0",
              i % 2 === 1 ? "sm:pr-[var(--fab-clear)]" : "",
              "lg:pr-0",
              // Hairline separators: bottom edge between phone's single-column
              // rows; right edge except last in row once sm's two columns (or
              // lg's four) are in effect, bottom on the first sm row only.
              "border-line",
              i !== stats.length - 1 ? "border-b sm:border-b-0" : "",
              i % 2 === 0 ? "sm:border-r" : "",
              i < 2 ? "sm:border-b lg:border-b-0" : "",
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
