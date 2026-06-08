import Link from "next/link";
import HeaderSearch from "./HeaderSearch";
import WishlistCount from "./WishlistCount";

// Top navigation. The header itself is a Server Component — only the two small
// islands inside it (search field + live wishlist count) hydrate, so we ship the
// minimum possible client JS for the chrome that's on every page.
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-cream/90 backdrop-blur">
      <div className="wrap flex h-16 items-center gap-4">
        <Link
          href="/"
          className="whitespace-nowrap font-serif text-xl font-semibold text-brand-forest"
        >
          Nat&nbsp;Habit
        </Link>

        <HeaderSearch />

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="transition-colors hover:text-brand-forest">
            Home
          </Link>
          <Link
            href="/wishlist"
            className="inline-flex items-center transition-colors hover:text-brand-forest"
          >
            Wishlist
            <WishlistCount />
          </Link>
        </nav>
      </div>
    </header>
  );
}
