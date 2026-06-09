import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Display font: Bricolage Grotesque — a characterful, slightly quirky grotesque
// that gives the big headlines personality (matching the bold, playful brand).
// Loaded as a variable font so we can push it to heavy weights for display type.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body font: Hanken Grotesk — clean and friendly, readable at small sizes.
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
