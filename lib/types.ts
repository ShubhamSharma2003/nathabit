// Shared API types. We model only the fields the storefront actually uses,
// not the entire DummyJSON payload — smaller types are easier to reason about
// and document the exact shape each component depends on.

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  tags?: string[];
  thumbnail: string;
  images: string[];
  // "In Stock" | "Low Stock" | "Out of Stock" — provided by DummyJSON.
  availabilityStatus?: string;
}

// Every list endpoint (all products, search, by-category) returns this envelope.
// `total` drives pagination; `skip`/`limit` echo the request window.
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

// Trimmed payload for the live-stock fetch (see getProductStock). Keeping this
// separate makes it obvious that the stock request only pulls volatile fields.
export interface ProductStock {
  id: number;
  stock: number;
  availabilityStatus: string;
}
