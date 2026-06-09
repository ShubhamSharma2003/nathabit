import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryProducts } from "@/lib/dummyjson";
import ProductGrid from "@/components/ProductGrid";
import LoadMoreProducts from "@/components/LoadMoreProducts";

// RENDERING STRATEGY: ISR.
// The categories and their contents change rarely, and there are only ~24 of
// them, so we pre-render every category page at build and revalidate hourly to
// refresh prices. The first page of products is server-rendered (SEO + fast
// first paint); deeper pages load on demand client-side (see LoadMoreProducts),
// so a whole category is never fetched up front.
export const revalidate = 3600;

const FIRST_PAGE = 24;

// Pre-render all category slugs at build time.
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // getCategories is cached, so this call is deduped with the page's call below.
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  // Validate the slug here, in the metadata phase (before the body streams), so
  // an unknown category returns a real 404 status rather than 200.
  if (!category) notFound();
  return {
    title: `${category.name} products`,
    description: `Browse ${category.name} products at Nat Habit.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // DummyJSON returns an empty list (not a 404) for an unknown category, so we
  // validate the slug against the real category list and 404 if it isn't one.
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const data = await getCategoryProducts(slug, FIRST_PAGE, 0);

  return (
    <div className="wrap py-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-pop-grape">
        Category
      </p>
      <div className="mt-1 flex items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-extrabold capitalize leading-[0.95] sm:text-6xl">
          {category.name}
        </h1>
        <p className="hidden shrink-0 text-sm font-bold text-ink/50 sm:block">
          {data.total} products
        </p>
      </div>

      <div className="mt-8">
        {/* First row marked priority for LCP, since this is the top of the page. */}
        <ProductGrid products={data.products} priorityCount={4} />
        <LoadMoreProducts
          slug={slug}
          initialLoaded={data.products.length}
          total={data.total}
        />
      </div>
    </div>
  );
}
