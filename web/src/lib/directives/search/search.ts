import type { ClientDirective } from 'astro'

export default ((load, opts, el) => {
  const mql = matchMedia(opts.value)
  const init = async () => {
    if (!mql.matches) return
    window.removeEventListener('keydown', onKeydown)

    const hydrate = await load()
    await hydrate()
  }

  const onKeydown = async (e: KeyboardEvent) => {
    if (!(e.metaKey && e.key === 'k') && e.key !== '/') return
    init()
  }
  window.addEventListener('keydown', onKeydown)

  el.addEventListener(
    'click',
    (e) => {
      e.preventDefault()
      init()
    },
    { once: true },
  )
}) satisfies ClientDirective
