import { access, type MaybeAccessor } from '@src/reactivity'
import {
  arrow,
  autoPlacement,
  type AutoPlacementOptions,
  autoUpdate,
  computePosition,
  type DetectOverflowOptions,
  flip,
  type FlipOptions,
  hide,
  type HideOptions,
  inline,
  type InlineOptions,
  type Middleware,
  offset,
  type OffsetOptions,
  type Padding,
  type Placement,
  shift,
  type ShiftOptions,
  size,
  type Strategy,
} from '@floating-ui/dom'
import { createEffect, createSignal } from 'solid-js'
import { mergeProps } from '@solidjs/web'

export type FloatingOptions = {
  offset?: OffsetOptions
  shift?: boolean | ShiftOptions
  flip?: boolean | FlipOptions
  arrow?: Padding
  size?: DetectOverflowOptions & {
    matchSize?: boolean
    fitViewPort?: boolean
  }
  autoPlacement?: boolean | AutoPlacementOptions
  hide?: boolean | HideOptions
  inline?: boolean | InlineOptions
}

export type FloatingState = {
  placement: Placement
  x: number
  y: number
  width: number | null
  height: number | null
  maxWidth: number | null
  maxHeight: number | null
  arrowX: number | null
  arrowY: number | null
}

const createFloating = (props: {
  enabled?: MaybeAccessor<boolean>
  reference: MaybeAccessor<HTMLElement | null>
  floating: MaybeAccessor<HTMLElement | null>
  arrow?: MaybeAccessor<HTMLElement | null>
  placement?: MaybeAccessor<Placement>
  strategy?: MaybeAccessor<Strategy>
  options?: MaybeAccessor<FloatingOptions | null>
}) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      placement: 'bottom' as const,
      strategy: 'absolute' as const,
      options: null,
    },
    props,
  )

  const [floatingState, setFloatingState] = createSignal<FloatingState>({
    placement: access(defaultedProps.placement),
    x: 0,
    y: 0,
    width: null,
    height: null,
    maxWidth: null,
    maxHeight: null,
    arrowX: null,
    arrowY: null,
  })

  createEffect(
    () =>
      [
        access(defaultedProps.enabled),
        access(defaultedProps.reference),
        access(defaultedProps.floating),
        access(defaultedProps.options),
        access(defaultedProps.arrow),
      ] as const,
    ([enabled, reference, floating, options, arrowElement]) => {
      if (!enabled || !reference || !floating) return

      const middleware: Middleware[] = []

      if (options?.offset !== undefined) {
        middleware.push(offset(options.offset))
      }
      if (options?.shift !== undefined && options.shift !== false) {
        const shiftOptions = options.shift === true ? undefined : options.shift
        middleware.push(shift(shiftOptions))
      }
      if (arrowElement) {
        middleware.push(
          arrow({
            element: arrowElement,
            padding: options?.arrow,
          }),
        )
      }

      const flipEnabled = options?.flip !== undefined && options.flip !== false
      const flipOptions =
        typeof options?.flip === 'boolean' ? undefined : options?.flip

      if (flipEnabled && flipOptions?.fallbackStrategy !== 'initialPlacement') {
        middleware.push(flip(flipOptions))
      }

      if (options?.size) {
        middleware.push(
          size({
            apply: ({ availableWidth, availableHeight, ...state }) => {
              const newFloatingState: Partial<FloatingState> = {}

              if (options.size!.matchSize === true) {
                if (
                  state.placement.startsWith('top') ||
                  state.placement.startsWith('bottom')
                ) {
                  newFloatingState.width = state.rects.reference.width
                } else {
                  newFloatingState.height = state.rects.reference.height
                }
              }
              if (options.size!.fitViewPort === true) {
                if (
                  state.placement.startsWith('top') ||
                  state.placement.startsWith('bottom')
                ) {
                  newFloatingState.maxHeight = availableHeight
                } else {
                  newFloatingState.maxWidth = availableWidth
                }
              }

              if (!floatingStatesMatch(floatingState(), newFloatingState)) {
                setFloatingState((state) => ({ ...state, ...newFloatingState }))
              }
            },
            ...options.size,
          }),
        )
      }

      if (flipEnabled && flipOptions?.fallbackStrategy === 'bestFit') {
        middleware.push(flip(flipOptions))
      }

      if (
        !flipEnabled &&
        options?.autoPlacement !== undefined &&
        options.autoPlacement !== false
      ) {
        const autoPlacementOptions =
          options.autoPlacement === true ? undefined : options.autoPlacement
        middleware.push(autoPlacement(autoPlacementOptions))
      }

      if (options?.hide !== undefined && options.hide !== false) {
        const hideOptions = options.hide === true ? undefined : options.hide
        middleware.push(hide(hideOptions))
      }

      if (options?.inline !== undefined && options.inline !== false) {
        const inlineOptions =
          options.inline === true ? undefined : options.inline
        middleware.push(inline(inlineOptions))
      }

      return autoUpdate(reference, floating, () => {
        computePosition(reference, floating, {
          placement: access(defaultedProps.placement),
          strategy: access(defaultedProps.strategy),
          middleware,
        }).then(({ placement, x, y, middlewareData }) => {
          const newFloatingState = {
            placement,
            x,
            y,
            arrowX: middlewareData.arrow?.x ?? null,
            arrowY: middlewareData.arrow?.y ?? null,
          }
          if (!floatingStatesMatch(floatingState(), newFloatingState)) {
            setFloatingState((state) => ({ ...state, ...newFloatingState }))
          }
        })
      })
    },
  )

  return floatingState
}

const floatingStatesMatch = (a: FloatingState, b: Partial<FloatingState>) => {
  return (
    (b.placement === undefined || a.placement === b.placement) &&
    (b.x === undefined || a.x === b.x) &&
    (b.y === undefined || a.y === b.y) &&
    (b.width === undefined || a.width === b.width) &&
    (b.height === undefined || a.height === b.height) &&
    (b.maxWidth === undefined || a.maxWidth === b.maxWidth) &&
    (b.maxHeight === undefined || a.maxHeight === b.maxHeight) &&
    (b.arrowX === undefined || a.arrowX === b.arrowX) &&
    (b.arrowY === undefined || a.arrowY === b.arrowY)
  )
}

export default createFloating
