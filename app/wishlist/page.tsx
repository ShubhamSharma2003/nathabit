"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/store/wishlist";
import ProductGrid from "@/components/ProductGrid";
import GridSkeleton from "@/components/skeletons/GridSkeleton";

// The wishlist is per-user, persisted in localStorage, and not SEO-relevant, so
// it's a Client Component rendered entirely on the client. It reads the saved ids
// from the Zustand store and fetches those products on demand. Removing happens
// via the same heart button used everywhere; the header count updates
// automatically because it reads the same store.

function EmptyWishlist() {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-brand-border py-16 text-center">
      <p className="font-serif text-xl text-brand-ink">Your wishlist is empty</p>
      <p className="mt-2 text-sm text-brand-muted">
        Tap the heart on any product to save it here.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-brand-forest px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-forest-dark"
      >
        Browse products
      </Link>
    </div>
  );
}

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);

  // Hydration guard: localStorage isn't available during SSR, so we render a
  // neutral skeleton until mounted to avoid a mismatch with the server HTML.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Cache product details by id. Caching means removing one item is instant and
  // doesn't trigger a refetch of the others — we only ever fetch ids we haven't
  // seen yet. The wishlist is small (user-curated), so this stays cheap.
  const [cache, setCache] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const missing = ids.filter((id) => !(id in cache));
    if (missing.length === 0) return;

    let active = true;
    setLoading(true);
    Promise.all(
      missing.map((id) =>
        fetch(`https://dummyjson.com/products/${id}`).then((r) => r.json()),
      ),
    )
      .then((items: Product[]) => {
        if (!active) return;
        setCache((prev) => {
          const next = { ...prev };
          items.forEach((p) => {
            if (p && typeof p.id === "number") next[p.id] = p;
          });
          return next;
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ids, mounted, cache]);

  // Display in saved order; filtering by cache makes removals reflect instantly.
  const products = ids.map((id) => cache[id]).filter(Boolean) as Product[];
  const stillLoading = loading && ids.some((id) => !(id in cache));

  if (!mounted) {
    return (
      <div className="wrap py-10">
        <h1 className="font-serif text-3xl text-brand-ink">Your wishlist</h1>
        <div className="mt-6">
          <GridSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-10">
      <h1 className="font-serif text-3xl text-brand-ink">Your wishlist</h1>

      {ids.length === 0 ? (
        <EmptyWishlist />
      ) : stillLoading && products.length === 0 ? (
        <div className="mt-6">
          <GridSkeleton count={Math.min(ids.length, 8)} />
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-brand-muted">{ids.length} saved</p>
          <div className="mt-6">
            <ProductGrid products={products} />
          </div>
        </>
      )}
    </div>
  );
}
