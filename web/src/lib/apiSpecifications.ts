type TypeSpecification = {
  name: string
  forcedSorting?: string[]
}

export type ComponentSpecifications = 'Dialog' | 'Drawer'

export const componentSpecifications: {
  [key in ComponentSpecifications]: {
    exportName: string
    components: TypeSpecification[]
    contexts: TypeSpecification[]
    types: TypeSpecification[]
  }
} = {
  Dialog: {
    exportName: 'primitives/dialog',
    components: [
      {
        name: 'Root',
        forcedSorting: [
          'role',
          'open',
          'onOpenChange',
          'initialOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'onEscapeKeyDown',
          'closeOnOutsidePointerDown',
          'onOutsidePointerDown',
          'noOutsidePointerEvents',
          'preventScroll',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'onInitialFocus',
          'finalFocusEl',
          'onFinalFocus',
          'dialogId',
          'labelId',
          'descriptionId',
          'contextId',
          'children',
        ],
      },
      {
        name: 'Trigger',
      },
      {
        name: 'Portal',
        forcedSorting: ['forceMount', 'contextId'],
      },
      {
        name: 'Overlay',
        forcedSorting: ['as', 'asChild', 'forceMount', 'contextId'],
      },
      {
        name: 'Content',
        forcedSorting: ['as', 'asChild', 'forceMount', 'contextId'],
      },
      {
        name: 'Close',
      },
      {
        name: 'Label',
      },
      {
        name: 'Description',
      },
    ],
    contexts: [
      {
        name: 'useContext',
        forcedSorting: [
          'role',
          'open',
          'contentPresent',
          'overlayPresent',
          'setOpen',
          'initialOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'onEscapeKeyDown',
          'closeOnOutsidePointerDown',
          'onOutsidePointerDown',
          'noOutsidePointerEvents',
          'preventScroll',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'onInitialFocus',
          'finalFocusEl',
          'onFinalFocus',
          'dialogId',
          'labelId',
          'descriptionId',
        ],
      },
    ],
    types: [
      {
        name: 'RootChildrenProps',
        forcedSorting: [
          'role',
          'open',
          'contentPresent',
          'overlayPresent',
          'setOpen',
          'initialOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'onEscapeKeyDown',
          'closeOnOutsidePointerDown',
          'onOutsidePointerDown',
          'noOutsidePointerEvents',
          'preventScroll',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'onInitialFocus',
          'finalFocusEl',
          'onFinalFocus',
          'dialogId',
          'labelId',
          'descriptionId',
        ],
      },
    ],
  },
  Drawer: {
    exportName: 'primitives/drawer',
    components: [
      {
        name: 'Root',
        forcedSorting: [
          'snapPoints',
          'breakPoints',
          'defaultSnapPoint',
          'activeSnapPoint',
          'onActiveSnapPointChange',
          'side',
          'dampFunction',
          'velocityFunction',
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'transitionResize',
          'children',
        ],
      },
      {
        name: 'Content',
        forcedSorting: ['as', 'asChild', 'forceMount', 'contextId'],
      },
    ],
    contexts: [
      {
        name: 'useContext',
        forcedSorting: [
          'snapPoints',
          'breakPoints',
          'defaultSnapPoint',
          'activeSnapPoint',
          'setActiveSnapPoint',
          'side',
          'isDragging',
          'isTransitioning',
          'transitionState',
          'openPercentage',
          'translate',
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'transitionResize',
        ],
      },
    ],
    types: [
      {
        name: 'RootChildrenProps',
        forcedSorting: [
          'snapPoints',
          'breakPoints',
          'defaultSnapPoint',
          'activeSnapPoint',
          'setActiveSnapPoint',
          'side',
          'isDragging',
          'isTransitioning',
          'transitionState',
          'openPercentage',
          'translate',
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'transitionResize',
        ],
      },
    ],
  },
}

export type UtilitySpecifications =
  | 'createControllableSignal'
  | 'createPreventScroll'
  | 'createFocusTrap'
  | 'keyedContext'
  | 'createPresence'
  | 'Polymorphic'

export const titleToUtilitySpecification = (
  title:
    | 'Controllable Signal'
    | 'Prevent Scroll'
    | 'Focus Trap'
    | 'Keyed Context'
    | 'Presence'
    | 'Polymorphic',
): UtilitySpecifications => {
  switch (title) {
    case 'Controllable Signal':
      return 'createControllableSignal'
    case 'Prevent Scroll':
      return 'createPreventScroll'
    case 'Focus Trap':
      return 'createFocusTrap'
    case 'Keyed Context':
      return 'keyedContext'
    case 'Presence':
      return 'createPresence'
    case 'Polymorphic':
      return 'Polymorphic'
  }
}

export const utilitySpecifications: {
  [key in UtilitySpecifications]: {
    components?: TypeSpecification[]
    functions?: TypeSpecification[]
  }
} = {
  createControllableSignal: {
    functions: [
      {
        name: 'createControllableSignal',
        forcedSorting: ['value', 'onChange', 'initialValue'],
      },
    ],
  },
  createPreventScroll: {
    functions: [
      {
        name: 'createPreventScroll',
        forcedSorting: [
          'element',
          'enabled',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'allowPinchZoom',
        ],
      },
    ],
  },
  createFocusTrap: {
    functions: [
      {
        name: 'createFocusTrap',
        forcedSorting: [
          'element',
          'enabled',
          'observeChanges',
          'initialFocusElement',
          'onInitialFocus',
          'restoreFocus',
          'finalFocusElement',
          'onFinalFocus',
        ],
      },
    ],
  },
  keyedContext: {
    functions: [
      {
        name: 'createKeyedContext',
        forcedSorting: ['key', 'defaultValue'],
      },
      {
        name: 'getKeyedContext',
      },
      {
        name: 'useKeyedContext',
      },
    ],
  },
  createPresence: {
    functions: [
      {
        name: 'createPresence',
        forcedSorting: ['show', 'element'],
      },
    ],
  },
  Polymorphic: {
    components: [
      {
        name: 'Polymorphic',
      },
      {
        name: 'As',
      },
    ],
  },
}
