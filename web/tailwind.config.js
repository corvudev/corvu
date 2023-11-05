import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rubik Variable', ...defaultTheme.fontFamily.sans],
        dosis: ['Dosis Variable', ...defaultTheme.fontFamily.sans],
      },
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
          dark: '#180f24',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@corvu/tailwind')],
}
