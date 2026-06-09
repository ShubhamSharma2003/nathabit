import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// Responsive product grid: 1 column on phones up to 4 on desktop.
// `priorityCount` marks the first N images high-priority for LCP. The card index
// also drives the rotating pastel backdrops so colors are evenly distributed.
export default function ProductGrid({
  products,
  priorityCount = 0,
  toneOffset = 0,
}: {
  products: Product[];
  priorityCount?: number;
  toneOffset?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
          tone={i + toneOffset}
        />
      ))}
    </div>
  );
}
