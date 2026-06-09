"use client";

import { useEffect } from "react";

// Root error boundary. Must be a Client Component (Next requirement) so it can
// receive the `reset` callback that re-attempts rendering the segment.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this is where we'd report to monitoring (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="wrap grid min-h-[50vh] place-items-center py-16 text-center">
      <div>
        <p className="font-display text-6xl font-extrabold text-pop-pink">oops</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold">
          Something went wrong
        </h1>
        <p className="mt-3 text-ink/60">
          We couldn’t load this page. Please try again in a moment.
        </p>
        <button type="button" onClick={reset} className="pill mt-6 bg-ink text-paper">
          Try again
        </button>
      </div>
    </div>
  );
}
