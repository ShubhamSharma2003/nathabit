// Loading placeholder that mirrors ProductCard's exact dimensions (same aspect
// ratio image box + same text rows). Because the footprint matches, swapping a
// skeleton for the real card causes no layout shift (good CLS).
export default function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-white">
      <div className="aspect-square animate-pulse bg-brand-border/40" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-brand-border/40" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-brand-border/40" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-brand-border/40" />
        <div className="mt-2 h-5 w-1/3 animate-pulse rounded bg-brand-border/40" />
      </div>
    </div>
  );
}
