import CardSkeleton from "./CardSkeleton";

// A full grid of card skeletons using the SAME column setup as ProductGrid, so
// the loading state is a pixel-accurate stand-in for the final layout.
export default function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
