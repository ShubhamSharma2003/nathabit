import Link from "next/link";

// Pagination control. The current page lives in the URL, so every button is a
// plain <Link> to a computed href — reload, shareable URLs, and browser
// back/forward all work for free. `hrefForPage` is supplied by the parent so each
// page preserves its own query params.
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

  // Compact window of up to 5 page numbers centered on the current one.
  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const base =
    "grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-bold transition-transform duration-150 hover:-translate-y-0.5";
  const idle = "bg-white text-ink";
  const active = "bg-ink text-paper";
  const off = "pointer-events-none opacity-40";

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
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
