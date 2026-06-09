import { create } from "zustand";

export type ToastTone = "default" | "pink";

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, tone?: ToastTone) => void;
  dismiss: (id: number) => void;
}

// Tiny self-contained toast store. We build our own instead of pulling in a
// toast library — it's a handful of lines, keeps the bundle small, and the
// <Toaster> in the root layout renders whatever lands here. Any component can
// fire a toast with useToast.getState().show(...) or the hook.
let counter = 0;

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  show: (message, tone = "default") => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
    // Auto-dismiss after a short window. Clicking a toast removes it sooner.
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2600);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
