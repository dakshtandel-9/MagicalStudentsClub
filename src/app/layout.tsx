import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import {
  JsonLd,
  organizationJsonLd,
  webSiteJsonLd,
  seoKeywords,
  siteName,
  siteUrl,
} from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const defaultTitle = "Memory Training & Study Skills for Students | Magical Students Club";
const defaultDescription =
  "Memory training for students — memory techniques, speed reading, concentration and study skills for Grade 5+ and competitive exam aspirants (UPSC, NEET, JEE, SSC, Banking). Study smart, not hard, with memory coach Pradeep Acharya.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [...seoKeywords],
  applicationName: siteName,
  category: "education",
  authors: [{ name: "Pradeep Acharya" }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "en_IN",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/images/logoMSC.png",
        width: 1061,
        height: 1046,
        alt: `${siteName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/images/logoMSC.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="min-h-full">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={webSiteJsonLd} />
        {children}
      </body>
    </html>
  );
}
