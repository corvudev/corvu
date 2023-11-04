import { isFunction } from '@lib/assertions'
import createControllableSignal from '@lib/create/controllableSignal'
import createOnce from '@lib/create/once'
import createPresence from '@lib/create/presence'
import { access } from '@lib/utils'
import { DialogContext } from '@primitives/dialog/DialogContext'
import { mergeProps, createUniqueId, createSignal, untrack } from 'solid-js'
import type { Component, JSX, Setter } from 'solid-js'

export type DialogRootProps = {
  /** The `role` attribute of the dialog element. */
  role?: 'dialog' | 'alertdialog'
  /** Whether the dialog is open or not. */
  open?: boolean
  /** Callback fired when the open state changes. */
  onOpenChange?: Setter<boolean>
  /** Whether the dialog is open initially or not. */
  initialOpen?: boolean
  /** Whether the dialog should be rendered as a modal or not. */
  modal?: boolean
  /** Whether the dialog should close when the user presses the `Escape` key. */
  closeOnEscape?: boolean
  /** Whether the dialog should close when the user interacts with the `<Dialog.Overlay />` component. */
  closeOnOutsideInteract?: boolean
  /** Whether the dialog should prevent scrolling on the `<body>` element. */
  preventScroll?: boolean
  /** Whether the dialog should be forced to render. Useful for custom transition and animations. */
  forceMount?: boolean
  /** Whether the dialog should trap focus or not. */
  trapFocus?: boolean
  /** Whether the dialog should restore focus to the previous active element when it closes. */
  restoreFocus?: boolean
  /** The element to receive focus when the dialog opens. */
  initialFocusEl?: HTMLElement
  /** The element to receive focus when the dialog closes. */
  finalFocusEl?: HTMLElement
  children: JSX.Element | ((context: DialogRootChildrenProps) => JSX.Element)
}

export type DialogRootChildrenProps = {
  /** The `role` attribute of the dialog element. */
  role: 'dialog' | 'alertdialog'
  /** Whether the dialog is open or not. */
  open: boolean
  /** Whether the dialog should be rendered as a modal or not. */
  modal: boolean
  /** Whether the dialog should close when the user presses the `Escape` key. */
  closeOnEscape: boolean
  /** Whether the dialog should close when the user interacts with the `<Dialog.Overlay />` component. */
  closeOnOutsideInteract: boolean
  /** Whether the dialog should prevent scrolling on the `<body>` element. */
  preventScroll: boolean
  /** Whether the dialog should be forced to render. Useful for custom transition and animations. */
  forceMount: boolean
  /** Whether the dialog should trap focus or not. */
  trapFocus: boolean
  /** Whether the dialog should restore focus to the previous active element when it closes. */
  restoreFocus: boolean
  /** The element to receive focus when the dialog opens. */
  initialFocusEl?: HTMLElement
  /** The element to receive focus when the dialog closes. */
  finalFocusEl?: HTMLElement
  /** Whether the dialog content is present. This differes from `open` as it tracks pending animations. */
  contentPresent: boolean
  /** Whether the dialog overlay is present. This differes from `open` as it tracks pending animations. */
  overlayPresent: boolean
  dialogId: string
  labelId: string
  descriptionId: string
}

const DEFAULT_MODAL = true

const DialogRoot: Component<DialogRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      role: 'dialog' as const,
      initialOpen: false,
      modal: true,
      closeOnEscape: () => (props.modal ?? DEFAULT_MODAL ? true : false),
      closeOnOutsideInteract: () =>
        props.modal ?? DEFAULT_MODAL ? true : false,
      preventScroll: () => (props.modal ?? DEFAULT_MODAL ? true : false),
      forceMount: false,
      trapFocus: () => (props.modal ?? DEFAULT_MODAL ? true : false),
      restoreFocus: () => (props.modal ?? DEFAULT_MODAL ? true : false),
    },
    props,
  )

  const [open, setOpen] = createControllableSignal({
    value: () => defaultedProps.open,
    defaultValue: () => defaultedProps.initialOpen,
    onChange: defaultedProps.onOpenChange,
  })

  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)
  const [overlayRef, setOverlayRef] = createSignal<HTMLElement | null>(null)

  const { present: contentPresent } = createPresence({
    present: open,
    element: contentRef,
  })
  const { present: overlayPresent } = createPresence({
    present: open,
    element: overlayRef,
  })

  const dialogId = createUniqueId()
  const labelId = createUniqueId()
  const descriptionId = createUniqueId()

  const childrenProps: DialogRootChildrenProps = {
    get role() {
      return defaultedProps.role
    },
    get open() {
      return open()
    },
    get modal() {
      return defaultedProps.modal
    },
    get closeOnEscape() {
      return access(defaultedProps.closeOnEscape)
    },
    get closeOnOutsideInteract() {
      return access(defaultedProps.closeOnOutsideInteract)
    },
    get preventScroll() {
      return access(defaultedProps.preventScroll)
    },
    get forceMount() {
      return defaultedProps.forceMount
    },
    get trapFocus() {
      return access(defaultedProps.trapFocus)
    },
    get restoreFocus() {
      return access(defaultedProps.restoreFocus)
    },
    get initialFocusEl() {
      return defaultedProps.initialFocusEl
    },
    get finalFocusEl() {
      return defaultedProps.finalFocusEl
    },
    get contentPresent() {
      return contentPresent()
    },
    get overlayPresent() {
      return overlayPresent()
    },
    dialogId,
    labelId,
    descriptionId,
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children(childrenProps)
    }
    return children
  }

  return (
    <DialogContext.Provider
      value={{
        role: () => defaultedProps.role,
        open,
        modal: () => defaultedProps.modal,
        closeOnEscape: () => access(defaultedProps.closeOnEscape),
        closeOnOutsideInteract: () =>
          access(defaultedProps.closeOnOutsideInteract),
        preventScroll: () => access(defaultedProps.preventScroll),
        forceMount: () => defaultedProps.forceMount,
        trapFocus: () => access(defaultedProps.trapFocus),
        restoreFocus: () => access(defaultedProps.restoreFocus),
        initialFocusEl: () => defaultedProps.initialFocusEl,
        finalFocusEl: () => defaultedProps.finalFocusEl,
        contentPresent,
        overlayPresent,
        dialogId,
        labelId,
        descriptionId,
        onOpenChange: setOpen,
        contentRef,
        setContentRef,
        setOverlayRef,
      }}
    >
      {untrack(() => resolveChildren())}
    </DialogContext.Provider>
  )
}

export default DialogRoot
