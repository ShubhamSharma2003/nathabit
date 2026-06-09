import GridSkeleton from "@/components/skeletons/GridSkeleton";

// Route-level loading UI for the homepage. Mirrors the real layout — a big hero
// block + product grid — so there's no jarring shift when content arrives.
export default function Loading() {
  return (
    <div className="space-y-16 pt-6">
      <div className="wrap">
        <div className="h-72 animate-pulse rounded-5xl bg-ink/10 sm:h-96" />
      </div>
      <div className="wrap">
        <GridSkeleton count={8} />
      </div>
    </div>
  );
}
