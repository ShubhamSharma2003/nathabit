"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";

// Live wishlist badge for the header. Same hydration guard as WishlistButton:
// the server can't know the localStorage count, so we render nothing until
// mounted, then reveal the real persisted count. This avoids a mismatch warning
// while still updating instantly as items are added/removed anywhere in the app.
export default function WishlistCount() {
  const count = useWishlist((s) => s.ids.length);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || count === 0) return null;

  return (
    <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-forest px-1 text-xs font-semibold text-white">
      {count}
    </span>
  );
}
