/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        corvu: {
          50: '#f2f0fe',
          100: '#e6e2fd',
          200: '#d4cbfb',
          light: '#D4C0FF',
          300: '#bcacf6',
          400: '#a888f1',
          500: '#9a6de9',
          600: '#8f50dc',
          700: '#7e41c3',
          accent: '#7250AE',
          800: '#63359c',
          900: '#52317d',
          dark: '#180f23',
          1000: '#0C0812',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    require('@corvu/tailwind'),
  ],
}
