import plugin from 'tailwindcss/plugin'

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

export type PluginOptions = {
  prefix?: string
}

export default plugin.withOptions<PluginOptions>(
  ({ prefix = 'corvu' } = {}) => {
    return ({ addVariant }) => {
      for (const state of booleanStates) {
        addVariant(`${prefix}-${state}`, [`&[data-${state}]`])
        addVariant(
          `${prefix}-group-${state}`,
          `:merge(.group)[data-${state}] &`,
        )
        addVariant(
          `${prefix}-peer-${state}`,
          `:merge(.peer)[data-${state}] ~ &`,
        )
      }
      for (const stringState of stringStates) {
        const { name, states } = stringState
        for (const state of states) {
          addVariant(`${prefix}-${name}-${state}`, [
            `&[data-${name}='${state}']`,
          ])
          addVariant(
            `${prefix}-group-${name}-${state}`,
            `:merge(.group)[data-${name}='${state}'] &`,
          )
          addVariant(
            `${prefix}-peer-${name}-${state}`,
            `:merge(.peer)[data-${name}='${state}'] ~ &`,
          )
        }
      }
    }
  },
)
