import { cache } from "react";
import type {
  Product,
  ProductsResponse,
  Category,
  ProductStock,
} from "./types";

// Single source of truth for the API base. All fetches go through getJson so
// caching, error handling, and the not-found signal are consistent everywhere.
const BASE = "https://dummyjson.com";

// Revalidate windows are tuned to how often each kind of data actually changes
// (from the assignment's freshness constraints):
//   - prices change every few hours  -> 1 hour
//   - inventory changes every few mins -> 60 seconds (stock only)
//   - categories rarely change        -> 1 day
const HOUR = 3600;
const DAY = 86400;
const STOCK = 60;

// Thrown on a 404 so pages can translate it into Next's notFound() (real 404
// status + not-found.tsx) instead of a generic 500 error boundary.
export class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

// Central fetch wrapper. Next augments RequestInit with `next.revalidate`/`tags`
// and `cache`, which is how each caller declares its own caching policy.
async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(`Request to ${url} failed with ${res.status}`);
  return res.json() as Promise<T>;
}

// Each reader is wrapped in React `cache()`. Within a single server render this
// dedupes identical calls (e.g. generateMetadata + the page both reading the
// same product) so we never fire the same request twice — one of the explicit
// performance requirements. Next's fetch cache then handles cross-request reuse.

// Paginated catalog slice. We page with limit/skip so the browser/server never
// pulls the full 500k-product catalog at once.
export const getProductsPage = cache(
  (limit: number, skip: number): Promise<ProductsResponse> =>
    getJson<ProductsResponse>(`${BASE}/products?limit=${limit}&skip=${skip}`, {
      next: { revalidate: HOUR, tags: ["products"] },
    }),
);

// Homepage "featured" rail — the highest-rated products (sorted server-side so
// we only transfer the N we show). Hourly freshness like the rest of the catalog.
export const getFeaturedProducts = cache(
  async (limit = 8): Promise<Product[]> => {
    const data = await getJson<ProductsResponse>(
      `${BASE}/products?limit=${limit}&skip=0&sortBy=rating&order=desc`,
      { next: { revalidate: HOUR, tags: ["products"] } },
    );
    return data.products;
  },
);

// Category list barely changes, so it is cached for a full day.
export const getCategories = cache(
  (): Promise<Category[]> =>
    getJson<Category[]>(`${BASE}/products/categories`, {
      next: { revalidate: DAY, tags: ["categories"] },
    }),
);

// A single product (SEO body: title/description/image). Hourly revalidate keeps
// the price fresh enough; throws NotFoundError on a bad id.
export const getProduct = cache(
  (id: string | number): Promise<Product> =>
    getJson<Product>(`${BASE}/products/${id}`, {
      next: { revalidate: HOUR, tags: [`product-${id}`] },
    }),
);

// Live stock only. `select` trims the payload to the volatile fields, and the
// short 60s revalidate keeps inventory near-real-time. This is fetched inside a
// Suspense boundary so the (long-cached) product page never blocks on it.
export const getProductStock = cache(
  (id: string | number): Promise<ProductStock> =>
    getJson<ProductStock>(
      `${BASE}/products/${id}?select=stock,availabilityStatus`,
      { next: { revalidate: STOCK, tags: [`stock-${id}`] } },
    ),
);

// Search must always be fresh and the query space is effectively unlimited, so
// we opt out of caching entirely (no-store). Still paginated via limit/skip.
export const searchProducts = cache(
  (q: string, limit: number, skip: number): Promise<ProductsResponse> =>
    getJson<ProductsResponse>(
      `${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`,
      { cache: "no-store" },
    ),
);

// Products within one category — a rarely-changing set, so hourly revalidate.
export const getCategoryProducts = cache(
  (slug: string, limit: number, skip: number): Promise<ProductsResponse> =>
    getJson<ProductsResponse>(
      `${BASE}/products/category/${encodeURIComponent(slug)}?limit=${limit}&skip=${skip}`,
      { next: { revalidate: HOUR, tags: [`category-${slug}`] } },
    ),
);
