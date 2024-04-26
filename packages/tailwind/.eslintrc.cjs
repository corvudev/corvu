module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    // Must be last
    // See: https://github.com/prettier/eslint-plugin-prettier#configuration-legacy-eslintrc
    'plugin:prettier/recommended',
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

    'solid/reactivity': 'off',

    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        jsxSingleQuote: false,
        semi: false,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
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
