import Image from "next/image";
import Link from "next/link";
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
// at most hourly — fast for the search-engine traffic these pages receive, while
// staying fresh on price. (Live stock is handled by the client component below.)
export const revalidate = 3600;

// Pre-render a small set of products at build so the most-visited pages are
// instant and crawlable. DummyJSON exposes no popularity signal, so we
// approximate "popular" with the first 30 products. Every other id is generated
// on first request, then cached (ISR's on-demand fallback via dynamicParams).
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
  } catch (err) {
    // Trigger notFound() here, in the metadata phase — it runs BEFORE the body
    // streams, so Next can set a real 404 status (not 200) for crawlers. The
    // page body's notFound() below is the safety net.
    if (err instanceof NotFoundError) notFound();
    return { title: "Product" };
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
    // Translate our typed 404 into Next's notFound(); re-throw anything else so
    // the error boundary handles it.
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <div className="wrap py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Main image on a tinted panel. It's the LCP element, so it loads with
            priority; the fixed aspect ratio reserves its space (no CLS). */}
        <div className="relative aspect-square overflow-hidden rounded-5xl bg-tint-mint">
          <Image
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-10"
            priority
          />
          <div className="absolute right-5 top-5">
            <WishlistButton productId={product.id} />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <Link
            href={`/categories/${product.category}`}
            className="w-fit rounded-full bg-pop-leaf/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pop-leaf transition-colors hover:bg-pop-leaf hover:text-white"
          >
            {product.category}
          </Link>

          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[0.95] sm:text-5xl">
              {product.title}
            </h1>
            {product.brand && (
              <p className="mt-2 text-ink/50">by {product.brand}</p>
            )}
          </div>

          <Rating value={product.rating} />

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-ink">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-ink/40 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-pop-berry px-2.5 py-1 text-sm font-bold text-white">
                  -{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          {/* Volatile inventory, fetched fresh on the client. */}
          <LiveStock id={product.id} />

          <p className="mt-1 max-w-prose text-lg leading-relaxed text-ink/70">
            {product.description}
          </p>

          <p className="text-sm text-ink/45">Tap the ♥ on the image to save this to your wishlist.</p>
        </div>
      </div>
    </div>
  );
}
