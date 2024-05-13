import { access, type MaybeAccessor } from '@src/reactivity'
import type { Alignment, Side } from '@floating-ui/dom'
import { createMemo } from 'solid-js'
import type { FloatingState } from '@src/create/floating'

const getFloatingStyle = (props: {
  strategy: MaybeAccessor<'absolute' | 'fixed'>
  floatingState: MaybeAccessor<FloatingState>
}) => {
  const memoizedFloatingStyle = createMemo(() => {
    const strategy = access(props.strategy)
    const floatingState = access(props.floatingState)

    const side = floatingState.placement.split('-')[0] as Side
    const alignment = floatingState.placement.split('-')[1] as
      | Alignment
      | undefined

    let transformOrigin
    switch (floatingState.placement) {
      case 'top':
      case 'bottom':
        transformOrigin = `${alignment ? alignment : 'center'} ${PositionToDirection[side]}`
      case 'left':
      case 'right':
        transformOrigin = `${PositionToDirection[side]} ${alignment ? alignment : 'center'}`
    }

    return {
      position: strategy,
      top: `${floatingState.y}px`,
      left: `${floatingState.x}px`,
      width:
        floatingState.width !== null ? `${floatingState.width}px` : undefined,
      height:
        floatingState.height !== null ? `${floatingState.height}px` : undefined,
      'max-width':
        floatingState.maxWidth !== null
          ? `${floatingState.maxWidth}px`
          : undefined,
      'max-height':
        floatingState.maxHeight !== null
          ? `${floatingState.maxHeight}px`
          : undefined,
      '--corvu-floating-transform-origin': transformOrigin,
    }
  })

  return memoizedFloatingStyle
}

const PositionToDirection = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

export { getFloatingStyle, PositionToDirection }
