import Link from "next/link";
import HeaderSearch from "./HeaderSearch";
import WishlistCount from "./WishlistCount";

// Top navigation. A Server Component shell — only the two small islands inside
// (search field + live wishlist count) hydrate, so the chrome on every page ships
// the minimum possible client JS.
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-3 sm:h-20 sm:gap-5">
        <Link
          href="/"
          className="shrink-0 font-display text-2xl font-extrabold tracking-tight text-ink"
        >
          Nat<span className="text-pop-tangerine"> Habit</span>
        </Link>

        <div className="flex-1">
          <HeaderSearch />
        </div>

        <nav className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink/5 sm:inline-flex"
          >
            Home
          </Link>
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-paper transition-transform duration-150 hover:-translate-y-0.5"
          >
            <span aria-hidden>♥</span>
            <span className="hidden sm:inline">Wishlist</span>
            <WishlistCount />
          </Link>
        </nav>
      </div>
    </header>
  );
}
