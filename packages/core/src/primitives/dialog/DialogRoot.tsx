import { isFunction } from '@lib/assertions'
import createControllableSignal from '@lib/create/controllableSignal'
import createFocusTrap from '@lib/create/focusTrap'
import createOnce from '@lib/create/once'
import createPresence from '@lib/create/presence'
import { access } from '@lib/utils'
import {
  createDialogContext,
  createInternalDialogContext,
} from '@primitives/dialog/DialogContext'
import {
  mergeProps,
  createUniqueId,
  createSignal,
  untrack,
  createMemo,
} from 'solid-js'
import type { Component, JSX, Setter } from 'solid-js'

export type DialogRootProps = {
  /** The `role` attribute of the dialog element.
   * @defaultValue 'dialog'
   */
  role?: 'dialog' | 'alertdialog'
  /** Whether the dialog is open or not
   * @defaultValue `false`
   */
  open?: boolean
  /** Callback fired when the open state changes. */
  onOpenChange?: Setter<boolean>
  /** Whether the dialog is open initially or not.
   * @defaultValue `false`
   */
  initialOpen?: boolean
  /** Whether the dialog should be rendered as a modal or not.
   * @defaultValue `true`
   */
  modal?: boolean
  /** Whether the dialog should close when the user presses the `Escape` key.
   * @defaultValue `true`
   */
  closeOnEscapeKeyDown?: boolean
  /** Callback fired when the user presses the `Escape` key. Can be prevented by calling `event.preventDefault`. */
  onEscapeKeyDown?(event: KeyboardEvent): void
  /** Whether the dialog should be closed if the user interacts outside the bounds of `<Dialog.Content />`
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  closeOnOutsidePointerDown?: boolean
  /** Callback fired when the user interacts outside the bounds of `<Dialog.Content />`. Can be prevented by calling `event.preventDefault`. */
  onOutsidePointerDown?(event: MouseEvent): void
  /** Whether pointer events outside of `<Dialog.Content />` should be disabled.
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  noOutsidePointerEvents?: boolean
  /** Whether the dialog should prevent scrolling on the `<body>` element.
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  preventScroll?: boolean
  /** Whether padding should be added to the body element to avoid shifting because of the scrollbar disappearing
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  preventScrollbarShift?: boolean
  /** Whether the dialog should trap focus or not.
   * @defaultValue `true`
   */
  trapFocus?: boolean
  /** Whether the dialog should restore focus to the previous active element when it closes.
   * @defaultValue `true`
   */
  restoreFocus?: boolean
  /** The element to receive focus when the dialog opens. */
  initialFocusEl?: HTMLElement
  /** Callback fired when focus moves into the dialog. Can be prevented by calling `event.preventDefault`. */
  onInitialFocus?(event: Event): void
  /** The element to receive focus when the dialog closes. */
  finalFocusEl?: HTMLElement
  /** Callback fired when focus moves out of the dialog. Can be prevented by calling `event.preventDefault`. */
  onFinalFocus?(event: Event): void
  /** The `id` attribute of the dialog element.
   * @defaultValue A `unique` id.
   */
  dialogId?: string
  /** The `id` attribute of the dialog label element.
   * @defaultValue A `unique` id.
   */
  labelId?: string
  /** The `id` attribute of the dialog description element.
   * @defaultValue A `unique` id.
   */
  descriptionId?: string
  /** The `id` of the dialog context. Useful if you have nested dialogs and want to create components that belong to a dialog higher up in the tree. */
  contextId?: string
  children: JSX.Element | ((props: DialogRootChildrenProps) => JSX.Element)
}

/** Props which are passed to the Root component children function. */
export type DialogRootChildrenProps = {
  /** The `role` attribute of the dialog element. */
  role: 'dialog' | 'alertdialog'
  /** Whether the dialog is open or not. */
  open: boolean
  /** Change the open state of the dialog */
  setOpen: Setter<boolean>
  /** Whether the dialog should be rendered as a modal or not. */
  modal: boolean
  /** Whether the dialog should close when the user presses the `Escape` key. */
  closeOnEscapeKeyDown: boolean
  /** Whether the dialog should be closed if the user interacts outside the bounds of the dialog content. */
  closeOnOutsidePointerDown: boolean
  /** Whether pointer events outside of `<Dialog.Content />` should be disabled. */
  noOutsidePointerEvents: boolean
  /** Whether the dialog should prevent scrolling on the `<body>` element. */
  preventScroll: boolean
  /** Whether padding should be added to the body element to avoid shifting because of the scrollbar disappearing */
  preventScrollbarShift: boolean
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
  /** The `id` attribute of the dialog description element. */
  dialogId: string
  /** The `id` attribute of the dialog label element. */
  labelId: string
  /** The `id` attribute of the dialog description element. */
  descriptionId: string
}

const DEFAULT_MODAL = true

