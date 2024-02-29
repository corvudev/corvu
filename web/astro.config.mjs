import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        if (item.url === 'https://corvu.dev/') {
          item.changefreq = 'daily'
          item.lastmod = new Date()
          item.priority = 1
        } else {
          item.changefreq = 'daily'
          item.lastmod = new Date()
          item.priority = 0.9
        }
        return item
      },
    }),
    tailwind(),
    solid(),
  ],
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
  },
  markdown: {
    syntaxHighlight: false,
  },
  site: 'https://corvu.dev',
  trailingSlash: 'always',
})
