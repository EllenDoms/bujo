const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.blueGray,
        rose: colors.rose,
        green: colors.Emerald,
      },
      minWidth: {
        56: '14rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
