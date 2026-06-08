import Link from "next/link";

// Shown when an unknown category slug triggers notFound() on the category page.
export default function NotFound() {
  return (
    <div className="wrap flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="font-serif text-2xl text-brand-ink">Category not found</h1>
      <p className="text-brand-muted">We don’t have a category by that name.</p>
      <Link
        href="/"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-forest-dark"
      >
        Back home
      </Link>
    </div>
  );
}
