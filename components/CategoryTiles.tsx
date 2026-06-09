import Link from "next/link";
import type { Category } from "@/lib/types";

// A small color dot per card adds a touch of the palette without the visual
// noise of 24 fully-saturated pills. Rotated across the grid.
const DOTS = [
  "bg-pop-tangerine",
  "bg-pop-sun",
  "bg-pop-grape",
  "bg-pop-pink",
  "bg-pop-berry",
  "bg-pop-plum",
];

// Clean, scannable category grid: calm white cards (not a rainbow of pills) with
// a color dot, the name, and an arrow that slides on hover so it reads as
// clickable. Server Component — just links.
export default function CategoryTiles({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, i) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="group flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm transition-transform duration-150 hover:-translate-y-1 hover:shadow-md"
        >
          <span className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOTS[i % DOTS.length]}`}
            />
            <span className="font-bold capitalize text-ink">{category.name}</span>
          </span>
          <span
            aria-hidden
            className="text-ink/30 transition-all duration-150 group-hover:translate-x-1 group-hover:text-ink"
          >
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
