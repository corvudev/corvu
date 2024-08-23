import 'astro'
declare module 'astro' {
  interface AstroClientDirectives {
    'client:click'?: boolean
  }
}
