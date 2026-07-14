import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://magicalstudentsclub.com"),
  title: "Magical Students Club — We teach students how to study",
  description:
    "Memory techniques, speed reading, concentration, and smarter study strategies for Grade 5+ students and competitive exam aspirants. Led by memory coach Pradeep Acharya.",
  openGraph: {
    title: "Magical Students Club — We teach students how to study",
    description:
      "Memory techniques, speed reading, concentration, and smarter study strategies for Grade 5+ students and competitive exam aspirants.",
    url: "https://magicalstudentsclub.com",
    siteName: "Magical Students Club",
    locale: "en_IN",
    type: "website",
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
