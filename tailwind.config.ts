import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nat Habit brand palette — earthy, natural, calm. Defined once here so
        // every component pulls from the same tokens instead of hardcoding hexes.
        brand: {
          cream: "#F7F4EE", // warm page background
          ink: "#2B2A26", // warm near-black for body text
          forest: { DEFAULT: "#3A5A40", dark: "#2C4433", light: "#588157" },
          sage: "#A3B18A", // soft secondary accent
          clay: "#B5654A", // warm accent used for prices
          border: "#E7E1D6", // hairline borders that sit gently on cream
          muted: "#6F7468", // secondary / helper text
        },
      },
      fontFamily: {
        // Wired to the next/font CSS variables set in app/layout.tsx.
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
