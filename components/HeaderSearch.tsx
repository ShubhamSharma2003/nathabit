"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Header search field. On submit it navigates to /search?q=…, keeping the URL as
// the source of truth (the search page reads `q` from there). We use a plain
// submit here rather than live debouncing — from the header, navigating away on
// every keystroke would be jarring; live syncing belongs on the search page.
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
      className="hidden flex-1 items-center sm:flex"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full max-w-md rounded-full border border-brand-border bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-brand-forest"
      />
    </form>
  );
}
