/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors:{
        primary: "#5764c6"
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
          "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", " sans-serif"]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms")
  ]
};

