module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:solid/typescript',
    // Must be last
    // See: https://github.com/prettier/eslint-plugin-prettier#configuration-legacy-eslintrc
    'plugin:prettier/recommended',
    'plugin:astro/recommended',
  ],
  ignorePatterns: ['!.*', 'dist', 'node_modules'],
  rules: {
    'no-console': 'warn',

    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
      },
    ],

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/triple-slash-reference': 'off',

    'tailwindcss/classnames-order': 'error',
    'tailwindcss/enforces-negative-arbitrary-values': 'error',
    'tailwindcss/enforces-shorthand': 'error',
    'tailwindcss/migration-from-tailwind-2': 'error',
    'tailwindcss/no-custom-classname': 'error',

    'solid/reactivity': 'off',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        'solid/prefer-for': 'off',
        'solid/self-closing-comp': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx', '*.astro'],
      parserOptions: {
        project: true,
      },
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/strict-boolean-expressions': 'error',
      },
    },
  ],
}
