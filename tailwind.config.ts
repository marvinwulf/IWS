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
      "ms-accent": "#eaeaea", // 1 Akzent LIGHT: Border Accent 2 Go
      "ms-accent-1": "#c2c2c2", // Border Accent, um Text accent-2 von Wahrnehmung zu matchen
      "ms-accent-2": "#a8a8a8", // 2 Akzent MEDIUM: Alternativen Accent to use
      "ms-accent-3": "#616161", // 3 Akzent DARK: Subtitle Text Farbe
      "ms-colored": "#009788", // Farbakzent Farbe
      "ms-red": "#d80032",
      "ms-orange": "#ff6100",
      "ms-green": "#009446",
    },
  },
  plugins: [],
});

export default config;
