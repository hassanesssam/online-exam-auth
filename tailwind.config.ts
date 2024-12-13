import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens:{
        xs:"300px",
        sm:"576px",
        md:"768px",
        lg:"992px",
        xl:"1200px",
        "2xl":"1400px"
      }
    },
  },
  plugins: [],
} satisfies Config;
