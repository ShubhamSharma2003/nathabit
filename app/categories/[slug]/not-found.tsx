import Link from "next/link";

// Shown when an unknown category slug triggers notFound() on the category page.
export default function NotFound() {
  return (
    <div className="wrap grid min-h-[50vh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-pop-grape">404</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Category not found</h1>
        <p className="mt-3 text-ink/60">We don’t have a category by that name.</p>
        <Link href="/" className="pill mt-6 bg-ink text-paper">
          Back home
        </Link>
      </div>
    </div>
  );
}
