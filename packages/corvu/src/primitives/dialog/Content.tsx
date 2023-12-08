import Dismissible from '@lib/components/Dismissible'
import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import createDisableScroll from '@lib/create/disableScroll'
import { mergeRefs, some, dataIf } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/Context'
import { Show, createMemo, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { JSX, ValidComponent } from 'solid-js'

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
    'ref',
    'style',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  createDisableScroll({
    enabled: () => context().contentPresent() && context().preventScroll(),
    disablePreventScrollbarShift: () => !context().preventScrollbarShift(),
  })

  return (
    <Show
      when={some(
        context().open,
        () => localProps.forceMount,
        context().contentPresent,
      )}
    >
      <Dismissible
        element={context().contentRef}
        onDismiss={() => context().setOpen(false)}
        disableDismissOnEscapeKeyDown={() => !context().closeOnEscapeKeyDown()}
        disableDismissOnOutsidePointerDown={() =>
          !context().closeOnOutsidePointerDown()
        }
        disableNoOutsidePointerEvents={() =>
          !context().noOutsidePointerEvents()
        }
        onEscapeKeyDown={context().onEscapeKeyDown}
        onOutsidePointerDown={context().onOutsidePointerDown}
      >
        {(props) => (
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
          />
        )}
      </Dismissible>
    </Show>
  )
}

export default DialogContent
