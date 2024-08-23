import type { ClientDirective } from 'astro'

export default ((load, _opts, el) => {
  const init = async () => {
    window.removeEventListener('keydown', onKeydown)
    const hydrate = await load()
    await hydrate()
  }
  const onKeydown = async (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      init()
    }
  }
  window.addEventListener('keydown', onKeydown)
  el.addEventListener('pointerover', init, { once: true })
}) satisfies ClientDirective
