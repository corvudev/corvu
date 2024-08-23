import type { AstroIntegration } from 'astro'

export default () =>
  ({
    name: 'client:click',
    hooks: {
      'astro:config:setup': ({ addClientDirective }) => {
        addClientDirective({
          name: 'click',
          entrypoint: './src/lib/directives/click/click.ts',
        })
      },
    },
  }) satisfies AstroIntegration
