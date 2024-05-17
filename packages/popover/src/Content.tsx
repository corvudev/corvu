import {
  type Component,
  createMemo,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import type {
  ContentCorvuProps as DialogContentCorvuProps,
  ContentElementProps as DialogContentElementProps,
  ContentSharedElementProps as DialogContentSharedElementProps,
} from '@corvu/dialog'
import { combineStyle } from '@corvu/utils/dom'
import Dialog from '@corvu/dialog'
import type { DynamicProps } from '@corvu/utils/dynamic'
import { getFloatingStyle } from '@corvu/utils/floating'
import type { Placement } from '@floating-ui/dom'
import { useInternalPopoverContext } from '@src/context'

export type PopoverContentCorvuProps = DialogContentCorvuProps

export type PopoverContentSharedElementProps<T extends ValidComponent = 'div'> =
  DialogContentSharedElementProps<T>

export type PopoverContentElementProps = PopoverContentSharedElementProps & {
  'data-placement': Placement
  'data-corvu-popover-content': ''
} & DialogContentElementProps

export type PopoverContentProps<T extends ValidComponent = 'button'> =
  PopoverContentCorvuProps & Partial<PopoverContentSharedElementProps<T>>

/** Content of the popover. Can be animated.
 *
 * @data `data-corvu-popover-content` - Present on every popover content element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 * @data `data-placement` - Current placement of the popover.
 */
const PopoverContent = <T extends ValidComponent = 'div'>(
  props: DynamicProps<T, PopoverContentProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as PopoverContentProps, [
    'forceMount',
    'contextId',
    'style',
  ])

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <Dialog.Content<
      Component<
        Omit<PopoverContentElementProps, keyof DialogContentElementProps>
      >
    >
      contextId={localProps.contextId}
      // === SharedElementProps ===
      style={combineStyle(
        {
          ...getFloatingStyle({
            strategy: () => context().strategy(),
            floatingState: () => context().floatingState(),
          })(),
        },
        localProps.style,
      )}
      // === ElementProps ===
      data-placement={context().floatingState().placement}
      data-corvu-popover-content=""
      // === Misc ===
      data-corvu-dialog-content={null}
      {...otherProps}
    />
  )
}

export default PopoverContent
