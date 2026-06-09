import Link from "next/link";

// Global 404. Rendered for unmatched routes and whenever a page calls
// notFound() (e.g. an unknown product id or category slug).
export default function NotFound() {
  return (
    <div className="wrap grid min-h-[50vh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-pop-tangerine">404</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Page not found</h1>
        <p className="mt-3 text-ink/60">
          The page you’re looking for doesn’t exist or may have moved.
        </p>
        <Link href="/" className="pill mt-6 bg-ink text-paper">
          Back home
        </Link>
      </div>
    </div>
  );
}
