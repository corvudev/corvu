import type { ClientDirective } from 'astro'

export default ((load, _opts, el) => {
  el.addEventListener(
    'click',
    async (e) => {
      e.preventDefault()
      const hydrate = await load()
      await hydrate()
    },
    { once: true },
  )
}) satisfies ClientDirective
