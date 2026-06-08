import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductsPage, NotFoundError } from "@/lib/dummyjson";
import { formatPrice, discountedPrice } from "@/lib/utils";
import Rating from "@/components/Rating";
import WishlistButton from "@/components/WishlistButton";
import LiveStock from "@/components/LiveStock";

// RENDERING STRATEGY: ISR.
// A product's SEO content (title, description, image) rarely changes and prices
// change only every few hours, so we statically generate the page and regenerate
// at most hourly. This keeps it fast for the search-engine traffic these pages
// receive, while staying fresh enough on price. (Live stock is handled by the
// client component above — see LiveStock for why.)
export const revalidate = 3600;

// Pre-render a small set of products at build time so the most-visited pages are
// instant and fully crawlable. DummyJSON exposes no popularity signal, so we
// approximate "popular" with the first 30 products. Every other product id is
// generated on first request and then cached (ISR's on-demand fallback, enabled
// by the default dynamicParams = true).
export async function generateStaticParams() {
  const { products } = await getProductsPage(30, 0);
  return products.map((p) => ({ id: String(p.id) }));
}

// Per-product SEO metadata. Both this and the page call getProduct(id), but
// React cache() collapses that into a single network request.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProduct(id);
    const description = product.description.slice(0, 160);
    return {
      title: product.title,
      description,
      openGraph: {
        title: product.title,
        description,
        images: [{ url: product.thumbnail }],
        type: "website",
      },
    };
  } catch {
    // Missing product: give crawlers a sane title; the page renders the 404.
    return { title: "Product not found" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch (err) {
    // Translate our typed 404 into Next's notFound() → real 404 status +
    // not-found.tsx. Anything else is a genuine error, so re-throw to the
    // error boundary.
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <div className="wrap py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Main image. It's the LCP element here, so it loads with priority. The
            fixed aspect ratio reserves its space to avoid layout shift. */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-brand-border bg-white">
          <Image
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6"
            priority
          />
          <div className="absolute right-4 top-4">
            <WishlistButton productId={product.id} />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs uppercase tracking-wide text-brand-muted">
              {product.category}
            </span>
            <h1 className="mt-1 font-serif text-3xl text-brand-ink">
              {product.title}
            </h1>
            {product.brand && (
              <p className="text-sm text-brand-muted">by {product.brand}</p>
            )}
          </div>

          <Rating value={product.rating} />

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-brand-forest">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-brand-muted line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-brand-clay/10 px-2 py-0.5 text-sm font-medium text-brand-clay">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          {/* Volatile inventory, fetched fresh on the client. */}
          <LiveStock id={product.id} />

          <p className="mt-2 leading-relaxed text-brand-ink/80">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
