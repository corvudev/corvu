import {
  type Component,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  type Setter,
  untrack,
} from 'solid-js'
import { createDialogContext, createInternalDialogContext } from '@src/context'
import { access } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import createFocusTrap from 'solid-focus-trap'
import createOnce from '@corvu/utils/create/once'
import createPresence from 'solid-presence'
import createPreventScroll from 'solid-prevent-scroll'
import createRegister from '@corvu/utils/create/register'
import { isFunction } from '@corvu/utils'

export type DialogRootProps = {
  /**
   * The `role` attribute of the dialog element.
   * @defaultValue `'dialog'`
   */
  role?: 'dialog' | 'alertdialog'
  /**
   * Whether the dialog is open.
   */
  open?: boolean
  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Whether the dialog is open initially.
   * @defaultValue `false`
   */
  initialOpen?: boolean
  /**
   * Whether the dialog should be rendered as a modal.
   * @defaultValue `true`
   */
  modal?: boolean
  /**
   * Whether the dialog should close when the user presses the `Escape` key.
   * @defaultValue `true`
   */
  closeOnEscapeKeyDown?: boolean
  /**
   * Callback fired when the user presses the `Escape` key. Can be prevented by calling `event.preventDefault`.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /**
   * Whether the dialog should be closed if a focus event happens outside the bounds of `<Dialog.Content />`.
   * @defaultValue `true` if `trapFocus` is `true`, `false` otherwise
   */
  closeOnOutsideFocus?: boolean
  /**
   * Whether the dialog should be closed if the user interacts outside the bounds of `<Dialog.Content />`.
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  closeOnOutsidePointer?: boolean
  /**
   * Whether `closeOnOutsidePointer` should be triggered on `pointerdown` or `pointerup`.
   * @defaultValue `'pointerup'`
   */
  closeOnOutsidePointerStrategy?: 'pointerdown' | 'pointerup'
  /**
   * Callback fired when a focus event happens outside the bounds of `<Dialog.Content />`. Can only happen if `trapFocus` is set to `false` and can be prevented by calling `event.preventDefault`.
   */
  onOutsideFocus?: (event: CustomEvent) => void
  /**
   * Callback fired when the user interacts outside the bounds of `<Dialog.Content />`. Can be prevented by calling `event.preventDefault`.
   */
  onOutsidePointer?: (event: PointerEvent) => void
  /**
   * Whether pointer events outside of `<Dialog.Content />` should be disabled.
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  noOutsidePointerEvents?: boolean
  /**
   * Whether scroll outside of the dialog should be prevented.
   * @defaultValue `true` if `modal` is `true`, `false` otherwise
   */
  preventScroll?: boolean
  /**
   * Whether the scrollbar of the `<body>` element should be hidden. Only applies if `preventScroll` is `true`.
   * @defaultValue `true`
   */
  hideScrollbar?: boolean
  /**
   * Whether padding should be added to the `<body>` element to avoid layout shift.
   * @defaultValue `true`
   */
  preventScrollbarShift?: boolean
  /**
   * Whether padding or margin should be used to avoid layout shift.
   * @defaultValue `'padding'`
   */
  preventScrollbarShiftMode?: 'padding' | 'margin'
  /**
   * Whether to restore the `<body>` scroll position with `window.scrollTo` to avoid possible layout shift after closing the dialog.
   * @defaultValue `true`
   */
  restoreScrollPosition?: boolean
  /**
   * Whether the dialog should allow pinch zoom while scroll is disabled.
   * @defaultValue `true`
   */
  allowPinchZoom?: boolean
  /**
   * Whether the dialog should trap focus.
   * @defaultValue `true`
   */
  trapFocus?: boolean
  /**
   * Whether the dialog should restore focus to the previous active element when it closes.
   * @defaultValue `true`
   */
  restoreFocus?: boolean
  /**
   * The element to receive focus when the dialog opens.
   */
  initialFocusEl?: HTMLElement
  /**
   * Callback fired when focus moves into the dialog. Can be prevented by calling `event.preventDefault`.
   */
  onInitialFocus?: (event: Event) => void
  /**
   * The element to receive focus when the dialog closes.
   */
  finalFocusEl?: HTMLElement
  /**
   * Callback fired when focus moves out of the dialog. Can be prevented by calling `event.preventDefault`.
   */
  onFinalFocus?: (event: Event) => void
  /**
   * Callback fired when the dialog content present state changes.
   */
  onContentPresentChange?: (present: boolean) => void
  /**
   * Callback fired when the dialog overlay present state changes.
   */
  onOverlayPresentChange?: (present: boolean) => void
  /**
   * The `id` attribute of the dialog element.
   * @defaultValue `createUniqueId()`
   */
  dialogId?: string
  /**
   * The `id` attribute of the dialog label element.
   * @defaultValue `createUniqueId()`
   */
  labelId?: string
  /**
   * The `id` attribute of the dialog description element.
   * @defaultValue `createUniqueId()`
   */
  descriptionId?: string
  /**
   * The `id` of the dialog context. Useful if you have nested dialogs and want to create components that belong to a dialog higher up in the tree.
   */
  contextId?: string
  /** @hidden */
  children: JSX.Element | ((props: DialogRootChildrenProps) => JSX.Element)
}

