module.exports = {
	content: [
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
		aspectRatio: false,
	},
	plugins: [
		require('tailwind-scrollbar'),
		require('tailwind-scrollbar-hide'),
		require('@tailwindcss/aspect-ratio'),
	],
};

/*
	   'sm': '640px',
       => @media (min-width: 640px) { ... }
      'md': '768px',
       => @media (min-width: 768px) { ... }
      'lg': '1024px',
       => @media (min-width: 1024px) { ... }
      'xl': '1280px',
       => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
       => @media (min-width: 1536px) { ... }
*/
