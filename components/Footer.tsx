import Link from "next/link";
import { getCategories } from "@/lib/dummyjson";
import NewsletterForm from "./NewsletterForm";

// One column of footer links. Internal routes use real hrefs; pages that don't
// exist in this assignment (About, Careers, etc.) point to "#" purely for the
// look of a complete storefront footer.
function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-extrabold uppercase tracking-wider text-paper">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm capitalize text-paper/70 transition-colors hover:text-paper"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Footer is a Server Component that pulls the real category list (cached, so it's
// effectively free) to populate the "Shop by category" column with working links.
export default async function Footer() {
  const categories = await getCategories();
  const topCategories = categories.slice(0, 5);

  return (
    <footer className="mt-20 bg-pop-plum text-paper">
      <div className="wrap py-16">
        <div className="grid grid-cols-2 gap-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand + newsletter */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <p className="font-display text-3xl font-extrabold">Nat Habit</p>
            <p className="mt-3 max-w-xs text-paper/70">
              Natural products, discovered simply — clean essentials for everyday
              wellbeing.
            </p>
            <p className="mt-6 text-sm font-bold">Stay in the loop</p>
            <p className="mb-3 text-sm text-paper/60">
              Fresh drops and offers, no spam.
            </p>
            <NewsletterForm />
          </div>

          <FooterCol
            title="Shop"
            links={[
              { label: "All products", href: "/search" },
              { label: "Wishlist", href: "/wishlist" },
              { label: "New arrivals", href: "#" },
              { label: "Best sellers", href: "#" },
            ]}
          />

          <FooterCol
            title="Shop by category"
            links={topCategories.map((c) => ({
              label: c.name,
              href: `/categories/${c.slug}`,
            }))}
          />

          <FooterCol
            title="Company"
            links={[
              { label: "About us", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Press", href: "#" },
              { label: "Blog", href: "#" },
            ]}
          />

          <FooterCol
            title="Support"
            links={[
              { label: "Contact", href: "#" },
              { label: "Shipping", href: "#" },
              { label: "Returns", href: "#" },
              { label: "FAQ", href: "#" },
            ]}
          />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-paper/15 pt-6 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nat Habit. Built for the frontend assignment.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="#" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-paper">
              Terms
            </Link>
            <span className="text-paper/40">·</span>
            <span>Data from DummyJSON · Built with Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
