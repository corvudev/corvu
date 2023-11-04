import {
  createSignal,
  createEffect,
  untrack,
  onCleanup,
  createMemo,
} from 'solid-js'
import type { Accessor } from 'solid-js'

const createPresence = (props: {
  present: Accessor<boolean>
  element: Accessor<HTMLElement | null>
}) => {
  const refStyles = createMemo(() => {
    const element = props.element()
    if (!element) return
    return getComputedStyle(element)
  })

  const [presentState, setPresentState] = createSignal<
    'present' | 'hiding' | 'hidden'
    // eslint-disable-next-line solid/reactivity
  >(props.present() ? 'present' : 'hidden')

  let animationName = ''

  createEffect((prevPresent) => {
    const isPresent = props.present()

    untrack(() => {
      if (prevPresent === isPresent) return isPresent

      const prevAnimationName = animationName
      const currentAnimationName = getAnimationName()

      if (isPresent) {
        setPresentState('present')
      } else if (
        currentAnimationName === 'none' ||
        refStyles()?.display === 'none'
      ) {
        setPresentState('hidden')
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName

        if (prevPresent && isAnimating) {
          setPresentState('hiding')
        } else {
          setPresentState('hidden')
        }
      }
    })

    return isPresent
  })

  createEffect(() => {
    const element = props.element()

    if (!element) {
      untrack(() => {
        if (presentState() === 'hiding') {
          setPresentState('hidden')
        }
      })
      return
    }

    const handleAnimationStart = (event: AnimationEvent) => {
      if (event.target === element) {
        animationName = getAnimationName()
      }
    }

    const handleAnimationEnd = (event: AnimationEvent) => {
      const currentAnimationName = getAnimationName()
      const isCurrentAnimation = currentAnimationName.includes(
        event.animationName,
      )
      if (
        event.target === element &&
        isCurrentAnimation &&
        presentState() === 'hiding'
      ) {
        setPresentState('hidden')
      }
    }

    element.addEventListener('animationstart', handleAnimationStart)
    element.addEventListener('animationcancel', handleAnimationEnd)
    element.addEventListener('animationend', handleAnimationEnd)

    onCleanup(() => {
      element.removeEventListener('animationstart', handleAnimationStart)
      element.removeEventListener('animationcancel', handleAnimationEnd)
      element.removeEventListener('animationend', handleAnimationEnd)
    })
  })

  const getAnimationName = () => {
    return refStyles()?.animationName ?? 'none'
  }

  return {
    present: () => presentState() === 'present' || presentState() === 'hiding',
    presentState,
  }
}

export default createPresence
