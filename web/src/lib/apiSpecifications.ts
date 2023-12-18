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
          'preventScrollbarShift',
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
          'preventScrollbarShift',
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
          'preventScrollbarShift',
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
          'scrollThreshold',
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
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'scrollThreshold',
          'isDragging',
          'isTransitioning',
          'openPercentage',
          'translate',
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
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'scrollThreshold',
          'isDragging',
          'isTransitioning',
          'openPercentage',
          'translate',
        ],
      },
    ],
  },
}

export type UtilitySpecifications =
  | 'createControllableSignal'
  | 'createDisableScroll'
  | 'createFocusTrap'
  | 'keyedContext'
  | 'createPresence'
  | 'Polymorphic'

export const titleToUtilitySpecification = (
  title:
    | 'Controllable Signal'
    | 'Disable Scroll'
    | 'Focus Trap'
    | 'Keyed Context'
    | 'Presence'
    | 'Polymorphic',
): UtilitySpecifications => {
  switch (title) {
    case 'Controllable Signal':
      return 'createControllableSignal'
    case 'Disable Scroll':
      return 'createDisableScroll'
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
        forcedSorting: ['value', 'onChange', 'defaultValue'],
      },
    ],
  },
  createDisableScroll: {
    functions: [
      {
        name: 'createDisableScroll',
        forcedSorting: ['enabled', 'preventScrollbarShift'],
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
