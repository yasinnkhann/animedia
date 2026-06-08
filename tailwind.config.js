const scrollbar = require('tailwind-scrollbar');
const scrollbarHide = require('tailwind-scrollbar-hide');
const aspectRatio = require('@tailwindcss/aspect-ratio');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/CommonMethods.ts',
  ],
  theme: {
    extend: {
      screens: {},
    },
  },
  corePlugins: {
    aspectratio: false,
  },
  plugins: [scrollbar, scrollbarHide, aspectRatio],
};
