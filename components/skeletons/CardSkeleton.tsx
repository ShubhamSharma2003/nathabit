// Loading placeholder that mirrors ProductCard's footprint (tinted square panel
// + meta rows), so swapping skeleton → real card causes no layout shift.
export default function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-square animate-pulse rounded-4xl bg-ink/10" />
      <div className="mt-3 flex flex-col gap-2">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-ink/10" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-ink/10" />
        <div className="h-4 w-1/4 animate-pulse rounded-full bg-ink/10" />
      </div>
    </div>
  );
}
