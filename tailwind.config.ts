import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      scrollbar: {
        width: '3px', // Custom scrollbar width
        thumb: '#888', // Custom thumb color
        track: '#fff', // Custom track color
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
      fontFamily: {
        sans: ['YourChineseFont', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        custom: ['YourChineseFont', 'sans-serif'],
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'),require('tailwind-scrollbar')({ nocompatible: true })],
};
export default config;
