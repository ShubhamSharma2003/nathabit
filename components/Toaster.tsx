"use client";

import { useToast } from "@/store/toast";

// Renders the active toasts, fixed to the bottom-center of the viewport. Mounted
// once in the root layout. Each toast animates in and is dismissible on click;
// the store auto-removes them after a couple seconds.
export default function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto flex animate-toast-in items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-xl ${
            t.tone === "pink" ? "bg-pop-pink text-white" : "bg-ink text-paper"
          }`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
