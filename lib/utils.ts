// Small shared helpers. Kept dependency-free on purpose.

// DummyJSON prices are plain USD numbers; render them with a symbol + 2 dp.
export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

// Given a list price and a discount %, return the effective price. Used to show
// the discounted figure on cards and the detail page.
export function discountedPrice(price: number, discountPercentage: number): number {
  return price - (price * discountPercentage) / 100;
}

// Tiny classNames joiner so we can write conditional Tailwind classes inline
// without pulling in clsx for such a small need.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
