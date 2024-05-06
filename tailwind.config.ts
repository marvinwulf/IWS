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
      "ms-fg": "#263238",
      "ms-hbg": "#fff",
      "ms-bg": "#fafafa",
      "ms-accent-0": "#f5f5f5",
      "ms-accent": "#eaeaea",
      "ms-accent-1": "#c2c2c2",
      "ms-accent-2": "#a8a8a8",
      "ms-accent-3": "#616161",
      "ms-accent-4": "#292929",
      "ms-button-hover": "#f0f2f4",
      "ms-colored": "#009788",
      "ms-red": "#d80032",
      "ms-orange": "#ff6100",
      "ms-green": "#009446",
    },
  },
  plugins: [],
});
export default config;
