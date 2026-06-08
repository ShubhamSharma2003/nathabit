import Link from "next/link";
import { getFeaturedProducts, getCategories, getProductsPage } from "@/lib/dummyjson";
import ProductGrid from "@/components/ProductGrid";
import CategoryTiles from "@/components/CategoryTiles";

// RENDERING STRATEGY: Incremental Static Regeneration.
// The homepage is the heaviest-traffic page and is almost entirely static
// (featured + categories + a catalog teaser). We pre-render it and regenerate at
// most once an hour, so every visitor is served a cheap, CDN-cacheable page
// while prices still refresh hourly. We intentionally do NOT read searchParams
// here — that would opt the page into dynamic rendering and lose the cache.
// Full paginated browsing lives on the category and search pages instead.
export const revalidate = 3600;

// Small local heading so the sections share consistent styling without an extra
// component file for something used only on this page.
function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-serif text-2xl text-brand-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-brand-muted">{subtitle}</p>}
    </div>
  );
}

export default async function Home() {
  // Fetch the three independent datasets in parallel so render time is bounded
  // by the slowest request, not the sum. React cache() + Next's fetch dedup make
  // sure we never issue a duplicate request for the same data.
  const [featured, categories, listing] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getProductsPage(12, 0),
  ]);

  return (
    <div className="wrap space-y-14 py-10">
      {/* Hero */}
      <section className="rounded-3xl bg-brand-forest/5 px-6 py-14 text-center sm:py-20">
        <p className="text-sm uppercase tracking-widest text-brand-forest">Nat Habit</p>
        <h1 className="mt-3 font-serif text-4xl text-brand-ink sm:text-5xl">
          Natural products, discovered simply
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-muted">
          Browse a huge, always-fresh catalog and save what you love to your wishlist.
        </p>
        <Link
          href="/search"
          className="mt-6 inline-block rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-forest-dark"
        >
          Start exploring
        </Link>
      </section>

      {/* Featured — first row marked priority so its images count toward LCP. */}
      <section>
        <SectionHeading title="Featured" subtitle="Our highest-rated picks" />
        <ProductGrid products={featured} priorityCount={4} />
      </section>

      <section>
        <SectionHeading title="Shop by category" />
        <CategoryTiles categories={categories} />
      </section>

      <section>
        <SectionHeading title="Fresh from the catalog" />
        <ProductGrid products={listing.products} />
      </section>
    </div>
  );
}
