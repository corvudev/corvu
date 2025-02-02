import typographyPlugin from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    typography: {
      DEFAULT: {
        css: {
          'blockquote > p': {
            marginBottom: '0px !important',
          },
        },
      },
    },
  },
  plugins: [typographyPlugin],
}
