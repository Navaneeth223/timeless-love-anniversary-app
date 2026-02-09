/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    "from-rosewater",
    "via-pearl",
    "to-aurora",
    "from-lavender",
    "via-rosewater",
    "to-aurora",
    "from-peach",
    "to-lavender"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body: ["Quicksand", "sans-serif"],
        script: ["Dancing Script", "cursive"]
      },
      colors: {
        rosewater: "#f8e8ed",
        blush: "#f5d0da",
        lavender: "#e9e2ff",
        aurora: "#cfe8ff",
        peach: "#ffe5d4",
        midnight: "#0b1020",
        stardust: "#1b1f3b",
        pearl: "#f7f5ff"
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 214, 232, 0.35)",
        glass: "0 20px 60px rgba(24, 28, 48, 0.18)"
      },
      backgroundImage: {
        "aurora-soft": "radial-gradient(1200px circle at 10% 10%, rgba(255,229,212,0.7), transparent 55%), radial-gradient(900px circle at 90% 20%, rgba(233,226,255,0.7), transparent 60%), radial-gradient(800px circle at 50% 80%, rgba(207,232,255,0.6), transparent 55%)",
        "moon-haze": "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8), rgba(255,255,255,0) 45%), linear-gradient(120deg, rgba(11,16,32,0.95), rgba(27,31,59,0.85))",
        "paper": "linear-gradient(120deg, rgba(255,255,255,0.92), rgba(255,255,255,0.8))"
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        drift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(10px, -12px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" }
        },
        twinkle: {
          "0%, 100%": { opacity: 0.35, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.15)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        drift: "drift 10s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        shimmer: "shimmer 10s ease infinite"
      }
    }
  },
  plugins: []
};
