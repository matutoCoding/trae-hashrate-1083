/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#FFF5F5",
          100: "#FFE0E0",
          200: "#FFB3B3",
          300: "#FF8080",
          400: "#FF4D4D",
          500: "#C62828",
          600: "#8B0000",
          700: "#6B0000",
          800: "#4A0000",
          900: "#2D0000",
        },
        amber: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#D4AF37",
          600: "#B8860B",
          700: "#8B6914",
          800: "#5D4E0F",
          900: "#3D2E0A",
        },
        cream: {
          50: "#FDFCFA",
          100: "#FDF5E6",
          200: "#FAEBD7",
          300: "#F5DEB3",
          400: "#DEB887",
          500: "#D2B48C",
          600: "#C4A57B",
          700: "#A0826D",
          800: "#7D5A4F",
          900: "#3E2723",
        },
        fermentation: {
          normal: "#2E7D32",
          warning: "#F57C00",
          alert: "#C62828",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', "serif"],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(139, 0, 0, 0.08)",
        "card-hover": "0 8px 30px rgba(139, 0, 0, 0.12)",
      },
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "breathing": "breathing 3s ease-in-out infinite",
        "stagger-1": "staggerIn 0.5s ease-out 0.1s forwards",
        "stagger-2": "staggerIn 0.5s ease-out 0.2s forwards",
        "stagger-3": "staggerIn 0.5s ease-out 0.3s forwards",
        "stagger-4": "staggerIn 0.5s ease-out 0.4s forwards",
        "stagger-5": "staggerIn 0.5s ease-out 0.5s forwards",
        "stagger-6": "staggerIn 0.5s ease-out 0.6s forwards",
        "stagger-7": "staggerIn 0.5s ease-out 0.7s forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        breathing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(46, 125, 50, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(46, 125, 50, 0)" },
        },
        staggerIn: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
