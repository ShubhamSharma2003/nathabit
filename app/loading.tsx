import GridSkeleton from "@/components/skeletons/GridSkeleton";

// Route-level loading UI for the homepage. Next shows this instantly while the
// server work runs (and during ISR regeneration navigations). It mirrors the
// real layout — hero block + product grid — so there's no jarring shift.
export default function Loading() {
  return (
    <div className="wrap space-y-14 py-10">
      <div className="h-56 animate-pulse rounded-3xl bg-brand-border/30" />
      <GridSkeleton count={8} />
    </div>
  );
}
