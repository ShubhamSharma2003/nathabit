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
        // Warm paper base + near-black ink. Everything sits on `paper`.
        paper: "#FBF3E7",
        cream: "#FFFCF5",
        ink: "#1A1207",

        // The "popping" palette — saturated, candy-bright section/accent colors.
        // Namespaced under `pop` so they never collide with Tailwind defaults.
        pop: {
          tangerine: "#FF5A1F",
          sun: "#FFC42E",
          leaf: "#1FA055",
          forest: "#0E4D2E",
          grape: "#7C3AED",
          plum: "#3A1772",
          pink: "#FF4F92",
          berry: "#D62E6F",
        },

        // Soft pastel tints used as product-image backdrops so the products pop
        // without fighting the bold section colors. Rotated across the grid.
        tint: {
          pink: "#FFD9E6",
          mint: "#CDEFD7",
          lemon: "#FFEFB0",
          lilac: "#E7DAFB",
          peach: "#FFDBC4",
          sky: "#D2E8F6",
        },
      },
      fontFamily: {
        // Display = Bricolage Grotesque (characterful, slightly quirky grotesque).
        // Body = Hanken Grotesk (clean, friendly). Wired to next/font CSS vars.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      keyframes: {
        // Infinite horizontal marquee for the scrolling wellness ticker.
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // Gentle bob for decorative product images.
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        // Toast slide + fade in.
        "toast-in": {
          from: { opacity: "0", transform: "translateY(10px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        float: "float 6s ease-in-out infinite",
        "toast-in": "toast-in 0.22s cubic-bezier(0.22,1,0.36,1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
