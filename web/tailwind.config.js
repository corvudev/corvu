import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,md,mdx,ts,tsx}'],
  theme: {
    typography: {
      DEFAULT: {
        css: {
          'blockquote > p': {
            marginBottom: '0px !important',
            fontSize: '1rem !important',
          },
          code: {
            whiteSpace: 'nowrap',
            borderRadius: '0.25rem',
            backgroundColor: '#bcacf6',
            paddingLeft: '0.375rem',
            paddingRight: '0.375rem',
            paddingTop: '0.125rem',
            paddingBottom: '0.125rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: '700',
            color: '#180f23',
          },
        },
      },
    },
    extend: {
      fontFamily: {
        sans: ['Rubik Variable', ...defaultTheme.fontFamily.sans],
        dosis: ['Dosis Variable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        corvu: {
          text: '#dbd9e6',
          50: '#f2f0fe',
          100: '#e6e2fd',
          200: '#d4cbfb',
          light: '#D4C0FF',
          300: '#bcacf6',
          400: '#a888f1',
          500: '#9a6de9',
          600: '#8f50dc',
          700: '#7e41c3',
          accent: '#7250AE',
          800: '#63359c',
          900: '#52317d',
          dark: '#180f23',
          1000: '#0C0812',
        },
      },
      backgroundImage: {
        caret:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none'%3E%3Cpath fill='%23f2f0fe' d='m16.6922 7.9422-6.25 6.25a.6256.6256 0 0 1-.8844 0l-6.25-6.25A.625.625 0 0 1 3.75 6.875h12.5a.6251.6251 0 0 1 .4422 1.0672Z'/%3E%3C/svg%3E\")",
      },
      animation: {
        expand: 'expand 250ms cubic-bezier(0.32,0.72,0,0.75)',
        collapse: 'collapse 250ms cubic-bezier(0.32,0.72,0,0.75)',
      },
      keyframes: {
        expand: {
          '0%': {
            height: '0px',
          },
          '100%': {
            height: 'var(--corvu-disclosure-content-height)',
          },
        },
        collapse: {
          '0%': {
            height: 'var(--corvu-disclosure-content-height)',
          },
          '100%': {
            height: '0px',
          },
        },
      },
    },
  },
  plugins: [
    require('@corvu/tailwind'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    plugin(
      ({ addUtilities, matchUtilities, theme }) => {
        addUtilities({
          '@keyframes enter': theme('keyframes.enter'),
          '@keyframes exit': theme('keyframes.exit'),
          '.animate-in': {
            animationName: 'enter',
            animationDuration: theme('animationDuration.DEFAULT'),
            '--tw-enter-opacity': 'initial',
            '--tw-enter-scale': 'initial',
            '--tw-enter-rotate': 'initial',
            '--tw-enter-translate-x': 'initial',
            '--tw-enter-translate-y': 'initial',
          },
          '.animate-out': {
            animationName: 'exit',
            animationDuration: theme('animationDuration.DEFAULT'),
            '--tw-exit-opacity': 'initial',
            '--tw-exit-scale': 'initial',
            '--tw-exit-rotate': 'initial',
            '--tw-exit-translate-x': 'initial',
            '--tw-exit-translate-y': 'initial',
          },
        })

        matchUtilities(
          {
            'fade-in': (value) => ({ '--tw-enter-opacity': value }),
            'fade-out': (value) => ({ '--tw-exit-opacity': value }),
          },
          { values: theme('animationOpacity') },
        )

        matchUtilities(
          {
            'zoom-in': (value) => ({ '--tw-enter-scale': value }),
            'zoom-out': (value) => ({ '--tw-exit-scale': value }),
          },
          { values: theme('animationScale') },
        )

        matchUtilities(
          {
            'spin-in': (value) => ({ '--tw-enter-rotate': value }),
            'spin-out': (value) => ({ '--tw-exit-rotate': value }),
          },
          { values: theme('animationRotate') },
        )

        matchUtilities(
          {
            'slide-in-from-top': (value) => ({
              '--tw-enter-translate-y': `-${value}`,
            }),
            'slide-in-from-bottom': (value) => ({
              '--tw-enter-translate-y': value,
            }),
            'slide-in-from-left': (value) => ({
              '--tw-enter-translate-x': `-${value}`,
            }),
            'slide-in-from-right': (value) => ({
              '--tw-enter-translate-x': value,
            }),
            'slide-out-to-top': (value) => ({
              '--tw-exit-translate-y': `-${value}`,
            }),
            'slide-out-to-bottom': (value) => ({
              '--tw-exit-translate-y': value,
            }),
            'slide-out-to-left': (value) => ({
              '--tw-exit-translate-x': `-${value}`,
            }),
            'slide-out-to-right': (value) => ({
              '--tw-exit-translate-x': value,
            }),
          },
          { values: theme('animationTranslate') },
        )
      },
      {
        theme: {
          extend: {
            animationDelay: ({ theme }) => ({
              ...theme('transitionDelay'),
            }),
            animationDuration: ({ theme }) => ({
              0: '0ms',
              ...theme('transitionDuration'),
            }),
            animationTimingFunction: ({ theme }) => ({
              ...theme('transitionTimingFunction'),
            }),
            animationFillMode: {
              none: 'none',
              forwards: 'forwards',
              backwards: 'backwards',
              both: 'both',
            },
            animationDirection: {
              normal: 'normal',
              reverse: 'reverse',
              alternate: 'alternate',
              'alternate-reverse': 'alternate-reverse',
            },
            animationOpacity: ({ theme }) => ({
              DEFAULT: 0,
              ...theme('opacity'),
            }),
            animationTranslate: ({ theme }) => ({
              DEFAULT: '100%',
              ...theme('translate'),
            }),
            animationScale: ({ theme }) => ({
              DEFAULT: 0,
              ...theme('scale'),
            }),
            animationRotate: ({ theme }) => ({
              DEFAULT: '30deg',
              ...theme('rotate'),
            }),
            animationRepeat: {
              0: '0',
              1: '1',
              infinite: 'infinite',
            },
            keyframes: {
              enter: {
                from: {
                  opacity: 'var(--tw-enter-opacity, 1)',
                  transform:
                    'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1)) rotate(var(--tw-enter-rotate, 0))',
                },
              },
              exit: {
                to: {
                  opacity: 'var(--tw-exit-opacity, 1)',
                  transform:
                    'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1)) rotate(var(--tw-exit-rotate, 0))',
                },
              },
            },
          },
        },
      },
    ),
  ],
}
