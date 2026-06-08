// Renders a 0–5 star rating as filled/empty stars plus the numeric value.
// It's a Server Component: the output is a pure function of a number with no
// interactivity, so there's no reason to ship JS for it.
export default function Rating({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${value.toFixed(1)} out of 5`}
    >
      <div className="flex text-sm leading-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={i < rounded ? "text-amber-500" : "text-brand-border"}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs text-brand-muted">{value.toFixed(1)}</span>
    </div>
  );
}
