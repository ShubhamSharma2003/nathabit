import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, discountedPrice } from "@/lib/utils";
import Rating from "./Rating";
import WishlistButton from "./WishlistButton";

// Product tile used in every grid. Server Component — the only interactive bit
// is the WishlistButton island. `priority` is passed for the first few cards
// above the fold so their images load eagerly and improve LCP.
export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white transition-shadow hover:shadow-md">
      {/* The wishlist toggle floats over the image and sits OUTSIDE the <Link>
          so tapping the heart toggles the wishlist instead of navigating. */}
      <div className="absolute right-3 top-3 z-10">
        <WishlistButton productId={product.id} />
      </div>

      <Link href={`/products/${product.id}`} className="flex flex-1 flex-col">
        {/* Fixed aspect-ratio box reserves the image's space before it loads,
            so there's no layout shift when it arrives (good CLS). */}
        <div className="relative aspect-square overflow-hidden bg-brand-cream">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            // `sizes` tells Next which resolution to serve per breakpoint, so we
            // don't ship a huge image to a small grid cell.
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            priority={priority}
          />
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className="text-xs uppercase tracking-wide text-brand-muted">
            {product.category}
          </span>
          <h3 className="line-clamp-2 font-medium text-brand-ink">
            {product.title}
          </h3>
          <Rating value={product.rating} />
          <div className="mt-auto flex items-baseline gap-2 pt-2">
            <span className="text-lg font-semibold text-brand-forest">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-brand-muted line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
