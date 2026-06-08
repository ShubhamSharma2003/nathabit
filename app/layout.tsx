import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Body font: Nunito is rounded and friendly, which suits Nat Habit's natural,
// gentle brand feel. We expose it as a CSS variable so Tailwind can reference it.
const sans = Nunito({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

// Heading font: Fraunces is an organic serif that gives an editorial, premium
// tone — good contrast against the rounded body text.
const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  // A title template brands every page automatically; pages set their own
  // `title` (e.g. a product name) and "· Nat Habit" is appended.
  title: {
    default: "Nat Habit — Natural Product Storefront",
    template: "%s · Nat Habit",
  },
  description:
    "Discover natural products at scale — a fast, fresh, SEO-friendly storefront built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables go on <html> so they apply everywhere, including portals.
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col bg-brand-cream text-brand-ink antialiased">
        <Header />
        {/* flex-1 pushes the footer to the bottom on short pages. */}
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
