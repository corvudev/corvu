import Dismissible from '@lib/components/Dismissible'
import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import createDisableScroll from '@lib/create/disableScroll'
import createFocusTrap from '@lib/create/focusTrap'
import { mergeRefs, some, dataIf } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { JSX, ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_CONTENT_ELEMENT = 'div'

export type DialogContentProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_CONTENT_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    ref?: (element: HTMLElement) => void
    onPointerDown?: JSX.EventHandlerUnion<HTMLDivElement, PointerEvent>
    style?: JSX.CSSProperties
  }
>

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
    closeOnEscape,
    closeOnOutsideInteract,
    noPointerEvents,
    preventScroll,
    preventScrollbarShift,
    forceMount,
    trapFocus,
    restoreFocus,
    initialFocusEl,
    finalFocusEl,
    contentPresent,
    dialogId,
    labelId,
    descriptionId,
    contentRef,
    setContentRef,
  } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, [
    'as',
    'ref',
    'onPointerDown',
    'style',
  ])

  createDisableScroll({
    isDisabled: () => !contentPresent() || !preventScroll(),
    disablePreventScrollbarShift: () => !preventScrollbarShift(),
  })

  createFocusTrap({
    element: contentRef,
    initialFocusElement: () => initialFocusEl?.() ?? null,
    isDisabled: () => !open() || !trapFocus(),
    restoreFocus,
    finalFocusElement: () => finalFocusEl?.() ?? null,
  })

  return (
    <Show when={some(open, forceMount, contentPresent)}>
      <Dismissible
        element={contentRef}
        onDismiss={() => setOpen(false)}
        disableDismissOnEscape={() => !closeOnEscape()}
        disableDismissOnOutsideInteract={() => !closeOnOutsideInteract()}
        disableNoPointerEvents={() => !noPointerEvents()}
      >
        {(props) => (
          <Polymorphic
            ref={mergeRefs(setContentRef, localProps.ref)}
            as={
              localProps.as ??
              (DEFAULT_DIALOG_CONTENT_ELEMENT as ValidComponent)
            }
            role={role()}
            id={dialogId}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
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
