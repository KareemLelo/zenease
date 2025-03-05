/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          // ZenHR brand colors
          "zenhr-blue": "#0B3954",
          "zenhr-orange": "#FFB30F",
        }
      },
    },
    plugins: [],
  }