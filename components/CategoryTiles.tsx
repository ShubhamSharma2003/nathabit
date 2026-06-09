import Link from "next/link";
import type { Category } from "@/lib/types";

// Each category gets its own popping color, rotated through the palette, with a
// text color chosen for contrast. These are the bold candy pills from the
// reference. Server Component — just links, no interactivity.
const CHIPS = [
  "bg-pop-tangerine text-white",
  "bg-pop-sun text-ink",
  "bg-pop-grape text-white",
  "bg-pop-pink text-white",
  "bg-pop-berry text-white",
  "bg-pop-plum text-white",
];

export default function CategoryTiles({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category, i) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold capitalize transition-transform duration-150 hover:-translate-y-1 ${CHIPS[i % CHIPS.length]}`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
