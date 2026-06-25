import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:       "#E8521A",
          "orange-light": "#F47A4A",
          "orange-dark":  "#C43E0F",
          cream:        "#FDF6EC",
          "cream-dark": "#F0E0C8",
          brown:        "#3D2314",
          "brown-light":"#6B3A2A",
          "brown-muted":"#8B5E4A",
        },
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      boxShadow: {
        card:       "0 1px 3px rgba(61,35,20,0.07), 0 6px 20px rgba(61,35,20,0.06)",
        "card-hover":"0 4px 12px rgba(61,35,20,0.10), 0 16px 40px rgba(61,35,20,0.09)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
