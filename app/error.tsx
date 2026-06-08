"use client";

import { useEffect } from "react";

// Root error boundary. Must be a Client Component (Next requirement) so it can
// receive the `reset` callback that re-attempts rendering the segment. Any
// uncaught error in a server component below this point lands here instead of a
// blank screen.
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
    <div className="wrap flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="font-serif text-2xl text-brand-ink">Something went wrong</h1>
      <p className="text-brand-muted">
        We couldn’t load this page. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-full bg-brand-forest px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-forest-dark"
      >
        Try again
      </button>
    </div>
  );
}
