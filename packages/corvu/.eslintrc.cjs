module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:solid/typescript',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'solid'],
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/method-signature-style': 'error',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        jsxSingleQuote: false,
        semi: false,
      },
    ],
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
      },
      rules: {
        '@typescript-eslint/no-unnecessary-condition': 'error',
      },
    },
  ],
}
