import { createSignal, onCleanup, onMount } from 'solid-js'

const createMediaQuery = (query: string) => {
  const [matches, setMatches] = createSignal(false)

  onMount(() => {
    const onChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener('change', onChange)
    setMatches(result.matches)

    onCleanup(() => {
      result.removeEventListener('change', onChange)
    })
  })

  return matches
}

export default createMediaQuery
