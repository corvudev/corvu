import { type Accessor, createContext, type Setter, useContext } from 'solid-js'
import { createKeyedContext, useKeyedContext } from '@lib/create/keyedContext'

export type DialogContextValue = {
  /** The `role` attribute of the dialog element. */
  role: Accessor<'dialog' | 'alertdialog'>
  /** Whether the dialog is open or not. */
  open: Accessor<boolean>
  /** Change the open state of the dialog. */
  setOpen: Setter<boolean>
  /** Whether the dialog should be rendered as a modal or not. */
  modal: Accessor<boolean>
  /** Whether the dialog should close when the user presses the `Escape` key. */
  closeOnEscapeKeyDown: Accessor<boolean>
  /** Whether the dialog should be closed if the user interacts outside the bounds of `<Dialog.Content />`. */
  closeOnOutsidePointerDown: Accessor<boolean>
  /** Whether pointer events outside of `<Dialog.Content />` should be disabled. */
  noOutsidePointerEvents: Accessor<boolean>
  /** Whether the dialog should prevent scrolling on the `<body>` element. */
  preventScroll: Accessor<boolean>
  /** Whether padding should be added to the body element to avoid shifting because of the scrollbar disappearing. */
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
  /** The ref of the dialog content. */
  contentRef: Accessor<HTMLElement | null>
  /** Whether the dialog overlay is present. This differes from `open` as it tracks pending animations. */
  overlayPresent: Accessor<boolean>
  /** The ref of the dialog overlay. */
  overlayRef: Accessor<HTMLElement | null>
  /** The `id` attribute of the dialog element. */
  dialogId: Accessor<string>
  /** The `id` attribute of the dialog label element. Is undefined if no `Dialog.Label` is present. */
  labelId: Accessor<string | undefined>
  /** The `id` attribute of the dialog description element. Is undefined if no `Dialog.Description` is present. */
  descriptionId: Accessor<string | undefined>
}

const DialogContext = createContext<DialogContextValue>()

export const createDialogContext = (contextId?: string) => {
  if (!contextId) return DialogContext

  const context = createKeyedContext<DialogContextValue>(contextId)
  return context
}

/** Context which exposes various properties to interact with the dialog. Optionally provide a contextId to access a keyed context. */
export const useDialogContext = (contextId?: string) => {
  if (!contextId) {
    const context = useContext(DialogContext)
    if (!context) {
      throw new Error(
        '[corvu]: Dialog context not found. Make sure to wrap Dialog components in <Dialog.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<DialogContextValue>(contextId)
  if (!context) {
    throw new Error(
      `[corvu]: Dialog context with id "${contextId}" not found. Make sure to wrap Dialog components in <Dialog.Root contextId="${contextId}">`,
    )
  }
  return context
}

export type InternalDialogContextValue = DialogContextValue & {
  setContentRef(element: HTMLElement): void
  setOverlayRef(element: HTMLElement): void
  onEscapeKeyDown?(event: KeyboardEvent): void
  onOutsidePointerDown?(event: MouseEvent): void
  registerLabelId(): void
  unregisterLabelId(): void
  registerDescriptionId(): void
  unregisterDescriptionId(): void
}

const InternalDialogContext = createContext<InternalDialogContextValue>()

export const createInternalDialogContext = (contextId?: string) => {
  if (!contextId) return InternalDialogContext

  const context = createKeyedContext<InternalDialogContextValue>(
    `internal-${contextId}`,
  )
  return context
}

export const useInternalDialogContext = (contextId?: string) => {
  if (!contextId) {
    const context = useContext(InternalDialogContext)
    if (!context) {
      throw new Error(
        '[corvu]: Dialog context not found. Make sure to wrap Dialog components in <Dialog.Root>',
      )
    }
    return context
  }

  const context = useKeyedContext<InternalDialogContextValue>(
    `internal-${contextId}`,
  )
  if (!context) {
    throw new Error(
      `[corvu]: Dialog context with id "${contextId}" not found. Make sure to wrap Dialog components in <Dialog.Root contextId="${contextId}">`,
    )
  }
  return context
}
