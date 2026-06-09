"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/store/wishlist";

// Live wishlist badge for the header. Same hydration guard as WishlistButton:
// the server can't know the localStorage count, so render nothing until mounted,
// then reveal the real count. Updates instantly as items are added/removed.
export default function WishlistCount() {
  const count = useWishlist((s) => s.ids.length);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || count === 0) return null;

  return (
    <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-white px-1 text-xs font-extrabold text-pop-pink">
      {count}
    </span>
  );
}
