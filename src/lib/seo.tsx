import type { Metadata } from "next";
import { contact, programs, faqPage } from "@/content/site";

export const siteUrl = "https://magicalstudentsclub.com";
export const siteName = "Magical Students Club";

/**
 * The search phrases the site targets. The full list rides on the root
 * layout; each inner page passes the subset it actually answers for, so a
 * page's keywords always describe that page rather than the whole site.
 */
export const seoKeywords = [
  "Memory Training for Students",
  "Memory Improvement Course",
  "Memory Techniques for Students",
  "Study Skills for Students",
  "Learning Skills for Students",
  "Study Smart Not Hard",
  "Memory Workshop",
  "Memory Training Institute",
  "Speed Reading Course",
  "Brain Training for Students",
  "Student Success Program",
  "Exam Preparation Skills",
  "Academic Excellence Program",
  "Magical Students Club",
] as const;

const ogImage = {
  url: "/images/logoMSC.png",
  width: 1061,
  height: 1046,
  alt: `${siteName} logo`,
};

type PageSeo = {
  /** Page title without the site suffix — the layout template appends it. */
  title: string;
  description: string;
  /** Route path starting with "/" — becomes the canonical URL. */
  path: string;
  keywords?: readonly string[];
};

/**
 * Metadata for an inner page: canonical URL plus a complete Open Graph
 * block. Next.js merges metadata shallowly, so a page that sets any
 * `openGraph` field replaces the layout's entire object — every field the
 * layout provides has to be restated here.
 */
export function pageMetadata({ title, description, path, keywords }: PageSeo): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords: [...keywords] } : {}),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_IN",
      url: path,
      title: `${title} | ${siteName}`,
      description,
      images: [ogImage],
    },
  };
}

/** Renders a JSON-LD script tag. `<` is escaped per the Next.js docs. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/images/logoMSC.png`,
  description:
    "Memory training institute teaching students how to study — memory techniques, speed reading, concentration and study skills for Grade 5+ students and competitive exam aspirants.",
  founder: {
    "@type": "Person",
    name: "Pradeep Acharya",
    jobTitle: "Memory & Learning Coach",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 57, 6th Main, Nagendra Block, BSK II Stage",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+91${contact.whatsapp}`,
      email: contact.email,
      availableLanguage: "English",
    },
  ],
};

export const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: siteName,
  publisher: { "@id": `${siteUrl}/#organization` },
};

/** The three programs as Course entries for the services page. */
export const coursesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: programs.map((program, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: program.title,
      description: `${program.body} ${program.detail}`,
      audience: { "@type": "EducationalAudience", audienceType: program.audience },
      provider: { "@id": `${siteUrl}/#organization` },
      url: `${siteUrl}/services`,
    },
  })),
};

/** Every question on the FAQ page, flattened across its groups. */
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqPage.groups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  ),
};
