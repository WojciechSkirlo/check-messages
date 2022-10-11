/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    spacing: {
      "1": "1px",
      "2": "2px",
      "3": "5px",
      "4": "10px",
      "4.5": "12.5px",
      "5": "15px",
      "6": "20px",
      "7": "25px",
      "8": "30px",
      "9": "35px",
      "10": "40px",
      "11": "45px",
      "12": "50px",
    },
    colors: {
      black: "#000000",
      white: "#ffffff",
      gray: {
        "50": "#f3f4f6",
        "100": "#e7e7e7",
        "200": "#bbbbbb",
        "300": "#c4c4c4",
        "400": "#333333",
      }
    },
    borderRadius: {
      "xl": "10px",
      "full": "9999px",
    },
    fontSize: {
      xs: ["11px", "17px"],
      sm: ["12px", "18px"],
      base: ["16px", "24px"],
      lg: ["20px", "30px"],
    }
  },
  plugins: [],
};
