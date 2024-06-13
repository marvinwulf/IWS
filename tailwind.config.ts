import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
    colors: {
      "ms-fg": "var(--ms-fg)", // Vordergrund Farbe
      "ms-hbg": "var(--ms-hbg)", // Hervorgehobener Background
      "ms-bg": "var(--ms-bg)", // Background Farbe
      "ms-grayscale": "var(--ms-grayscale)", // 1 Akzent LIGHT: Border Accent 2 Go
      "ms-grayscale-1": "var(--ms-grayscale-1)", // Border Accent, um Text accent-2 von Wahrnehmung zu matchen
      "ms-grayscale-2": "var(--ms-grayscale-2)", // 2 Akzent MEDIUM: Alternativen Accent to use
      "ms-grayscale-3": "var(--ms-grayscale-3)", // 3 Akzent DARK: Subtitle Text Farbe
      "ms-primary": "var(--ms-primary)", // Farbakzent Farbe
      "ms-secondary": "var(--ms-secondary)",
      "ms-red": "var(--ms-red)",
      "ms-orange": "var(--ms-orange)",
      "ms-accent": "var(--ms-accent)",
      "switch-circle": "var(--switch-circle)",
    },
  },
  plugins: [],
});

export default config;
