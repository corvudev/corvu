import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { some, mergeRefs, dataIf } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { Show, children, createMemo, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { JSX, ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_OVERLAY_ELEMENT = 'div'

export type DialogOverlayProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** Whether the dialog overlay should be forced to render. Useful when using third-party animation libraries. */
    forceMount?: boolean
    /** The `id` of the dialog context to use. */
    contextId?: string
    /** @hidden */
    children?: JSX.Element
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
  }
>

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-dialog-overlay` - Present on every dialog overlay element.
 * @data `data-open` - Present when the dialog is open.
 * @data `data-closed` - Present when the dialog is closed.
 */
const DialogOverlay = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
>(
  props: DialogOverlayProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'forceMount',
    'contextId',
    'children',
    'ref',
    'style',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const resolvedChildren = children(() => localProps.children)

  return (
    <Show
      when={some(
        context().open,
        () => localProps.forceMount,
        context().overlayPresent,
      )}
    >
      <Polymorphic
        as={localProps.as ?? (DEFAULT_DIALOG_OVERLAY_ELEMENT as ValidComponent)}
        ref={mergeRefs(context().setOverlayRef, localProps.ref)}
        aria-hidden="true"
        data-open={dataIf(context().open())}
        data-closed={dataIf(!context().open())}
        data-corvu-dialog-overlay
        tabIndex="-1"
        style={{
          'pointer-events': 'auto',
          ...localProps.style,
        }}
        {...otherProps}
      >
        {resolvedChildren()}
      </Polymorphic>
    </Show>
  )
}

export default DialogOverlay
