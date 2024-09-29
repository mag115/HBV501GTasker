/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        offWhite: '#FAF9F6',
        black: '#141414',
        blackLight: '#222222',
        green: '#66A182',
        red: '#FE5F55',
        grey: '#71697A',
        greyDark: '#332F37',
        blue: '#8F95D3',
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    },
  },
  plugins: [],
};
