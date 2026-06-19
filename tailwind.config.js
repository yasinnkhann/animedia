const scrollbar = require('tailwind-scrollbar');
const scrollbarHide = require('tailwind-scrollbar-hide');
const aspectRatio = require('@tailwindcss/aspect-ratio');

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './utils/CommonMethods.ts',
  ],
  theme: {
    extend: {
      screens: {},
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.2s infinite',
      },
    },
  },
  corePlugins: {
    aspectratio: false,
  },
  plugins: [scrollbar, scrollbarHide, aspectRatio],
};
