import { definePreset } from '@unocss/core'

const dataStates = [
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
]

const variants = dataStates.join('|')

export type PresetOptions = {
  prefix?: string
}

export default definePreset(
  ({ prefix }: PresetOptions = { prefix: 'corvu' }) => {
    return {
      name: 'unocss-preset-corvu',
      variants: [
        {
          name: 'unocss-variant-corvu',
          match: (matcher) => {
            const regex = new RegExp(`^${prefix}-(${variants})[:-]`)
            const match = matcher.match(regex)

            if (!match) return matcher

            const attribute = `[${prefix}-${match[1]}]`
            return {
              matcher: matcher.slice(match[0].length),
              selector: (s: string) =>
                `${s}${attribute},:where(${attribute}) ${s}`,
            }
          },
          autocomplete: [`${prefix}-(${variants})(:|-)`],
        },
      ],
    }
  },
)
