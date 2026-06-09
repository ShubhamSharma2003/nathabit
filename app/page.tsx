import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getCategories, getProductsPage } from "@/lib/dummyjson";
import ProductGrid from "@/components/ProductGrid";
import CategoryTiles from "@/components/CategoryTiles";
import { formatPrice } from "@/lib/utils";

// RENDERING STRATEGY: Incremental Static Regeneration.
// The homepage is the heaviest-traffic page and almost entirely static
// (featured + categories + a catalog teaser). We pre-render it and regenerate at
// most hourly, so every visitor gets a cheap, CDN-cacheable page while prices
// still refresh. We deliberately do NOT read searchParams here — that would opt
// the page into dynamic rendering and lose the cache.
export const revalidate = 3600;

// Words that scroll across the marquee band.
const MARQUEE = ["Natural", "Pure", "Clean", "Fresh", "Plant-based", "Tasting wellness"];

export default async function Home() {
  // Fetch the three independent datasets in parallel so render time is bounded by
  // the slowest request, not the sum. cache() + Next dedup prevent dup requests.
  const [featured, categories, listing] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getProductsPage(12, 0),
  ]);

  const hero = featured[0];
  const heroAccent = featured[1];
  const promo = featured[2];

  return (
    <div className="space-y-16 pb-4 pt-6">
      {/* ---------- HERO ---------- */}
      <section className="wrap">
        <div className="relative overflow-hidden rounded-5xl bg-pop-tangerine px-6 py-12 text-white sm:px-12 sm:py-16">
          {/* Decorative blob */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pop-sun/40 blur-2xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Tasting wellness
              </p>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.92] sm:text-7xl">
                Unlock your <span className="text-pop-sun">natural</span> glow
              </h1>
              <p className="mt-5 max-w-md text-lg text-white/90">
                Daily nutrition and clean essentials, made from real ingredients.
                Discover a fresh catalog built around how you live.
              </p>
              <Link href="/search" className="pill mt-8 bg-ink text-paper">
                Shop now <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Featured product, floating on the right */}
            {hero && (
              <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block">
                <div className="absolute inset-0 rounded-[2.75rem] bg-white" />
                <Image
                  src={hero.thumbnail}
                  alt={hero.title}
                  fill
                  sizes="(max-width: 1024px) 0px, 24rem"
                  className="animate-float object-contain p-10"
                  priority
                />
                {/* price chip */}
                <span className="absolute bottom-5 left-5 rounded-full bg-pop-pink px-4 py-2 text-sm font-extrabold text-white">
                  {formatPrice(hero.price)}
                </span>
                {/* small accent product in a circle */}
                {heroAccent && (
                  <div className="absolute -left-8 -top-8 grid h-28 w-28 place-items-center rounded-full bg-tint-lilac shadow-lg">
                    <Image
                      src={heroAccent.thumbnail}
                      alt={heroAccent.title}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- MARQUEE BAND ---------- */}
      <section className="bg-ink py-4 text-paper">
        <div className="marquee-mask overflow-hidden">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {/* Two IDENTICAL halves; the animation translates exactly -50% (one
                half width), so the second half lands precisely where the first
                started — a seamless loop. Each half repeats the word list enough
                times to be wider than any viewport; otherwise the track would run
                out of content and leave a blank gap on the right before resetting. */}
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
                {Array.from({ length: 4 }).flatMap((_, rep) =>
                  MARQUEE.map((word, w) => (
                    <span key={`${rep}-${w}`} className="flex items-center">
                      <span className="px-6 font-display text-2xl font-extrabold uppercase tracking-tight">
                        {word}
                      </span>
                      <span className="text-pop-sun">✦</span>
                    </span>
                  )),
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED ---------- */}
      <section className="wrap">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
            Featured <span className="text-pop-tangerine">picks</span>
          </h2>
          <p className="hidden text-sm font-semibold text-ink/50 sm:block">
            Our highest-rated products
          </p>
        </div>
        <ProductGrid products={featured} priorityCount={4} />
      </section>

      {/* ---------- PROMO BAND ---------- */}
      {promo && (
        <section className="wrap">
          <div className="grid items-center gap-8 overflow-hidden rounded-5xl bg-pop-pink px-6 py-10 text-white sm:px-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                Value for vitality
              </p>
              <h2 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] text-white sm:text-6xl">
                Wellness that fits your lifestyle
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/90">
                High-quality formulas at a fair price — because feeling good should
                be for everyone.
              </p>
              <Link href="/search" className="pill mt-7 bg-white text-ink">
                Explore products <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-xs">
              <div className="absolute inset-0 rounded-4xl bg-white/15" />
              <Image
                src={promo.thumbnail}
                alt={promo.title}
                fill
                sizes="(max-width: 1024px) 18rem, 20rem"
                className="object-contain p-8"
              />
            </div>
          </div>
        </section>
      )}

      {/* ---------- CATEGORIES ---------- */}
      <section className="wrap">
        <h2 className="mb-6 font-display text-4xl font-extrabold sm:text-5xl">
          Shop by <span className="text-pop-grape">category</span>
        </h2>
        <CategoryTiles categories={categories} />
      </section>

      {/* ---------- CATALOG ---------- */}
      <section className="wrap">
        <h2 className="mb-6 font-display text-4xl font-extrabold sm:text-5xl">
          Fresh from the <span className="text-pop-berry">catalog</span>
        </h2>
        {/* toneOffset shifts the pastel rotation so this grid's colors differ
            from the featured grid above. */}
        <ProductGrid products={listing.products} toneOffset={2} />
      </section>
    </div>
  );
}
