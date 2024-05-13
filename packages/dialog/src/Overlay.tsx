import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { mergeRefs, some } from '@corvu/utils/reactivity'
import { dataIf } from '@corvu/utils'
import type { Ref } from '@corvu/utils/dom'
import { useInternalDialogContext } from '@src/context'

export const DEFAULT_DIALOG_OVERLAY_ELEMENT = 'div'

export type DialogOverlayCorvuProps = {
  /**
   * Whether the dialog overlay should be forced to render. Useful when using third-party animation libraries.
   * @defaultValue `false`
   */
  forceMount?: boolean
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

export type DialogOverlaySharedElementProps = {
  ref: Ref
  style: JSX.CSSProperties
}

export type DialogOverlayElementProps = DialogOverlaySharedElementProps & {
  tabIndex: '-1'
  'aria-hidden': 'true' | undefined
  'data-closed': '' | undefined
  'data-open': '' | undefined
  'data-corvu-dialog-overlay': '' | null
}

export type DialogOverlayProps = DialogOverlayCorvuProps &
  Partial<DialogOverlaySharedElementProps>

/** Component which can be used to create a faded background. Can be animated.
 *
 * @data `data-corvu-dialog-overlay` - Present on every dialog overlay element.
 * @data `data-open` - Present when the dialog is open.
 * @data `data-closed` - Present when the dialog is closed.
 */
const DialogOverlay = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
>(
  props: DynamicProps<T, DialogOverlayProps, DialogOverlayElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DialogOverlayProps, [
    'forceMount',
    'contextId',
    'ref',
    'style',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  const show = () =>
    some(
      context().open,
      // eslint-disable-next-line solid/reactivity
      () => localProps.forceMount,
      context().overlayPresent,
    )

  return (
    <Show when={show()}>
      <Dynamic<DialogOverlayElementProps>
        as={DEFAULT_DIALOG_OVERLAY_ELEMENT}
        // === SharedElementProps ===
        ref={mergeRefs(context().setOverlayRef, localProps.ref)}
        style={{
          'pointer-events': 'auto',
          ...localProps.style,
        }}
        // === ElementProps ===
        tabIndex="-1"
        aria-hidden="true"
        data-closed={dataIf(!context().open())}
        data-open={dataIf(context().open())}
        data-corvu-dialog-overlay=""
        {...otherProps}
      />
    </Show>
  )
}

export default DialogOverlay
