# Nat Habit — Scalable Product Discovery Storefront

A production-oriented storefront for a large-scale marketplace (500k products, 50k
daily active users), built with the Next.js App Router. The focus is on choosing the
right **rendering strategy per page** based on how often each page's data changes and
how it's consumed — not just shipping features.

**Live demo:** _add your Vercel/Netlify URL here after deploying_

Data comes from the public [DummyJSON Products API](https://dummyjson.com/docs/products).

---

## Tech stack

| Concern | Choice |
|--------|--------|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (wishlist, persisted to localStorage) |
| Images | `next/image` |
| Fonts | `next/font` (Nunito + Fraunces, self-hosted) |

---

## Getting started

Requirements: Node.js 18.18+ and npm.

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # lint
```

No environment variables are required — the DummyJSON API is public.

---

## Rendering strategy (the core of this assignment)

Each route uses the strategy that matches its data's freshness needs and traffic
profile. There is no single right answer; below is the reasoning behind each choice.

| Route | Strategy | Revalidate | Why |
|-------|----------|-----------|-----|
| `/` Homepage | **ISR** | 1 hour | Heaviest-traffic page and almost entirely static (featured + categories). Pre-rendering makes it cheap and CDN-cacheable; hourly regeneration keeps prices fresh. It deliberately does **not** read `searchParams`, which would force dynamic rendering and lose the cache. |
| `/products/[id]` | **ISR** + client-fetched live stock | 1 hour (shell) | The SEO body (title, description, image) rarely changes and prices change only every few hours, so the page is statically generated and revalidated hourly — fast for the search-engine traffic these pages receive. `generateStaticParams` pre-renders the first 30 products; the rest are generated on first request and then cached. |
| `/search?q=` | **Dynamic SSR** (`no-store`) | — | The query space is effectively unlimited (nothing to pre-render) and results must always be fresh. Reading `searchParams` opts the route into dynamic rendering. The URL is the source of truth, so reload / share / back-forward all work. Results stream in via a Suspense boundary. |
| `/categories/[slug]` | **ISR** | 1 hour | Categories rarely change and there are only ~24 of them, so every category page is pre-rendered. The first page of products is server-rendered for SEO; deeper pages load on demand (client-side "Load more"). |
| `/wishlist` | **Client (CSR)** | — | Per-user, persisted in localStorage, not SEO-relevant — so it's rendered entirely on the client from the Zustand store. |

### Why live stock is fetched on the client

Inventory changes every few minutes. If it were fetched on the server, that fetch's
short revalidate would drag the **whole** product page's cache down with it (Next uses
the lowest revalidate across a route), forcing constant regeneration of 500k pages.
Instead the product page stays long-cached (ISR, 1 hour) for its SEO content, and the
volatile stock is read on the client with `no-store`. The heavy page stays cheap and
crawlable while every visitor still sees fresh inventory. This is "client-side
fetching, used precisely where it adds value."

### Not loading the whole catalog

Every grid is paginated (`limit`/`skip`): the homepage shows a bounded teaser, search
and categories paginate, and category pages use progressive "Load more". The browser
never assumes all 500k products can be loaded at once.

---

## State management — why Zustand

The only genuinely global, cross-tree state is the **wishlist**: the header badge, the
heart button on every product card, and the wishlist page all read and mutate it.

- **Zustand** gives that shared store with almost no boilerplate.
- Its `persist` middleware writes to `localStorage` automatically — exactly the
  "persist wishlist locally" requirement, with zero manual wiring.
- It beats the Context API here because the header count can update without
  re-rendering unrelated subtrees, and it's far lighter than Redux Toolkit for a
  single slice.

**Hydration note:** the server can't know the localStorage value, so components that
render a derived value (the header count, the heart's active state) use a `mounted`
guard — they render the neutral server state first, then reveal the real value after
hydration. This avoids React hydration-mismatch warnings.

---

## Performance / Core Web Vitals

- **LCP:** above-the-fold images use `next/image` with `priority`; fonts are
  self-hosted via `next/font` (no render-blocking, no layout shift).
- **CLS:** every image sits in a fixed-aspect-ratio box, and skeletons match the final
  element dimensions, so loading content never shifts the layout.
- **Less client JS:** Server Components by default; only small islands hydrate
  (search box, wishlist button, header count, "Load more").
- **No duplicate requests:** data readers are wrapped in React `cache()`, and
  per-fetch caching is declared with `next: { revalidate, tags }`, so identical
  requests within a render are deduped.

---

## Loading, error & not-found states

- Route-level `loading.tsx` skeletons and a component-level Suspense fallback on search.
- `error.tsx` boundaries with a retry action.
- `not-found.tsx` at the root and for unknown products / categories (via `notFound()`).
- Search distinguishes "no query yet" from "no results for X".

> Note: `notFound()` returns a proper 404 status on Vercel. Under self-hosted
> `next start`, an ISR-generated not-found page can be cached and served as 200 — a
> known Next.js self-hosting nuance. The not-found UI and `noindex` tag are correct in
> both cases.

---

## Project structure

```
app/
  layout.tsx                Root layout: header (live wishlist count) + footer, fonts
  page.tsx                  Homepage (ISR)
  loading.tsx / error.tsx / not-found.tsx   Global states
  products/[id]/            Product detail (ISR) + loading + not-found
  search/                   Search (dynamic SSR + streaming)
  categories/[slug]/        Category pages (ISR) + not-found
  wishlist/                 Wishlist (client)
components/                 ProductCard, ProductGrid, Header, SearchBox, etc.
lib/
  dummyjson.ts              Typed API client with per-fetch caching + cache() dedup
  types.ts                  Shared API types
  utils.ts                  Small helpers
store/
  wishlist.ts               Zustand store (+ persist middleware)
```

---

## Deployment

Deploy to [Vercel](https://vercel.com/new) (recommended for Next.js):

1. Push this repo to GitHub.
2. Import it in Vercel — no configuration or env vars needed.
3. Vercel runs `next build` and serves it with full ISR/SSR support.

Then add the live URL to the top of this README.
