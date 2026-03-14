/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "move-hint": {
          "0%": { opacity: "0", transform: "translateX(-3px)" },
          "12%": { opacity: "0.95", transform: "translateX(0)" },
          "75%": { opacity: "0.72", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(2px)" },
        },
      },
      animation: {
        "move-hint": "move-hint 5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
