// Loading skeleton for the product page. Mirrors the two-column layout (image +
// details) so the transition to real content doesn't shift anything.
export default function Loading() {
  return (
    <div className="wrap py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-brand-border/40" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-brand-border/40" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-brand-border/40" />
          <div className="h-5 w-32 animate-pulse rounded bg-brand-border/40" />
          <div className="h-9 w-40 animate-pulse rounded bg-brand-border/40" />
          <div className="mt-2 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-brand-border/40" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-brand-border/40" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-border/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
