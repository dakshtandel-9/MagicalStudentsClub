"use client";

import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { galleryPage } from "@/content/site";
import { Card } from "./ui/Card";

type Category = (typeof galleryPage.categories)[number];

/**
 * Every item is a placeholder until the client supplies workshop, academy and
 * event photography — see the architecture guide's asset list. The grid itself
 * is real: filtering, lazy loading and the lightbox all work today, so wiring
 * in real photos later is a content change, not a rebuild.
 */
type GalleryItem = {
  id: string;
  category: Category;
  src: string | null;
  alt: string;
};

const items: GalleryItem[] = [];

export function GalleryGrid() {
  const [active, setActive] = useState<Category | "All">("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const visible =
    active === "All" ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {(["All", ...galleryPage.categories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            aria-pressed={active === cat}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              active === cat
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-line text-muted hover:text-ink",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightbox(item)}
              className="block text-left"
            >
              <Card className="group" contentClassName="p-0">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[inherit]">
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                </span>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <Card className="mt-10 border-dashed" contentClassName="p-10 text-center">
          <span className="border-line text-muted mx-auto inline-flex size-12 items-center justify-center rounded-full border">
            <ImageIcon className="size-5" aria-hidden />
          </span>
          <p className="text-muted mt-4 text-[15px]">
            {active === "All"
              ? "Gallery photos are on the way."
              : `No ${active.toLowerCase()} photos yet.`}
          </p>
          <p className="text-muted/60 mt-1 text-sm">
            Workshop, academy and event photography will appear here once
            added.
          </p>
        </Card>
      )}

      {lightbox && lightbox.src ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="border-line text-ink hover:border-primary hover:text-primary absolute top-6 right-6 inline-flex size-11 items-center justify-center rounded-full border bg-black/40"
          >
            <X className="size-5" aria-hidden />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={900}
              className="h-auto w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
