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
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Saturated orchid palette, keyed to the hue of the logo mark.
        ink: "#110a16",
        surface: "#1f1528",
        cream: "#f3eaf3",
        // Primary accent: the logo hue pushed to full saturation.
        orchid: "#d45ec4",
        // Solid button fills. Deep enough that it carries light text.
        violet: {
          DEFAULT: "#66249c",
          dark: "#4c1875",
        },
        plum: "#a83fa0",
        wine: "#5c1f52",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Didot", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
