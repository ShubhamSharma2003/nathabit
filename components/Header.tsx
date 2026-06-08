import Link from "next/link";

// Top navigation. This is intentionally a Server Component shell — it ships no
// client JS. The interactive, live-updating wishlist count is added separately
// as a tiny client island in a later step, so only that badge hydrates.
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-cream/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-brand-forest"
        >
          Nat&nbsp;Habit
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="transition-colors hover:text-brand-forest">
            Home
          </Link>
          <Link href="/search" className="transition-colors hover:text-brand-forest">
            Search
          </Link>
          <Link href="/wishlist" className="transition-colors hover:text-brand-forest">
            Wishlist
          </Link>
        </nav>
      </div>
    </header>
  );
}
