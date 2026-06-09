"use client";

import { useEffect, useState } from "react";
import type { ProductStock } from "@/lib/types";

// Live stock indicator — fetched on the CLIENT on purpose.
//
// Inventory changes every few minutes. If we fetched it on the server, that
// fetch's short revalidate would drag the WHOLE product page's cache down with
// it (Next uses the lowest revalidate across a route), forcing constant
// regeneration of 500k pages. Instead we keep the product page itself long-cached
// (ISR, 1h) for its SEO content, and read just the volatile stock here on the
// client with `no-store`. Result: the heavy page is cheap and crawlable, while
// every visitor still sees genuinely fresh inventory.
export default function LiveStock({ id }: { id: number }) {
  const [data, setData] = useState<ProductStock | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // `active` guards against setting state after unmount (e.g. fast navigation).
    let active = true;
    fetch(
      `https://dummyjson.com/products/${id}?select=stock,availabilityStatus`,
      { cache: "no-store" },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("stock fetch failed"))))
      .then((d: ProductStock) => active && setData(d))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, [id]);

  // Stock is non-critical chrome; if it fails to load we simply hide it rather
  // than break the page.
  if (failed) return null;

  // Skeleton keeps the same height as the real badge, so revealing it doesn't
  // shift the layout.
  if (!data) {
    return (
      <span className="inline-block h-8 w-44 animate-pulse rounded-full bg-ink/10" />
    );
  }

  const out = data.stock <= 0;
  const low = !out && data.stock <= 10;
  const tone = out
    ? "bg-pop-berry/10 text-pop-berry"
    : low
      ? "bg-pop-sun/25 text-ink"
      : "bg-pop-leaf/15 text-pop-leaf";
  const label = out ? "Out of stock" : `${data.availabilityStatus} · ${data.stock} left`;

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${tone}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  );
}
