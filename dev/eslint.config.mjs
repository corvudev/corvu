import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginSolid from 'eslint-plugin-solid'
import pluginTypescript from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist/'],
  },
  ...pluginTypescript.configs.recommended,
  pluginPrettier,
  {
    files: ['**/*.{ts,tsx}'],
    ...pluginSolid.configs['flat/typescript'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
  },
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
      '@typescript-eslint/no-empty-object-type': 'off',
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

      'solid/reactivity': 'off',
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
