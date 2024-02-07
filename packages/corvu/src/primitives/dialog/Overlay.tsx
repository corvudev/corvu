import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { dataIf, mergeRefs, some } from '@lib/utils'
import Dynamic, { type DynamicAttributes } from '@lib/components/Dynamic'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalDialogContext } from '@primitives/dialog/context'

export const DEFAULT_DIALOG_OVERLAY_ELEMENT = 'div'

export type DialogOverlayProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_OVERLAY_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * Whether the dialog overlay should be forced to render. Useful when using third-party animation libraries.
     * @defaultValue `false`
     */
    forceMount?: boolean
    /**
     * The `id` of the dialog context to use.
     */
    contextId?: string
    /** @hidden */
    children?: JSX.Element
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
    /** @hidden */
    'data-corvu-dialog-overlay'?: string | undefined
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
    'data-corvu-dialog-overlay',
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

  const keepAlive = createMemo((prev) => prev || show(), false)

  return (
    <Show when={keepAlive()}>
      {(() => {
        const memoizedChildren = createMemo(() => localProps.children)

        return (
          <Show when={show()}>
            <Dynamic
              as={
                localProps.as ??
                (DEFAULT_DIALOG_OVERLAY_ELEMENT as ValidComponent)
              }
              ref={mergeRefs(context().setOverlayRef, localProps.ref)}
              aria-hidden="true"
              data-open={dataIf(context().open())}
              data-closed={dataIf(!context().open())}
              data-corvu-dialog-overlay={
                localProps.hasOwnProperty('data-corvu-dialog-overlay')
                  ? localProps['data-corvu-dialog-overlay']
                  : ''
              }
              tabIndex="-1"
              style={{
                'pointer-events': 'auto',
                ...localProps.style,
              }}
              {...otherProps}
            >
              {memoizedChildren()}
            </Dynamic>
          </Show>
        )
      })()}
    </Show>
  )
}

export default DialogOverlay
