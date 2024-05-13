import { createMemo, splitProps, type ValidComponent } from 'solid-js'
import Dialog from '@corvu/dialog'
import type { ContentProps as DialogContentProps } from '@corvu/dialog'
import { getFloatingStyle } from '@corvu/utils/floating'
import { useInternalPopoverContext } from '@src/context'

const DEFAULT_POPOVER_CONTENT_ELEMENT = 'div'

/** Content of the popover. Can be animated.
 *
 * @data `data-corvu-popover-content` - Present on every popover content element.
 * @data `data-open` - Present when the popover is open.
 * @data `data-closed` - Present when the popover is closed.
 * @data `data-placement` - Current placement of the popover.
 */
const PopoverContent = <
  T extends ValidComponent = typeof DEFAULT_POPOVER_CONTENT_ELEMENT,
>(
  props: DialogContentProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'forceMount',
    'contextId',
    'style',
  ])

  const context = createMemo(() =>
    useInternalPopoverContext(localProps.contextId),
  )

  return (
    <Dialog.Content
      contextId={localProps.contextId}
      style={{
        ...getFloatingStyle({
          strategy: () => context().strategy(),
          floatingState: () => context().floatingState(),
        })(),
        ...localProps.style,
      }}
      data-placement={context().floatingState().placement}
      data-corvu-dialog-content={undefined}
      data-corvu-popover-content=""
      {...(otherProps as DialogContentProps<T>)}
    />
  )
}

export default PopoverContent
