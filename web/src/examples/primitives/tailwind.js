import animatePlugin from 'tailwindcss-animate'
import corvuPlugin from '@corvu/tailwind'
import formsPlugin from '@tailwindcss/forms'

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
          text: '#180f24',
        },
      },
    },
  },
  plugins: [animatePlugin, corvuPlugin, formsPlugin],
}
