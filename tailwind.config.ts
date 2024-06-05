import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      "ms-fg": "#1c2c3C", // Vordergrund Farbe
      "ms-hbg": "#fff", // Hervorgehobener Background
      "ms-bg": "#f9fafb", // Background Farbe
      "ms-grayscale": "#eaeaea", // 1 Akzent LIGHT: Border Accent 2 Go
      "ms-grayscale-1": "#c2c2c2", // Border Accent, um Text accent-2 von Wahrnehmung zu matchen
      "ms-grayscale-2": "#a8a8a8", // 2 Akzent MEDIUM: Alternativen Accent to use
      "ms-grayscale-3": "#616161", // 3 Akzent DARK: Subtitle Text Farbe
      "ms-primary": "#49714d", // Farbakzent Farbe
      "ms-red": "#bf0e3a",
      "ms-orange": "#ff8300",
      "ms-secondary": "#7b9f80",
      "ms-accent": "#079544",
    },
  },
  plugins: [],
});

export default config;
