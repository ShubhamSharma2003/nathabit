import Link from "next/link";

// Pagination control. The current page lives in the URL, so every button is a
// plain <Link> to a computed href. That means reload, shareable URLs, and
// browser back/forward all work for free — no client state to lose.
//
// `hrefForPage` is supplied by the parent (a Server Component) so each page can
// preserve its own query params (e.g. keep `?q=` on the search page). Passing a
// function between Server Components is fine — nothing is serialized to the client.
export default function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
}: {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  // Render a compact window of up to 5 page numbers centered on the current one.
  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const base =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm transition-colors";
  const idle = "border-brand-border bg-white hover:border-brand-forest";
  const active = "border-brand-forest bg-brand-forest text-white";
  const off = "pointer-events-none opacity-40";

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={hrefForPage(currentPage - 1)}
        aria-label="Previous page"
        className={`${base} ${idle} ${currentPage <= 1 ? off : ""}`}
      >
        ‹
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefForPage(p)}
          aria-current={p === currentPage ? "page" : undefined}
          className={`${base} ${p === currentPage ? active : idle}`}
        >
          {p}
        </Link>
      ))}
      <Link
        href={hrefForPage(currentPage + 1)}
        aria-label="Next page"
        className={`${base} ${idle} ${currentPage >= totalPages ? off : ""}`}
      >
        ›
      </Link>
    </nav>
  );
}
