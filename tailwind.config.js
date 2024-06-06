/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    colors: {
      'color-1': '#FFF5E0',
      'color-2': '#8DECB4',
      'color-3': '#41B06E',
      'color-4': '#141E46',
      'white': '#FFFFFF',
      'red-600': '#DC2626',
      'red-700': '#b91c1c',
      'orange-200': '#fed7aa'
    },
    extend: {
      fontFamily: {
        "roboto": ['Roboto', 'sans-serif'],
        'press-start': ['Press Start 2P', 'cursive'],
        'bebas-neue': ['Bebas Neue', 'sans-serif']
      },
    },
  },
  plugins: [],
}

