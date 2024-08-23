import type { AstroIntegration } from 'astro'

export default () =>
  ({
    name: 'client:search',
    hooks: {
      'astro:config:setup': ({ addClientDirective }) => {
        addClientDirective({
          name: 'search',
          entrypoint: './src/lib/directives/search/search.ts',
        })
      },
    },
  }) satisfies AstroIntegration
