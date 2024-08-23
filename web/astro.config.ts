import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'
import clickDirective from './src/lib/directives/click/register'
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import searchDirective from './src/lib/directives/search/register'
import solid from '@astrojs/solid-js'
import tailwind from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  integrations: [
    clickDirective(),
    searchDirective(),
    mdx(),
    sitemap({
      serialize(item) {
        if (item.url === 'https://corvu.dev/') {
          item.priority = 1
        } else {
          item.priority = 0.9
        }
        item.changefreq = ChangeFreqEnum.DAILY
        item.lastmod = new Date().toISOString()
        return item
      },
    }),
    solid(),
  ],
  prefetch: {
    prefetchAll: true,
  },
  redirects: {
    '/docs/usage/': {
      status: 307,
      destination: '/docs/state/',
    },
    '/docs/polymorphic/': {
      status: 307,
      destination: '/docs/dynamic-components/',
    },
    '/docs/polymorphism/': {
      status: 307,
      destination: '/docs/dynamic-components/',
    },
    '/docs/primitives/': {
      status: 307,
      destination: '/docs/overview/',
    },
    '/docs/utilities/': {
      status: 307,
      destination: '/docs/overview/',
    },
  },
  markdown: {
    syntaxHighlight: false,
  },
  site: 'https://corvu.dev',
  trailingSlash: 'always',
  experimental: {
    preserveScriptOrder: true,
  },
  vite: {
    plugins: [tailwind()],
  },
})
