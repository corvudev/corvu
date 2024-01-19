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
      animation: {
        expand: 'expand 250ms cubic-bezier(0.32,0.72,0,0.75)',
        collapse: 'collapse 250ms cubic-bezier(0.32,0.72,0,0.75)',
      },
      keyframes: {
        expand: {
          '0%': {
            height: '0px',
          },
          '100%': {
            height: 'var(--corvu-disclosure-content-height)',
          },
        },
        collapse: {
          '0%': {
            height: 'var(--corvu-disclosure-content-height)',
          },
          '100%': {
            height: '0px',
          },
        },
      },
    },
  },
  plugins: [require('@corvu/tailwind')],
}
