/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      app: '#014979',
      white: '#FFFFFF',
      black: '#314240',
      darkapp: '#002c4a',
      darkgrey: '#555555',
      orange: '#E8993E',
      green: '#40D886',
      red: '#D8404D',
    },
  },
  plugins: [],
}

