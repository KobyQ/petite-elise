import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007f94",
        secondary: "#eab308",
        tertiary: "#f9f871",
        coding: "#8ac23d"
      },
      fontFamily: {
        "quick-sand": "var(--font-quick-sand)",
      },
      
      
    },
  },
  plugins: [],
} satisfies Config;
