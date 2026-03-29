/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "var(--bg-page)",
        card: { DEFAULT: "var(--bg-card)", alt: "var(--bg-card-alt)" },
        txt: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        brand: { DEFAULT: "var(--primary)", light: "var(--primary-light)" },
        btn: {
          bg: "var(--btn-bg)",
          border: "var(--btn-border)",
          "hover-bg": "var(--btn-hover-bg)",
          "hover-border": "var(--btn-hover-border)",
        },
        live: {
          bg: "var(--live-bg)",
          border: "var(--live-border)",
          accent: "var(--live-accent)",
          "badge-bg": "var(--live-badge-bg)",
          "badge-text": "var(--live-badge-text)",
        },
        "live-viewed": {
          border: "var(--live-viewed-border)",
          bg: "var(--live-viewed-bg)",
        },
        viewed: {
          bg: "var(--viewed-bg)",
          border: "var(--viewed-border)",
          "badge-bg": "var(--viewed-badge-bg)",
          "badge-text": "var(--viewed-badge-text)",
        },
        responsible: {
          bg: "var(--responsible-bg)",
          text: "var(--responsible-text)",
        },
        number: { bg: "var(--number-bg)", text: "var(--number-text)" },
        header: {
          border: "var(--header-border)",
          from: "var(--header-gradient-from)",
          to: "var(--header-gradient-to)",
        },
      },
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
