import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

// Why Zustand (explained in the README too): the wishlist is the one piece of
// genuinely global, cross-tree state — the header badge, every product card,
// and the wishlist page all read and mutate it. Zustand gives us that shared
// store with almost no boilerplate, and its `persist` middleware writes to
// localStorage automatically, which is exactly the "persist wishlist locally"
// requirement with zero manual wiring.
//
// Note on hydration: on the server `ids` is always empty, but on the client it
// rehydrates from localStorage. Components that render a value derived from the
// store (e.g. the header count) must guard with a "mounted" flag so the first
// client render matches the server HTML and React doesn't warn about a mismatch.
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      // Toggle = add if missing, remove if present. Single action keeps the
      // heart button logic trivial.
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((existing) => existing !== id)
            : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "nathabit-wishlist" }, // localStorage key
  ),
);