/** Props that are passed to the Root component children callback. */
export type DialogRootChildrenProps = {
  /** The `role` attribute of the dialog element. */
  role: 'dialog' | 'alertdialog'
  /** Whether the dialog is open. */
  open: boolean
  /** Change the open state of the dialog. */
  setOpen: Setter<boolean>
  /** Whether the dialog should be rendered as a modal. */
  modal: boolean
  /** Whether the dialog should close when the user presses the `Escape` key. */
  closeOnEscapeKeyDown: boolean
  /** Whether the dialog should be closed if a focus event happens outside the bounds of `<Dialog.Content />`. */
  closeOnOutsideFocus: boolean
  /** Whether the dialog should be closed if the user interacts outside the bounds of the dialog content. */
  closeOnOutsidePointer: boolean
  /** Whether `closeOnOutsidePointer` should be triggered on `pointerdown` or `pointerup`. */
  closeOnOutsidePointerStrategy: 'pointerdown' | 'pointerup'
  /** Whether pointer events outside of `<Dialog.Content />` should be disabled. */
  noOutsidePointerEvents: boolean
  /** Whether scroll outside of the dialog should be prevented. */
  preventScroll: boolean
  /** Whether the scrollbar of the `<body>` element should be hidden. */
  hideScrollbar: boolean
  /** Whether padding should be added to the `<body>` element to avoid layout shift. */
  preventScrollbarShift: boolean
  /** Whether padding or margin should be used to avoid layout shift. */
  preventScrollbarShiftMode: 'padding' | 'margin'
  /** Whether to restore the `<body>` scroll position with `window.scrollTo` to avoid possible layout shift after closing the dialog. */
  restoreScrollPosition: boolean
  /** Whether the dialog should allow pinch zoom while scroll is disabled. */
  allowPinchZoom: boolean
  /** Whether the dialog should trap focus. */
  trapFocus: boolean
  /** Whether the dialog should restore focus to the previous active element when it closes. */
  restoreFocus: boolean
  /** The element to receive focus when the dialog opens. */
  initialFocusEl?: HTMLElement
  /** The element to receive focus when the dialog closes. */
  finalFocusEl?: HTMLElement
  /** Whether the dialog content is present. This differes from `open` as it tracks pending animations. */
  contentPresent: boolean
  /** The ref of the dialog content. */
  contentRef: HTMLElement | null
  /** Whether the dialog overlay is present. This differes from `open` as it tracks pending animations. */
  overlayPresent: boolean
  /** The ref of the dialog overlay. */
  overlayRef: HTMLElement | null
  /** The `id` attribute of the dialog description element. */
  dialogId: string
  /** The `id` attribute of the dialog label element. Is undefined if no `Dialog.Label` is present. */
  labelId: string | undefined
  /** The `id` attribute of the dialog description element. Is undefined if no `Dialog.Description` is present. */
  descriptionId: string | undefined
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
      closeOnOutsideFocus: () => props.trapFocus ?? true,
      closeOnOutsidePointer: () => props.modal ?? DEFAULT_MODAL,
      closeOnOutsidePointerStrategy: 'pointerup' as const,
      noOutsidePointerEvents: () => props.modal ?? DEFAULT_MODAL,
      preventScroll: () => props.modal ?? DEFAULT_MODAL,
      hideScrollbar: true,
      preventScrollbarShift: true,
      preventScrollbarShiftMode: 'padding' as const,
      restoreScrollPosition: true,
      allowPinchZoom: true,
      trapFocus: true,
      restoreFocus: true,
      dialogId: createUniqueId(),
    },
    props,
  )

  const [open, setOpen] = createControllableSignal({
    value: () => defaultedProps.open,
    initialValue: defaultedProps.initialOpen,
    onChange: defaultedProps.onOpenChange,
  })

  const [labelId, registerLabelId, unregisterLabelId] = createRegister({
    value: () => defaultedProps.labelId ?? createUniqueId(),
  })
  const [descriptionId, registerDescriptionId, unregisterDescriptionId] =
    createRegister({
      value: () => defaultedProps.descriptionId ?? createUniqueId(),
    })

  const [triggerRef, setTriggerRef] = createSignal<HTMLElement | null>(null)
  const [contentRef, setContentRef] = createSignal<HTMLElement | null>(null)
  const [overlayRef, setOverlayRef] = createSignal<HTMLElement | null>(null)

  const { present: contentPresent } = createPresence({
    show: open,
    element: contentRef,
    onStateChange: (state) => {
      if (state === 'present') {
        defaultedProps.onContentPresentChange?.(true)
      } else if (state === 'hidden') {
        defaultedProps.onContentPresentChange?.(false)
      }
    },
  })
  const { present: overlayPresent } = createPresence({
    show: open,
    element: overlayRef,
    onStateChange: (state) => {
      if (state === 'present') {
        defaultedProps.onOverlayPresentChange?.(true)
      } else if (state === 'hidden') {
        defaultedProps.onOverlayPresentChange?.(false)
      }
    },
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

  createPreventScroll({
    element: contentRef,
    enabled: () => contentPresent() && access(defaultedProps.preventScroll),
    hideScrollbar: () => defaultedProps.hideScrollbar,
    preventScrollbarShift: () => defaultedProps.preventScrollbarShift,
    preventScrollbarShiftMode: () => defaultedProps.preventScrollbarShiftMode,
    restoreScrollPosition: () => defaultedProps.restoreScrollPosition,
    allowPinchZoom: () => defaultedProps.allowPinchZoom,
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
    get closeOnOutsideFocus() {
      return access(defaultedProps.closeOnOutsideFocus)
    },
    get closeOnOutsidePointer() {
      return access(defaultedProps.closeOnOutsidePointer)
    },
    get closeOnOutsidePointerStrategy() {
      return defaultedProps.closeOnOutsidePointerStrategy
    },
    get noOutsidePointerEvents() {
      return access(defaultedProps.noOutsidePointerEvents)
    },
    get preventScroll() {
      return access(defaultedProps.preventScroll)
    },
    get hideScrollbar() {
      return defaultedProps.hideScrollbar
    },
    get preventScrollbarShift() {
      return access(defaultedProps.preventScrollbarShift)
    },
    get preventScrollbarShiftMode() {
      return defaultedProps.preventScrollbarShiftMode
    },
    get restoreScrollPosition() {
      return defaultedProps.restoreScrollPosition
    },
    get allowPinchZoom() {
      return defaultedProps.allowPinchZoom
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
    get contentRef() {
      return contentRef()
    },
    get overlayPresent() {
      return overlayPresent()
    },
    get overlayRef() {
      return overlayRef()
    },
    get dialogId() {
      return defaultedProps.dialogId
    },
    get labelId() {
      return labelId()
    },
    get descriptionId() {
      return descriptionId()
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

    return (
      <DialogContext.Provider
        value={{
          role: () => defaultedProps.role,
          open,
          setOpen,
          modal: () => defaultedProps.modal,
          closeOnEscapeKeyDown: () => defaultedProps.closeOnEscapeKeyDown,
          closeOnOutsideFocus: () => access(defaultedProps.closeOnOutsideFocus),
          closeOnOutsidePointer: () =>
            access(defaultedProps.closeOnOutsidePointer),
          closeOnOutsidePointerStrategy: () =>
            defaultedProps.closeOnOutsidePointerStrategy,
          noOutsidePointerEvents: () =>
            access(defaultedProps.noOutsidePointerEvents),
          preventScroll: () => access(defaultedProps.preventScroll),
          hideScrollbar: () => defaultedProps.hideScrollbar,
          preventScrollbarShift: () =>
            access(defaultedProps.preventScrollbarShift),
          preventScrollbarShiftMode: () =>
            defaultedProps.preventScrollbarShiftMode,
          restoreScrollPosition: () => defaultedProps.restoreScrollPosition,
          allowPinchZoom: () => defaultedProps.allowPinchZoom,
          trapFocus: () => defaultedProps.trapFocus,
          restoreFocus: () => defaultedProps.restoreFocus,
          initialFocusEl: () => defaultedProps.initialFocusEl,
          finalFocusEl: () => defaultedProps.finalFocusEl,
          contentPresent,
          contentRef,
          overlayPresent,
          overlayRef,
          dialogId: () => defaultedProps.dialogId,
          labelId,
          descriptionId,
        }}
      >
        <InternalDialogContext.Provider
          value={{
            role: () => defaultedProps.role,
            open,
            setOpen,
            modal: () => defaultedProps.modal,
            closeOnEscapeKeyDown: () => defaultedProps.closeOnEscapeKeyDown,
            onEscapeKeyDown: defaultedProps.onEscapeKeyDown,
            closeOnOutsideFocus: () =>
              access(defaultedProps.closeOnOutsideFocus),
            closeOnOutsidePointer: () =>
              access(defaultedProps.closeOnOutsidePointer),
            closeOnOutsidePointerStrategy: () =>
              defaultedProps.closeOnOutsidePointerStrategy,
            onOutsideFocus: defaultedProps.onOutsideFocus,
            onOutsidePointer: defaultedProps.onOutsidePointer,
            noOutsidePointerEvents: () =>
              access(defaultedProps.noOutsidePointerEvents),
            preventScroll: () => access(defaultedProps.preventScroll),
            hideScrollbar: () => defaultedProps.hideScrollbar,
            preventScrollbarShift: () =>
              access(defaultedProps.preventScrollbarShift),
            preventScrollbarShiftMode: () =>
              defaultedProps.preventScrollbarShiftMode,
            restoreScrollPosition: () => defaultedProps.restoreScrollPosition,
            allowPinchZoom: () => defaultedProps.allowPinchZoom,
            trapFocus: () => defaultedProps.trapFocus,
            restoreFocus: () => defaultedProps.restoreFocus,
            initialFocusEl: () => defaultedProps.initialFocusEl,
            finalFocusEl: () => defaultedProps.finalFocusEl,
            contentPresent,
            contentRef,
            overlayPresent,
            overlayRef,
            dialogId: () => defaultedProps.dialogId,
            labelId,
            registerLabelId,
            unregisterLabelId,
            descriptionId,
            registerDescriptionId,
            unregisterDescriptionId,
            setContentRef,
            setOverlayRef,
            triggerRef,
            setTriggerRef,
          }}
        >
          {untrack(() => resolveChildren())}
        </InternalDialogContext.Provider>
      </DialogContext.Provider>
    )
  })

  return memoizedDialogRoot as unknown as JSX.Element
}

export default DialogRoot
