import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginTypescript from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist/', 'tsup.config.*.mjs'],
  },
  ...pluginTypescript.configs.recommended,
  pluginPrettier,
  {
    languageOptions: {
      parser: tsParser,
    },
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
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/triple-slash-reference': 'off',

      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
        },
      ],

      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          jsxSingleQuote: false,
          semi: false,
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
    },
  },
]
