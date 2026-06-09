import Link from "next/link";

// Shown when getProduct() hits a 404 and the page calls notFound().
export default function NotFound() {
  return (
    <div className="wrap grid min-h-[50vh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-pop-pink">404</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">Product not found</h1>
        <p className="mt-3 text-ink/60">
          This product may have sold out or been removed.
        </p>
        <Link href="/" className="pill mt-6 bg-ink text-paper">
          Browse products
        </Link>
      </div>
    </div>
  );
}
