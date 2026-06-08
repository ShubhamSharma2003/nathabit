import Link from "next/link";

// Global 404. Rendered for unmatched routes and whenever a page calls
// notFound() (e.g. an unknown product id or category slug).
export default function NotFound() {
  return (
    <div className="wrap flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="font-serif text-6xl text-brand-forest">404</p>
      <h1 className="font-serif text-2xl text-brand-ink">Page not found</h1>
      <p className="text-brand-muted">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-forest-dark"
      >
        Back home
      </Link>
    </div>
  );
}
