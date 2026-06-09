import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import SearchBox from "@/components/SearchBox";
import ProductGrid from "@/components/ProductGrid";
import ProductRail from "@/components/ProductRail";
import Pagination from "@/components/Pagination";
import GridSkeleton from "@/components/skeletons/GridSkeleton";
import { searchProducts, getFeaturedProducts } from "@/lib/dummyjson";

// RENDERING STRATEGY: dynamic SSR.
// Reading searchParams opts this route into dynamic rendering — exactly what
// search needs: the query space is effectively unlimited (nothing to pre-render)
// and results must always be fresh (searchProducts uses no-store). The URL is the
// single source of truth (q + page in the query string), so reload, sharing, and
// browser back/forward all work with zero client state to lose.

const PAGE_SIZE = 12;

// Quick-search shortcuts. Each is a real query that returns results, so a visitor
// who lands on an empty search has something to tap.
const QUICK_TERMS = ["phone", "laptop", "watch", "perfume", "sunglasses", "shoes"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

// "Cherry on top": when there's no query yet, surface popular products so the
// search page is useful immediately instead of showing a blank prompt. Its own
// async component so it can stream inside a Suspense boundary.
async function PopularProducts() {
  const featured = await getFeaturedProducts(8);
  return (
    <ProductRail
      title={
        <>
          Popular <span className="text-pop-pink">right now</span>
        </>
      }
      products={featured}
    />
  );
}

// The results fetch lives in its own async component so it can be wrapped in
// <Suspense>: the page shell (heading + search box + quick terms) streams
// immediately and the results stream in when the request resolves.
async function SearchResults({ q, page }: { q: string; page: number }) {
  const skip = (page - 1) * PAGE_SIZE;
  const data = await searchProducts(q, PAGE_SIZE, skip);

  if (data.products.length === 0) {
    return (
      <div className="rounded-5xl bg-tint-lemon py-20 text-center">
        <p className="font-display text-3xl font-extrabold text-ink">
          No results for “{q}”
        </p>
        <p className="mt-2 text-ink/60">Try a different or more general search term.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE);
  return (
    <>
      <p className="mb-6 text-sm font-bold text-ink/50">
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
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
        Search the <span className="text-pop-tangerine">catalog</span>
      </h1>

      {/* Seeded from the URL so a reloaded/shared link shows its query. */}
      <div className="mt-5 max-w-2xl">
        <SearchBox initialQuery={query} />
      </div>

      {/* Quick-search chips — handy on first visit. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-ink/50">Try:</span>
        {QUICK_TERMS.map((term) => (
          <Link
            key={term}
            href={`/search?q=${term}`}
            className="rounded-full bg-white px-4 py-1.5 text-sm font-bold capitalize text-ink shadow-sm transition-transform duration-150 hover:-translate-y-0.5"
          >
            {term}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        {query === "" ? (
          // No query yet → stream popular products as a starting point.
          <Suspense fallback={<GridSkeleton count={8} />}>
            <PopularProducts />
          </Suspense>
        ) : (
          // The key re-suspends the boundary on every new query/page, so the
          // skeleton shows for each fresh search instead of stale results.
          <Suspense key={`${query}-${currentPage}`} fallback={<GridSkeleton count={8} />}>
            <SearchResults q={query} page={currentPage} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
