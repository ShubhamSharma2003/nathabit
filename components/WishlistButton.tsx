"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";

// Heart toggle shown on cards and the product detail page. This is a Client
// Component because it reads/writes the persisted wishlist store and handles
// clicks. It's deliberately tiny so only this button hydrates — the card and
// page around it stay server-rendered with no client JS.
export default function WishlistButton({
  productId,
  className,
}: {
  productId: number;
  className?: string;
}) {
  const toggle = useWishlist((s) => s.toggle);
  // Subscribe to only this product's membership, so the button re-renders just
  // when its own state flips — not on every unrelated wishlist change.
  const active = useWishlist((s) => s.ids.includes(productId));

  // The store rehydrates from localStorage on the client only. Until we've
  // mounted, render the neutral (server) state so the first client paint matches
  // the server HTML and React doesn't warn about a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isActive = mounted && active;

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={isActive}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white/90 text-lg shadow-sm backdrop-blur transition-colors hover:bg-white",
        isActive ? "text-brand-clay" : "text-brand-muted",
        className,
      )}
    >
      {isActive ? "♥" : "♡"}
    </button>
  );
}
