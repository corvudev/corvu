import astroParser from 'astro-eslint-parser'
import pluginAstro from 'eslint-plugin-astro'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import pluginSolid from 'eslint-plugin-solid'
import pluginTypescript from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist/', '.astro/'],
  },
  ...pluginTypescript.configs.recommended,
  pluginPrettier,
  ...pluginAstro.configs.recommended,
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

      'solid/reactivity': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,astro}'],
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
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
]
