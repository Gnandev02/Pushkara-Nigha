/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#060212",
        darkPanel: "rgba(18, 10, 36, 0.75)",
        neonPurple: "#9d4edd",
        neonBlue: "#00b4d8",
        neonPink: "#ff007f",
        glassBorder: "rgba(157, 78, 221, 0.2)",
      },
      boxShadow: {
        neonGlow: "0 0 15px rgba(157, 78, 221, 0.5)",
        blueGlow: "0 0 15px rgba(0, 180, 216, 0.5)",
        pinkGlow: "0 0 15px rgba(255, 0, 127, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      }
    },
  },
  plugins: [],
}
