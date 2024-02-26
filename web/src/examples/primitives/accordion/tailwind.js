/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        corvu: {
          bg: '#f3f1fe',
          100: '#e6e2fd',
          200: '#d4cbfb',
          300: '#bcacf6',
          400: '#a888f1',
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
