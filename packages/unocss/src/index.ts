import { definePreset } from '@unocss/core'

const booleanStates = [
  'open',
  'closed',
  'expanded',
  'collapsed',
  'transitioning',
  'opening',
  'closing',
  'snapping',
  'resizing',
  'disabled',
  'active',
  'dragging',
  'selected',
  'today',
  'range-start',
  'range-end',
  'in-range',
]

const stringStates = [
  {
    name: 'side',
    states: ['top', 'right', 'bottom', 'left'],
  },
]

const variants = booleanStates.join('|')

export type PresetOptions = {
  prefix?: string
}

export default definePreset(
  ({ prefix }: PresetOptions = { prefix: 'corvu' }) => {
    return {
      name: 'unocss-preset-corvu',
      variants: [
        {
          name: 'unocss-variant-corvu-boolean',
          match: (matcher) => {
            const regex = new RegExp(`^${prefix}-(${variants}):`)
            const match = matcher.match(regex)

            if (!match) return matcher

            return {
              matcher: matcher.slice(match[0].length),
              selector: (s: string) => `${s}[data-${match[1]}]`,
            }
          },
          autocomplete: [`${prefix}-(${variants}):`],
        },
        ...stringStates.map((stringState) => {
          const states = stringState.states.join('|')
          return {
            name: `unocss-variant-corvu-${stringState.name}`,
            match: (matcher: string) => {
              const regex = new RegExp(
                `^${prefix}-${stringState.name}-(${states}):`,
              )
              const match = matcher.match(regex)

              if (!match) return matcher

              return {
                matcher: matcher.slice(match[0].length),
                selector: (s: string) =>
                  `${s}[data-${stringState.name}='${match[1]}']`,
              }
            },
            autocomplete: [`${prefix}-(${variants}):`],
          }
        }),
      ],
    }
  },
)
