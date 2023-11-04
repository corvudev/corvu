import Dismissible from '@lib/components/Dismissible'
import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import createDisableScroll from '@lib/create/disableScroll'
import createFocusTrap from '@lib/create/focusTrap'
import { mergeRefs, some, dataIf } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { Show, splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { JSX, ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_CONTENT_ELEMENT = 'div' as ValidComponent

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
    onOpenChange,
    modal,
    closeOnEscape,
    closeOnOutsideInteract,
    preventScroll,
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
    isDisabled: () => !open() || !modal() || !preventScroll(),
  })

  createFocusTrap({
    element: contentRef,
    initialFocusElement: () => initialFocusEl?.() ?? null,
    isDisabled: () => !open() || !trapFocus(),
    restoreFocus,
    finalFocusElement: () => finalFocusEl?.() ?? null,
  })

  return (
    <Dismissible
      element={contentRef}
      onDismiss={() => onOpenChange(false)}
      disableDismissOnEscape={() => !open() || !closeOnEscape()}
      disableDismissOnOutsideInteract={() =>
        !open() || !closeOnOutsideInteract()
      }
    >
      {(props) => (
        <Show when={some(open, forceMount, contentPresent)}>
          <Polymorphic
            ref={mergeRefs(setContentRef, localProps.ref)}
            as={localProps.as ?? DEFAULT_DIALOG_CONTENT_ELEMENT}
            role={role()}
            id={dialogId}
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            aria-modal={modal() ? 'true' : 'false'}
            data-open={dataIf(open())}
            data-closed={dataIf(!open())}
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
        </Show>
      )}
    </Dismissible>
  )
}

export default DialogContent
