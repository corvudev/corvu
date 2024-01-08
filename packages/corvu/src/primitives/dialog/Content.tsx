import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { dataIf, mergeRefs, some } from '@lib/utils'
import Polymorphic, {
  type PolymorphicAttributes,
} from '@lib/components/Polymorphic'
import createDisableScroll from '@lib/create/disableScroll'
import Dismissible from '@lib/components/Dismissible'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalDialogContext } from '@primitives/dialog/Context'

const DEFAULT_DIALOG_CONTENT_ELEMENT = 'div'

export type DialogContentProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_CONTENT_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** Whether the dialog content should be forced to render. Useful when using third-party animation libraries. */
    forceMount?: boolean
    /** The `id` of the dialog context to use. */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
  }
>

/** Content of the dialog. Can be animated.
 *
 * @data `data-corvu-dialog-content` - Present on every dialog content element.
 * @data `data-open` - Present when the dialog is open.
 * @data `data-closed` - Present when the dialog is closed.
 */
const DialogContent = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_CONTENT_ELEMENT,
>(
  props: DialogContentProps<T>,
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

  const show = () =>
    some(
      context().open,
      // eslint-disable-next-line solid/reactivity
      () => localProps.forceMount,
      context().contentPresent,
    )

  const keepAlive = createMemo((prev) => prev || show(), false)

  createDisableScroll({
    element: context().contentRef,
    enabled: () => context().contentPresent() && context().disableScroll(),
    hideScrollbar: context().hideScrollbar,
    preventScrollbarShift: context().preventScrollbarShift,
    preventScrollbarShiftMode: context().preventScrollbarShiftMode,
  })

  return (
    <Show when={keepAlive()}>
      <Dismissible
        element={context().contentRef}
        enabled={context().open() || context().contentPresent()}
        onDismiss={() => context().setOpen(false)}
        dismissOnEscapeKeyDown={context().closeOnEscapeKeyDown}
        dismissOnOutsidePointerDown={context().closeOnOutsidePointerDown}
        noOutsidePointerEvents={context().noOutsidePointerEvents}
        onEscapeKeyDown={context().onEscapeKeyDown}
        onOutsidePointerDown={context().onOutsidePointerDown}
      >
        {(props) => {
          const memoizedChildren = createMemo(() => localProps.children)

          return (
            <Show when={show()}>
              <Polymorphic
                ref={mergeRefs(context().setContentRef, localProps.ref)}
                as={
                  localProps.as ??
                  (DEFAULT_DIALOG_CONTENT_ELEMENT as ValidComponent)
                }
                role={context().role()}
                id={context().dialogId()}
                aria-labelledby={context().labelId()}
                aria-describedby={context().descriptionId()}
                aria-modal={context().modal() ? 'true' : 'false'}
                data-open={dataIf(context().open())}
                data-closed={dataIf(!context().open())}
                data-corvu-dialog-content=""
                tabIndex="-1"
                style={
                  props.isLastLayer
                    ? {
                        'pointer-events': 'auto',
                        'user-select': 'text',
                        ...localProps.style,
                      }
                    : localProps.style
                }
                {...otherProps}
              >
                {memoizedChildren()}
              </Polymorphic>
            </Show>
          )
        }}
      </Dismissible>
    </Show>
  )
}

export default DialogContent
