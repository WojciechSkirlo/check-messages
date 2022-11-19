/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    spacing: {
      0: "0px",
      1: "1px",
      2: "2px",
      3: "5px",
      3.5: "7.5px",
      4: "10px",
      4.5: "12.5px",
      5: "15px",
      5.5: "17.5px",
      6: "20px",
      7: "25px",
      8: "30px",
      9: "35px",
      10: "40px",
      11: "45px",
      12: "50px",
      14: "60px",
      24: "100px",
      36: "150px",
      48: "200px",
    },
    colors: {
      black: "#000000",
      white: "#ffffff",
      gray: {
        50: "#f3f4f6",
        100: "#e7e7e7",
        200: "#bbbbbb",
        300: "#c4c4c4",
        400: "#333333",
      },
    },
    borderRadius: {
      xl: "10px",
      full: "9999px",
    },
    fontSize: {
      xs: ["11px", "17px"],
      sm: ["12px", "18px"],
      base: ["16px", "24px"],
      lg: ["20px", "30px"],
    },
    extend: {
      animation: {
        "pulse-slow": "pulse-slow 1.5s ease infinite",
        "pulse-slow-one": "pulse-slow-one 0.5s ease",
        "pulse-color": "pulse-color 1.5s ease infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { transform: "scale(0.85)" },
          "50%": { transform: "scale(1.05)" },
        },

        "pulse-slow-one": {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },

        "pulse-color": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
};
