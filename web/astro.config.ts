import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  integrations: [
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
    tailwind(),
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
  server: ({ command }) => {
    const headers = {
      'Content-Security-Policy': '',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    }
    if (command === 'preview') {
      headers['Content-Security-Policy'] =
        "default-src 'none'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://search.corvu.dev; script-src 'self' 'sha256-bGexXsQQsd8/fQ76d1TEHQPA2DsGBIKH0c4775rmfHA=' 'sha256-6kvMOmcltqpyQgHGLMSn9KkflgMKuN9N+1XpTYYwCV8=' 'sha256-VmEf2BGdqVUwcvyhTyarJo/bY7DNqS2+T2sz4IO/kbw=' 'sha256-Vk9u4LOF9cRpsIqEgXvmmhUcOeCgyJXxMnbT1zgVgt0=' 'sha256-Q2BPg90ZMplYY+FSdApNErhpWafg2hcRRbndmvxuL/Q=' 'sha256-0chmwFk0zaA528yFfGV7J9ppIpdfTPPULncDF3WG7Zs=' 'sha256-JgTl5El5IBZT89ObECU8uNurbKGC9LQeD+r6SrgWrVo=' 'sha256-Q2BPg90ZMplYY+FSdApNErhpWafg2hcRRbndmvxuL/Q=' 'sha256-kFeoDSWHQOvrXnLnINpu9MxbRTnfw+Z6Qzws7pBc+X4='; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    }
    return { headers }
  },
})
