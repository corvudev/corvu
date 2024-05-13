import {
  children,
  createMemo,
  type JSX,
  mergeProps,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@src/dynamic'
import type { FloatingState } from '@src/create/floating'
import { PositionToDirection } from '@src/floating/lib'

export const DEFAULT_FLOATING_ARROW_ELEMENT = 'div'

export type FloatingArrowCorvuProps = {
  floatingState: FloatingState
  /**
   * Size of the arrow in px.
   * @defaultValue 16
   */
  size?: number
}

export type FloatingArrowSharedElementProps = {
  style: JSX.CSSProperties
  children: JSX.Element
}

export type FloatingArrowElementProps = FloatingArrowSharedElementProps

export type FloatingArrowProps = FloatingArrowCorvuProps &
  Partial<FloatingArrowSharedElementProps>

type Position = 'top' | 'bottom' | 'left' | 'right'

const Transform = {
  top: 'rotate(180deg)',
  bottom: 'translate3d(0, 100%, 0)',
  left: 'translate3d(0, 50%, 0) rotate(90deg) translate3d(-50%, 0, 0)',
  right: 'translate3d(0, 50%, 0) rotate(-90deg) translate3d(50%, 0, 0)',
}

const TransformOrigin = {
  top: 'center 0px',
  bottom: undefined,
  left: '0px 0px',
  right: '100% 0px',
}

const FloatingArrow = <
  T extends ValidComponent = typeof DEFAULT_FLOATING_ARROW_ELEMENT,
>(
  props: DynamicProps<T, FloatingArrowProps, FloatingArrowElementProps>,
) => {
  const defaultedProps = mergeProps(
    {
      size: 16,
    },
    props as FloatingArrowProps & { as?: ValidComponent },
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'as',
    'floatingState',
    'size',
    'style',
    'children',
  ])

  const arrowDirection = createMemo(
    () =>
      PositionToDirection[
        localProps.floatingState.placement.split('-')[0] as Position
      ] as Position,
  )

  const arrowTop = createMemo(() => {
    const y = localProps.floatingState.arrowY
    if (y === null) return undefined
    return `${y}px`
  })

  const arrowLeft = createMemo(() => {
    const x = localProps.floatingState.arrowX
    if (x === null) return undefined
    return `${x}px`
  })

  const resolveChildren = children(() => localProps.children)

  const defaultArrow = () => resolveChildren.toArray().length === 0

  return (
    <Dynamic<FloatingArrowElementProps>
      as={localProps.as ?? DEFAULT_FLOATING_ARROW_ELEMENT}
      // === SharedElementProps ===
      style={{
        position: 'absolute',
        left: arrowLeft(),
        top: arrowTop(),
        [arrowDirection()]: '0px',
        transform: Transform[arrowDirection()],
        'transform-origin': TransformOrigin[arrowDirection()],
        height: defaultArrow() ? `${localProps.size}px` : undefined,
        width: defaultArrow() ? `${localProps.size}px` : undefined,
        'pointer-events': 'none',
        ...localProps.style,
      }}
      {...otherProps}
    >
      <Show when={defaultArrow()} fallback={resolveChildren()}>
        <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L6.24742 7.13991C6.64583 7.59524 7.35416 7.59524 7.75258 7.13991L14 0H0Z"
            fill="currentColor"
          />
        </svg>
      </Show>
    </Dynamic>
  )
}

export default FloatingArrow
