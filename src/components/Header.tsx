"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Menu, X } from "lucide-react";
import { contact, navLinks, whatsappHref } from "@/content/site";
import { ButtonLink } from "./ui/Button";
import { Container } from "./ui/Section";
import { WhatsAppGlyph } from "./ui/WhatsAppGlyph";

/**
 * The navigation bar at the top of the hero card. It is a fixed part of that
 * card — ordinary content in the flow, not a floating bar — so it scrolls away
 * with the hero and does not follow the page or reappear.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  // Escape closes the menu, and the page behind it must not scroll while open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-20">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2.5"
            aria-label="Magical Students Club — home"
          >
            <span className="bg-primary/10 ring-primary/20 text-primary font-display inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ring-1">
              M
            </span>
            <span className="font-display text-ink text-[15px] leading-tight font-semibold whitespace-nowrap">
              Magical Students Club
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active = link.href === "/";
                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full px-3 py-2 text-sm transition-colors ${
                        active
                          ? "text-primary font-medium"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <span className="text-muted hidden items-center gap-1.5 text-xs 2xl:flex">
              <Clock className="size-3.5" aria-hidden />
              {contact.hours}
            </span>

            {/* On phones the menu carries the WhatsApp CTA, so the bar keeps
                just the brand and the menu toggle. Wrapped rather than given a
                `hidden` class: ButtonLink's own `inline-flex` would out-rank it. */}
            <div className="hidden md:block">
              <ButtonLink href={whatsappHref} size="md">
                <WhatsAppGlyph className="size-4" />
                Talk to Us on WhatsApp
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="border-line text-ink hover:border-muted/40 inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors xl:hidden"
            >
              {open ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          // Absolute so opening the menu does not push the hero content down and
          // break the card's fixed height. Capped and scrollable so a long menu
          // stays reachable on a short screen.
          className="border-line bg-background/95 absolute inset-x-0 top-full z-30 max-h-[70dvh] overflow-y-auto border-b backdrop-blur-md xl:hidden"
        >
          <Container>
            <nav aria-label="Mobile" className="py-4">
              <ul className="flex flex-col">
                {navLinks.map((link) => {
                  const active = link.href === "/";
                  return (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-3 py-3 text-[15px] transition-colors ${
                          active
                            ? "text-primary font-medium"
                            : "text-muted hover:text-ink"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-line mt-4 border-t pt-4">
                <ButtonLink href={whatsappHref} size="lg" className="w-full">
                  <WhatsAppGlyph className="size-4" />
                  Talk to Us on WhatsApp
                </ButtonLink>
                <p className="text-muted mt-4 flex items-center gap-1.5 px-1 text-xs">
                  <Clock className="size-3.5" aria-hidden />
                  Open {contact.hours}
                </p>
              </div>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
