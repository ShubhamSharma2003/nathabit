"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";
import { useToast } from "@/store/toast";
import { cn } from "@/lib/utils";

// Heart toggle shown on cards and the product detail page. Client Component
// because it reads/writes the persisted wishlist store and handles clicks. Kept
// tiny so only this button hydrates — the surrounding card stays server-rendered.
export default function WishlistButton({
  productId,
  className,
}: {
  productId: number;
  className?: string;
}) {
  const toggle = useWishlist((s) => s.toggle);
  const showToast = useToast((s) => s.show);
  // Subscribe to only this product's membership so the button re-renders just
  // when its own state flips.
  const active = useWishlist((s) => s.ids.includes(productId));

  // Store rehydrates from localStorage on the client only; render the neutral
  // state until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isActive = mounted && active;

  return (
    <button
      type="button"
      onClick={() => {
        // `active` still reflects the pre-toggle state here, so we can phrase the
        // toast for the action that's about to happen.
        toggle(productId);
        if (active) showToast("Removed from wishlist");
        else showToast("Added to wishlist ♥", "pink");
      }}
      aria-pressed={isActive}
      aria-label={isActive ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-lg shadow-sm transition-transform duration-150 hover:scale-110 active:scale-95",
        isActive ? "bg-pop-pink text-white" : "bg-white text-ink",
        className,
      )}
    >
      {isActive ? "♥" : "♡"}
    </button>
  );
}
