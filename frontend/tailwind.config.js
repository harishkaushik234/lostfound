/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["DM Sans", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#eef8ff",
          100: "#d7efff",
          200: "#adddff",
          300: "#72c7ff",
          400: "#33a9ff",
          500: "#0b8ff0",
          600: "#0070cd",
          700: "#0059a6",
          800: "#074c87",
          900: "#0d406f"
        }
      },
      boxShadow: {
        glow: "0 20px 60px rgba(11, 143, 240, 0.18)"
      }
    }
  },
  plugins: []
};
