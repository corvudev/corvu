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
    if (e.metaKey && e.key === 'k') {
      // el.setAttribute('data-key-init', '')
      init()
    }
  }
  window.addEventListener('keydown', onKeydown)
  el.addEventListener('pointerover', init, { once: true })
}) satisfies ClientDirective
