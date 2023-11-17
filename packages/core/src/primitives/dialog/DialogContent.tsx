import Dismissible from '@lib/components/Dismissible'
import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import createDisableScroll from '@lib/create/disableScroll'
import { mergeRefs, some, dataIf } from '@lib/utils'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
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
    /** @hidden */
    ref?: (element: HTMLElement) => void
    /** @hidden */
    onPointerDown?: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent>
    /** @hidden */
    style?: JSX.CSSProperties
  }
>

/** Component which can be used to create a faded background. Can be animated.
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
  const {
    role,
    open,
    setOpen,
    modal,
    closeOnEscapeKeyDown,
    onEscapeKeyDown,
    closeOnOutsidePointerDown,
    noOutsidePointerEvents,
    onOutsidePointerDown,
    preventScroll,
    preventScrollbarShift,
    contentPresent,
    dialogId,
    labelId,
    descriptionId,
    contentRef,
    setContentRef,
  } = useInternalDialogContext()

  const [localProps, otherProps] = splitProps(props, [
    'as',
    'ref',
    'onPointerDown',
    'forceMount',
    'style',
  ])

  createDisableScroll({
    isDisabled: () => !contentPresent() || !preventScroll(),
    disablePreventScrollbarShift: () => !preventScrollbarShift(),
  })

  return (
    <Show when={some(open, () => localProps.forceMount, contentPresent)}>
      <Dismissible
        element={contentRef}
        onDismiss={() => setOpen(false)}
        disableDismissOnEscapeKeyDown={() => !closeOnEscapeKeyDown()}
        disableDismissOnOutsidePointerDown={() => !closeOnOutsidePointerDown()}
        disableNoOutsidePointerEvents={() => !noOutsidePointerEvents()}
        onEscapeKeyDown={onEscapeKeyDown}
        onOutsidePointerDown={onOutsidePointerDown}
      >
        {(props) => (
          <Polymorphic
            ref={mergeRefs(setContentRef, localProps.ref)}
            as={
              localProps.as ??
              (DEFAULT_DIALOG_CONTENT_ELEMENT as ValidComponent)
            }
            role={role()}
            id={dialogId()}
            aria-labelledby={labelId()}
            aria-describedby={descriptionId()}
            aria-modal={modal() ? 'true' : 'false'}
            data-open={dataIf(open())}
            data-closed={dataIf(!open())}
            data-corvu-dialog-content
            tabIndex="-1"
            style={
              props.isLastLayer
                ? {
                    'pointer-events': 'auto',
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
