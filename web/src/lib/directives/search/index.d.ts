import 'astro'
declare module 'astro' {
  interface AstroClientDirectives {
    'client:search'?: boolean
  }
}