/** Context wrapper for the dialog. Is required for every dialog you create. */
const DialogRoot: Component<DialogRootProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      role: 'dialog' as const,
      initialOpen: false,
      modal: true,
      closeOnEscapeKeyDown: true,
      closeOnOutsidePointerDown: () =>
        props.modal ?? DEFAULT_MODAL ? true : false,
      noOutsidePointerEvents: () =>
        props.modal ?? DEFAULT_MODAL ? true : false,
      preventScroll: () => (props.modal ?? DEFAULT_MODAL ? true : false),
      preventScrollbarShift: () =>
        props.modal ?? DEFAULT_MODAL ? true : false,
      trapFocus: true,
      restoreFocus: true,
      dialogId: createUniqueId(),
      labelId: createUniqueId(),
      descriptionId: createUniqueId(),
    },
    props,
  )

  const [open, setOpen] = createControllableSignal({
    value: () => defaultedProps.open,
    defaultValue: defaultedProps.initialOpen,
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

  createFocusTrap({
    element: contentRef,
    enabled: () => open() && defaultedProps.trapFocus,
    initialFocusElement: () => defaultedProps.initialFocusEl ?? null,
    restoreFocus: () => defaultedProps.restoreFocus,
    finalFocusElement: () => defaultedProps.finalFocusEl ?? null,
    onFinalFocus: defaultedProps.onFinalFocus,
    onInitialFocus: defaultedProps.onInitialFocus,
  })

  const childrenProps: DialogRootChildrenProps = {
    get role() {
      return defaultedProps.role
    },
    get open() {
      return open()
    },
    setOpen,
    get modal() {
      return defaultedProps.modal
    },
    get closeOnEscapeKeyDown() {
      return defaultedProps.closeOnEscapeKeyDown
    },
    get closeOnOutsidePointerDown() {
      return access(defaultedProps.closeOnOutsidePointerDown)
    },
    get noOutsidePointerEvents() {
      return access(defaultedProps.noOutsidePointerEvents)
    },
    get preventScroll() {
      return access(defaultedProps.preventScroll)
    },
    get preventScrollbarShift() {
      return access(defaultedProps.preventScrollbarShift)
    },
    get trapFocus() {
      return defaultedProps.trapFocus
    },
    get restoreFocus() {
      return defaultedProps.restoreFocus
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
    get dialogId() {
      return defaultedProps.dialogId
    },
    get labelId() {
      return defaultedProps.labelId
    },
    get descriptionId() {
      return defaultedProps.descriptionId
    },
  }

  const memoizedChildren = createOnce(() => defaultedProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children(childrenProps)
    }
    return children
  }

  const memoizedDialogRoot = createMemo(() => {
    const DialogContext = createDialogContext(defaultedProps.contextId)
    const InternalDialogContext = createInternalDialogContext(
      defaultedProps.contextId,
    )

    return untrack(() => (
      <DialogContext.Provider
        value={{
          role: () => defaultedProps.role,
          open,
          setOpen,
          modal: () => defaultedProps.modal,
          closeOnEscapeKeyDown: () => defaultedProps.closeOnEscapeKeyDown,
          closeOnOutsidePointerDown: () =>
            access(defaultedProps.closeOnOutsidePointerDown),
          noOutsidePointerEvents: () =>
            access(defaultedProps.noOutsidePointerEvents),
          preventScroll: () => access(defaultedProps.preventScroll),
          preventScrollbarShift: () =>
            access(defaultedProps.preventScrollbarShift),
          trapFocus: () => defaultedProps.trapFocus,
          restoreFocus: () => defaultedProps.restoreFocus,
          initialFocusEl: () => defaultedProps.initialFocusEl,
          finalFocusEl: () => defaultedProps.finalFocusEl,
          contentPresent,
          overlayPresent,
          dialogId: () => defaultedProps.dialogId,
          labelId: () => defaultedProps.labelId,
          descriptionId: () => defaultedProps.descriptionId,
        }}
      >
        <InternalDialogContext.Provider
          value={{
            role: () => defaultedProps.role,
            open,
            setOpen,
            modal: () => defaultedProps.modal,
            closeOnEscapeKeyDown: () => defaultedProps.closeOnEscapeKeyDown,
            // eslint-disable-next-line solid/reactivity
            onEscapeKeyDown: defaultedProps.onEscapeKeyDown,
            closeOnOutsidePointerDown: () =>
              access(defaultedProps.closeOnOutsidePointerDown),
            // eslint-disable-next-line solid/reactivity
            onOutsidePointerDown: defaultedProps.onOutsidePointerDown,
            noOutsidePointerEvents: () =>
              access(defaultedProps.noOutsidePointerEvents),
            preventScroll: () => access(defaultedProps.preventScroll),
            preventScrollbarShift: () =>
              access(defaultedProps.preventScrollbarShift),
            trapFocus: () => defaultedProps.trapFocus,
            restoreFocus: () => defaultedProps.restoreFocus,
            initialFocusEl: () => defaultedProps.initialFocusEl,
            finalFocusEl: () => defaultedProps.finalFocusEl,
            contentPresent,
            overlayPresent,
            dialogId: () => defaultedProps.dialogId,
            labelId: () => defaultedProps.labelId,
            descriptionId: () => defaultedProps.descriptionId,
            contentRef,
            setContentRef,
            setOverlayRef,
          }}
        >
          {untrack(() => resolveChildren())}
        </InternalDialogContext.Provider>
      </DialogContext.Provider>
    ))
  })

  return memoizedDialogRoot as unknown as JSX.Element
}

export default DialogRoot
