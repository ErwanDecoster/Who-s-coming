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
      // app: '#7BA5A1',
      // app: '#CA2E55',
      // app: '#F7A278',
      // app: '#016FB9',
      app: '#014979',
      white: '#FFFFFF',
      black: '#314240',
      orange: '#E8993E',
      green: '#40D886',
      red: '#D8404D',
    },
  },
  plugins: [],
}

