import {
  createMemo,
  type JSX,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { dataIf, mergeRefs, some } from '@lib/utils'
import Dynamic, { type DynamicAttributes } from '@lib/components/Dynamic'
import Dismissible from '@lib/components/Dismissible'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalDialogContext } from '@primitives/dialog/context'

export const DEFAULT_DIALOG_CONTENT_ELEMENT = 'div'

export type DialogContentProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_CONTENT_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * Whether the dialog content should be forced to render. Useful when using third-party animation libraries.
     * @defaultValue `false`
     */
    forceMount?: boolean
    /**
     * The `id` of the dialog context to use.
     */
    contextId?: string
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    style?: JSX.CSSProperties
    /** @hidden */
    'data-corvu-dialog-content'?: string | undefined
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
    'ref',
    'style',
    'data-corvu-dialog-content',
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

  return (
    <Dismissible
      element={context().contentRef}
      enabled={context().open() || context().contentPresent()}
      onDismiss={() => context().setOpen(false)}
      dismissOnEscapeKeyDown={context().closeOnEscapeKeyDown}
      dismissOnOutsidePointer={context().closeOnOutsidePointer}
      dismissOnOutsidePointerStrategy={context().closeOnOutsidePointerStrategy}
      dismissOnOutsidePointerIgnore={context().triggerRef}
      noOutsidePointerEvents={context().noOutsidePointerEvents}
      onEscapeKeyDown={context().onEscapeKeyDown}
      onOutsidePointer={context().onOutsidePointer}
    >
      {(props) => (
        <Show when={show()}>
          <Dynamic
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
            data-corvu-dialog-content={
              localProps.hasOwnProperty('data-corvu-dialog-content')
                ? localProps['data-corvu-dialog-content']
                : ''
            }
            tabIndex="-1"
            style={{
              'pointer-events': props.isLastLayer ? 'auto' : undefined,
              ...localProps.style,
            }}
            {...otherProps}
          />
        </Show>
      )}
    </Dismissible>
  )
}

export default DialogContent
