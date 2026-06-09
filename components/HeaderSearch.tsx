"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Header search field. On submit it navigates to /search?q=…, keeping the URL as
// the source of truth (the search page reads `q` from there). A plain submit here
// rather than live debouncing — navigating away on every keystroke from the
// header would be jarring; live syncing belongs on the search page itself.
export default function HeaderSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
      }}
      className="relative flex items-center"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 text-ink/40"
      >
        ⌕
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-full border-2 border-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-pop-tangerine"
      />
    </form>
  );
}
