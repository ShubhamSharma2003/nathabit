// Renders a 0–5 star rating as filled/empty stars plus the numeric value.
// Server Component — pure output from a number, no interactivity, no client JS.
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
            className={i < rounded ? "text-pop-tangerine" : "text-ink/20"}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-xs font-semibold text-ink/60">{value.toFixed(1)}</span>
    </div>
  );
}
