"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

// Progressive "Load more" for category pages.
//
// The page server-renders the FIRST page of products (great for ISR caching and
// SEO). Deeper pages aren't SEO-critical, so we fetch them on the client on
// demand here. This keeps the category page itself a cheap, statically-cached
// document while still letting users browse the entire category — without ever
// loading all of it up front.
export default function LoadMoreProducts({
  slug,
  initialLoaded,
  total,
}: {
  slug: string;
  initialLoaded: number; // how many products the server already rendered
  total: number;
}) {
  const [extra, setExtra] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const loaded = initialLoaded + extra.length;
  const hasMore = loaded < total;

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://dummyjson.com/products/category/${encodeURIComponent(slug)}?limit=24&skip=${loaded}`,
      );
      const data = (await res.json()) as { products: Product[] };
      setExtra((prev) => [...prev, ...data.products]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Extra products render in a grid with the SAME columns as the server
          grid above. The first page size (24) is divisible by every column
          count (2/3/4), so each grid starts on a fresh full row and the two
          grids read as one continuous list. */}
      {extra.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {extra.map((p, i) => (
            <ProductCard key={p.id} product={p} tone={i} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="pill bg-ink text-paper disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
