/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js, jsx, ts, tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // ✅ This covers files like app/index.jsx and _layout.jsx
    "./components/**/*.{js,jsx,ts,tsx}", // optional: if you're using components folder
    "./screens/**/*.{js,jsx,ts,tsx}", // optional: if you're using screens folder
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
