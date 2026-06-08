import { Suspense } from "react";
import type { Metadata } from "next";
import SearchBox from "@/components/SearchBox";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import { searchProducts } from "@/lib/dummyjson";

// RENDERING STRATEGY: dynamic SSR.
// Reading searchParams opts this route into dynamic rendering — exactly what
// search needs: the query space is effectively unlimited (nothing to pre-render)
// and results must always be fresh (searchProducts uses no-store). The URL is
// the single source of truth (q + page in the query string), so reload, sharing,
// and browser back/forward all work with zero client state to lose.

const PAGE_SIZE = 12;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

// Small shared empty-state card.
function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-border py-16 text-center">
      <p className="font-serif text-xl text-brand-ink">{title}</p>
      {subtitle && <p className="mt-2 text-sm text-brand-muted">{subtitle}</p>}
    </div>
  );
}

// The actual results fetch lives in its own async component so it can be wrapped
// in <Suspense>: the page shell (heading + search box) streams immediately and
// the results stream in when the request resolves.
async function SearchResults({ q, page }: { q: string; page: number }) {
  const skip = (page - 1) * PAGE_SIZE;
  const data = await searchProducts(q, PAGE_SIZE, skip);

  if (data.products.length === 0) {
    return (
      <EmptyState
        title={`No results for “${q}”`}
        subtitle="Try a different or more general search term."
      />
    );
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE);
  return (
    <>
      <p className="mb-5 text-sm text-brand-muted">
        {data.total} result{data.total === 1 ? "" : "s"} for “{q}”
      </p>
      <ProductGrid products={data.products} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        hrefForPage={(p) => `/search?q=${encodeURIComponent(q)}&page=${p}`}
      />
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const query = q.trim();
  const currentPage = Math.max(1, Number(page) || 1);

  return (
    <div className="wrap py-10">
      <h1 className="font-serif text-3xl text-brand-ink">Search</h1>

      {/* Seeded from the URL so a reloaded/shared link shows its query. */}
      <div className="mt-4 max-w-xl">
        <SearchBox initialQuery={query} />
      </div>

      <div className="mt-8">
        {query === "" ? (
          // Distinct "no query yet" state — different from "no results".
          <EmptyState
            title="Start typing to search"
            subtitle="Find products by name across the whole catalog."
          />
        ) : (
          // The key re-suspends the boundary on every new query/page, so the
          // skeleton shows again for each fresh search instead of showing stale
          // results while the next request is in flight.
          <Suspense key={`${query}-${currentPage}`} fallback={<GridSkeleton count={8} />}>
            <SearchResults q={query} page={currentPage} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
