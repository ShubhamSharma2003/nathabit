"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The search input on the /search page. It treats the URL as the source of
// truth: as the user types, it debounces and rewrites ?q= via router.replace.
//
// - replace (not push) so each keystroke doesn't pile up in the back-stack;
//   the user can still press Back to leave the search page cleanly.
// - the page is a Server Component that reads ?q=, so changing the URL re-runs
//   the server-side search — no client-side data fetching here.
// - `initialQuery` comes from the URL, so reloads, shared links, and
//   back/forward all rehydrate the input correctly.
export default function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  // Re-sync the input when the URL changes from outside the box (e.g. the user
  // presses the browser Back button to a previous query).
  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onChange(next: string) {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = next.trim();
      // Omitting `page` resets pagination to page 1 on a new query.
      router.replace(
        trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
      );
    }, 350);
  }

  // Clean up a pending debounce timer on unmount.
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products…"
      aria-label="Search products"
      autoFocus
      className="w-full rounded-full border border-brand-border bg-white px-5 py-3 text-sm outline-none transition-colors focus:border-brand-forest"
    />
  );
}
