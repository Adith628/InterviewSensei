/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "radial-gradient":
          "radial-gradient(140% 107.13% at 50% 80%,rgba(0, 0, 0, 0) 37.41%,#6633ee 100%,rgba(255, 255, 255, 0) 100%)",
        "custom-gradient":
          "radial-gradient(140% 107.13% at 50% 10%, rgba(0, 0, 0, 0) 37.41%, rgba(249, 115, 22,0.2 ) 69.27%, rgba(0,0,0,1) 100%)",
        "custom-gradient-2":
          "radial-gradient(140% 107.13% at 50% 80%, rgba(0, 0, 0, 0) 37.41%, #6633ee 100%, rgba(255, 255, 255, 0) 100%)",
        "custom-gradient-3":
          "radial-gradient(140% 107.13% at 50% 80%, rgba(0, 0, 0, 0) 37.41%, #0A0622 100%, rgba(255, 255, 255, 0) 100%)",
        "custom-gradient-4":
          "linear-gradient(180deg, rgba(48, 39, 85, 0.16) 0%, rgba(10, 6, 34, 0.04) 100%);",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        gradientPulse: {
          "0%, 100%": {
            "background-size": "200% 100%",
            "background-position": "50% 50%",
          },
          "25%": {
            "background-size": "250% 110%",
            "background-position": "90% 10%",
          },
          "50%": {
            "background-size": "200% 120%",
            "background-position": "50% 50%",
          },
          "75%": {
            "background-size": "200% 110%",
            "background-position": "10% 90%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        "gradient-pulse": "gradientPulse 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
