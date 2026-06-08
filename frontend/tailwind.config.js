/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest': '#2E7D32',
        'light-green': '#4CAF50',
        'mint': '#E8F5E9',
        'earth': '#795548',
        'leaf': '#81C784',
      }
    },
  },
  plugins: [],
}