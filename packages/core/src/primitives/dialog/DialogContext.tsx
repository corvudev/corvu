import { createContext, useContext } from 'solid-js'
import type { Accessor, Setter } from 'solid-js'

export type DialogContextValue = {
  /** The `role` attribute of the dialog element. */
  role: Accessor<'dialog' | 'alertdialog'>
  /** Whether the dialog is open or not. */
  open: Accessor<boolean>
  /** Change the open state of the dialog */
  setOpen: Setter<boolean>
  /** Whether the dialog should be rendered as a modal or not. */
  modal: Accessor<boolean>
  /** Whether the dialog should close when the user presses the `Escape` key. */
  closeOnEscapeKeyDown: Accessor<boolean>
  /** Whether the dialog should be closed if the user interacts outside the bounds of `<Dialog.Content />` */
  closeOnOutsidePointerDown: Accessor<boolean>
  /** Whether pointer events outside of `<Dialog.Content />` should be disabled. */
  noOutsidePointerEvents: Accessor<boolean>
  /** Whether the dialog should prevent scrolling on the `<body>` element. */
  preventScroll: Accessor<boolean>
  /** Whether padding should be added to the body element to avoid shifting because of the scrollbar disappearing */
  preventScrollbarShift: Accessor<boolean>
  /** Whether the dialog should trap focus or not. */
  trapFocus: Accessor<boolean>
  /** Whether the dialog should restore focus to the previous active element when it closes. */
  restoreFocus: Accessor<boolean>
  /** The element to receive focus when the dialog opens. */
  initialFocusEl?: Accessor<HTMLElement | undefined>
  /** The element to receive focus when the dialog closes. */
  finalFocusEl?: Accessor<HTMLElement | undefined>
  /** Whether the dialog content is present. This differes from `open` as it tracks pending animations. */
  contentPresent: Accessor<boolean>
  /** Whether the dialog overlay is present. This differes from `open` as it tracks pending animations. */
  overlayPresent: Accessor<boolean>
  /** The `id` attribute of the dialog element. */
  dialogId: Accessor<string>
  /** The `id` attribute of the dialog label element. */
  labelId: Accessor<string>
  /** The `id` attribute of the dialog description element. */
  descriptionId: Accessor<string>
}

type InternalContextValue = DialogContextValue & {
  contentRef: Accessor<HTMLElement | null>
  setContentRef(element: HTMLElement): void
  setOverlayRef(element: HTMLElement): void
  onEscapeKeyDown?(event: KeyboardEvent): void
  onOutsidePointerDown?(event: MouseEvent): void
}

export const InternalDialogContext = createContext<InternalContextValue>()

export const useInternalDialogContext = () => {
  const context = useContext(InternalDialogContext)
  if (!context) {
    throw new Error(
      '[@corvu/core]: Dialog context not found. Make sure to wrap Dialog components in <Dialog.Root>',
    )
  }
  return context
}

export const DialogContext = createContext<DialogContextValue>()

/** Context which exposes various properties to interact with the dialog. */
export const useDialogContext = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error(
      '[@corvu/core]: Dialog context not found. Make sure to wrap Dialog components in <Dialog.Root>',
    )
  }
  return context
}
