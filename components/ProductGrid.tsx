import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// Responsive product grid: 1 column on phones up to 4 on desktop.
// `priorityCount` marks the first N images as high-priority for LCP — the
// homepage passes a value for its first visible row; other grids leave it at 0.
export default function ProductGrid({
  products,
  priorityCount = 0,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
