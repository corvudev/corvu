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
      animation: {
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [require('@corvu/tailwind')],
}
