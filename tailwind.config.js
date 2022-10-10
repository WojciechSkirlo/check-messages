/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {
      boxShadow: {
        custom: "0 10px 30px 0px rgba(232, 225, 244, 0.25)",
      },
    },
  },
  plugins: [],
};
