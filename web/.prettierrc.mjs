/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  jsxSingleQuote: false,
  semi: false,
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
        singleQuote: true,
        jsxSingleQuote: false,
        semi: false,
      },
    },
  ],
}
