import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, discountedPrice } from "@/lib/utils";
import Rating from "./Rating";
import WishlistButton from "./WishlistButton";

// Soft pastel backdrops rotated across the grid so each product sits on its own
// candy-colored panel (the signature look from the reference). The product image
// pops against the tint without competing with the bold section colors.
const TINTS = [
  "bg-tint-pink",
  "bg-tint-mint",
  "bg-tint-lemon",
  "bg-tint-lilac",
  "bg-tint-peach",
  "bg-tint-sky",
];

// Product tile. Server Component — the only interactive part is the WishlistButton
// island. `priority` eager-loads above-the-fold images (LCP); `tone` picks which
// pastel backdrop this card uses.
export default function ProductCard({
  product,
  priority = false,
  tone = 0,
}: {
  product: Product;
  priority?: boolean;
  tone?: number;
}) {
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;
  const tint = TINTS[tone % TINTS.length];

  return (
    <div className="group flex flex-col">
      {/* Tinted image panel. Fixed aspect ratio reserves space before the image
          loads → no layout shift (CLS). The heart floats over it, outside the
          <Link>, so tapping it toggles the wishlist instead of navigating. */}
      <div className={`relative aspect-square overflow-hidden rounded-4xl ${tint}`}>
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton productId={product.id} />
        </div>
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-110"
            priority={priority}
          />
        </Link>
      </div>

      {/* Meta sits on the section background, below the panel. */}
      <Link href={`/products/${product.id}`} className="mt-3 flex flex-col gap-0.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink/45">
          {product.category}
        </span>
        <h3 className="line-clamp-1 font-display text-lg font-extrabold leading-tight text-ink">
          {product.title}
        </h3>
        <div className="mt-0.5">
          <Rating value={product.rating} />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-ink">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm font-medium text-ink/40 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
