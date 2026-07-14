"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { contactPage, whatsappHref } from "@/content/site";
import { Button } from "./ui/Button";

const fieldClass =
  "bg-background border-line text-ink placeholder:text-muted/60 w-full rounded-xl border px-4 py-3 text-[15px] transition-colors focus:border-primary focus:outline-none";

/**
 * No backend exists yet to receive submissions, so this composes the same
 * message as a WhatsApp deep link instead of posting anywhere — the visitor
 * still reaches the team, and nothing here silently drops on the floor.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [target, setTarget] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = [
      `Hi, I'm ${name || "a parent"}.`,
      target ? `Child's grade / exam target: ${target}.` : null,
      message ? message : null,
      phone ? `You can reach me on ${phone}.` : null,
    ].filter(Boolean);

    const href = `https://wa.me/918050085005?text=${encodeURIComponent(lines.join(" "))}`;
    setSent(true);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div>
        <label htmlFor="name" className="text-ink mb-1.5 block text-sm font-medium">
          {contactPage.formFields.name}
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="phone" className="text-ink mb-1.5 block text-sm font-medium">
          {contactPage.formFields.phone}
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="target" className="text-ink mb-1.5 block text-sm font-medium">
          {contactPage.formFields.target}
        </label>
        <input
          id="target"
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="e.g. Grade 8, or UPSC"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="text-ink mb-1.5 block text-sm font-medium">
          {contactPage.formFields.message}
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you're looking for"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <Button type="submit" size="lg" className="mt-2 justify-self-start">
        {sent ? (
          <>
            <Check className="size-4" aria-hidden />
            Opened WhatsApp
          </>
        ) : (
          <>
            Send on WhatsApp
            <ArrowRight className="size-4" aria-hidden />
          </>
        )}
      </Button>

      <p className="text-muted text-xs">
        This opens WhatsApp with your details filled in — nothing is sent
        until you tap send there. You can also{" "}
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
          message us directly
        </a>
        .
      </p>
    </form>
  );
}
