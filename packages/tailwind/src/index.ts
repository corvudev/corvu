import plugin from 'tailwindcss/plugin'

const dataStates = ['open', 'closed', 'transitioning']

export type PluginOptions = {
  prefix?: string
}

export default plugin.withOptions<PluginOptions>(
  ({ prefix = 'corvu' } = {}) => {
    return ({ addVariant }) => {
      for (const state of dataStates) {
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
    }
  },
)
