/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        cream: {
          50: "#FDFCF8",
          100: "#FAF8EE", // wisprtype signature cream bg
          200: "#F4F0DF",
          300: "#E9E3CE",
          400: "#DDD6BD",
        },
        forest: {
          950: "#061A13",
          900: "#0D382B", // wisprtype primary dark green button
          850: "#0E4334",
          800: "#145341",
          700: "#0D684D", // wisprtype vibrant italic accent
          600: "#10805F",
          500: "#10B981",
          200: "#C9E4D4",
          100: "#EFF5F0", // wisprtype light sage badge bg
          50: "#F6FAF7",
        },
        charcoal: {
          950: "#0D1210",
          900: "#141A17", // wisprtype primary dark text
          800: "#242E29",
          700: "#384540",
          600: "#4E5C56", // wisprtype secondary body text
          500: "#6B7A74",
          400: "#8E9E98",
          300: "#B8C4BF",
        },
        obsidian: {
          950: "#090D0C",
          900: "#0F1413", // wisprtype dark terminal / mockup
          850: "#141B19",
          800: "#1C2422",
          700: "#283330",
          600: "#3D4D48",
        },
        primary: {
          DEFAULT: "#0D382B",
          foreground: "#ffffff",
          glow: "rgba(13, 104, 77, 0.25)",
        },
        accent: {
          cyan: "#0284c7",
          emerald: "#0D684D",
          amber: "#d97706",
          rose: "#e11d48",
          purple: "#7c3aed"
        },
        dark: {
          950: "#090d0c",
          900: "#0f1413",
          850: "#141b19",
          800: "#1c2422",
          700: "#283330",
        }
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(13, 104, 77, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(13, 104, 77, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        }
      }
    },
  },
  plugins: [],
};
