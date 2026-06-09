import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import ProductGrid from "./ProductGrid";

// A titled product section, reused for "Popular right now" (search) and
// "You might also like" (product detail). `title` is a ReactNode so callers can
// pass a styled accent word. Renders nothing if there are no products.
export default function ProductRail({
  title,
  products,
  toneOffset = 0,
}: {
  title: ReactNode;
  products: Product[];
  toneOffset?: number;
}) {
  if (products.length === 0) return null;
  return (
    <section>
      <h2 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">
        {title}
      </h2>
      <ProductGrid products={products} toneOffset={toneOffset} />
    </section>
  );
}
