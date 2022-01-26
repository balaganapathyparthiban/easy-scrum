const tailwindcssConfig = require('./src/assets/config/tailwindcss.json')

module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    screens: tailwindcssConfig.screens,
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
