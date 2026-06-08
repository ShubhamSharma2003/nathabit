import Link from "next/link";

// Shown when getProduct() hits a 404 and the page calls notFound(). Scoped to
// the product route so the message is specific ("Product not found").
export default function NotFound() {
  return (
    <div className="wrap flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="font-serif text-2xl text-brand-ink">Product not found</h1>
      <p className="text-brand-muted">
        This product may have sold out or been removed.
      </p>
      <Link
        href="/"
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-forest-dark"
      >
        Browse products
      </Link>
    </div>
  );
}
