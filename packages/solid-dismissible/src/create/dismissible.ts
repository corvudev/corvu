import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createEscapeKeyDown from '@src/create/escapeKeyDown'
import createNoPointerEvents from '@src/create/noPointerEvents'
import createOutsideFocus from '@src/create/outsideFocus'
import createOutsidePointer from '@src/create/outsidePointer'
import { mergeProps } from 'solid-js'

export type CreateDismissibleProps = {
  /**
   * The element to make dismissible.
   */
  element: MaybeAccessor<HTMLElement | null>
  /**
   * Callback fired when the element is being dismissed.
   */
  onDismiss: (reason: 'escapeKey' | 'outsidePointer' | 'outsideFocus') => void
  /**
   * Whether to dismiss the element when the escape key is pressed.
   * @defaultValue `true`
   */
  dismissOnEscapeKeyDown?: MaybeAccessor<boolean>
  /**
   * Whether to dismiss the element when a focus event happens outside the element.
   * @defaultValue `true`
   */
  dismissOnOutsideFocus?: MaybeAccessor<boolean>
  /**
   * Whether to dismiss the element when a pointer down event happens outside the element.
   * @defaultValue `true`
   */
  dismissOnOutsidePointer?: MaybeAccessor<boolean>
  /**
   * Whether `dismissOnOutsidePointer` should be triggered on `pointerdown` or `pointerup`.
   * @defaultValue `pointerup`
   */
  outsidePointerStrategy?: MaybeAccessor<'pointerdown' | 'pointerup'>
  /**
   * Ignore pointer events that occur inside of this element.
   */
  outsidePointerIgnore?: MaybeAccessor<(HTMLElement | null)[]>
  /**
   * Whether to disable pointer events outside the element.
   * @defaultValue `true`
   */
  noOutsidePointerEvents?: MaybeAccessor<boolean>
  /**
   * Callback fired when the escape key is pressed. Can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /**
   * Callback fired when a focus event happens outside the element. Can be prevented by calling `event.preventDefault`.
   */
  onOutsideFocus?: (event: CustomEvent) => void
  /**
   * Callback fired when a pointer down event happens outside the element. Can be prevented by calling `event.preventDefault`.
   */
  onOutsidePointer?: (event: PointerEvent) => void
}

/**
 * Creates a dismissible element that can be dismissed by pressing the escape key or clicking/focusing outside of the element.
 *
 * @param props.element - The element to make dismissible.
 * @param props.onDismiss - Callback fired when the element is being dismissed.
 * @param props.dismissOnEscapeKeyDown - Whether to dismiss the element when the escape key is pressed. *Default = `true`*
 * @param props.dismissOnOutsideFocus - Whether to dismiss the element when a focus event happens outside the element. *Default = `true`*
 * @param props.dismissOnOutsidePointer - Whether to dismiss the element when a pointer down event happens outside the element. *Default = `true`*
 * @param props.outsidePointerStrategy - Whether `dismissOnOutsidePointer` should be triggered on `pointerdown` or `pointerup`. *Default = `pointerup`*
 * @param props.noOutsidePointerEvents - Whether to disable pointer events outside the element. *Default = `true`*
 * @param props.onEscapeKeyDown - Callback fired when the escape key is pressed. Can be prevented by calling `event.preventDefault`.
 * @param props.onOutsidePointer - Callback fired when a pointer down event happens outside the element. Can be prevented by calling `event.preventDefault`.
 */
const createDismissible = (props: CreateDismissibleProps) => {
  const defaultedProps = mergeProps(
    {
      dismissOnEscapeKeyDown: true,
      dismissOnOutsideFocus: true,
      dismissOnOutsidePointer: true,
      outsidePointerStrategy: 'pointerup' as const,
      noOutsidePointerEvents: true,
    },
    props,
  )

  createEscapeKeyDown({
    enabled: () => access(defaultedProps.dismissOnEscapeKeyDown),
    onEscapeKeyDown: (event) => {
      defaultedProps.onEscapeKeyDown?.(event)
      if (!event.defaultPrevented) {
        defaultedProps.onDismiss('escapeKey')
      }
    },
  })

  createOutsideFocus({
    enabled: () => access(defaultedProps.dismissOnOutsideFocus),
    onFocus: (event) => {
      defaultedProps.onOutsideFocus?.(event)
      if (!event.defaultPrevented) {
        defaultedProps.onDismiss('outsideFocus')
      }
    },
    element: () => access(defaultedProps.element),
    ignorePointerEvents: () =>
      access(defaultedProps.noOutsidePointerEvents) ||
      access(defaultedProps.dismissOnOutsidePointer),
  })

  createOutsidePointer({
    enabled: () => access(defaultedProps.dismissOnOutsidePointer),
    strategy: () => access(defaultedProps.outsidePointerStrategy),
    ignore: () => access(defaultedProps.outsidePointerIgnore) ?? [],
    onPointer: (event) => {
      defaultedProps.onOutsidePointer?.(event)
      if (!event.defaultPrevented) {
        const ctrlLeftClick = event.button === 0 && event.ctrlKey === true
        // Don't dismiss if event is a right-click
        const isRightClick = event.button === 2 || ctrlLeftClick

        if (isRightClick) return

        defaultedProps.onDismiss('outsidePointer')
      }
    },
    element: () => access(defaultedProps.element),
  })

  createNoPointerEvents({
    enabled: () => access(defaultedProps.noOutsidePointerEvents),
  })
}

export default createDismissible
