import Link from "next/link";
import type { Category } from "@/lib/types";

// Category shortcuts on the homepage. Each tile links to that category's ISR
// page. Server Component — just links, no interactivity.
export default function CategoryTiles({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="rounded-xl border border-brand-border bg-white px-4 py-3 text-center text-sm font-medium capitalize text-brand-ink transition-colors hover:border-brand-forest hover:text-brand-forest"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
