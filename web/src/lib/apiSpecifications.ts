type TypeSpecification = {
  name: string
  forcedSorting?: string[]
}

export type ComponentSpecifications =
  | 'Dialog'
  | 'Drawer'
  | 'Disclosure'
  | 'Accordion'

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
          'closeOnOutsidePointer',
          'closeOnOutsidePointerStrategy',
          'onOutsidePointer',
          'noOutsidePointerEvents',
          'preventScroll',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'allowPinchZoom',
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
          'setOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'closeOnOutsidePointer',
          'closeOnOutsidePointerStrategy',
          'noOutsidePointerEvents',
          'preventScroll',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'allowPinchZoom',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'finalFocusEl',
          'contentPresent',
          'contentRef',
          'overlayPresent',
          'overlayRef',
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
          'setOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'closeOnOutsidePointer',
          'closeOnOutsidePointerStrategy',
          'noOutsidePointerEvents',
          'preventScroll',
          'hideScrollbar',
          'preventScrollbarShift',
          'preventScrollbarShiftMode',
          'allowPinchZoom',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'finalFocusEl',
          'contentPresent',
          'contentRef',
          'overlayPresent',
          'overlayRef',
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
  Disclosure: {
    exportName: 'primitives/disclosure',
    components: [
      {
        name: 'Root',
        forcedSorting: [
          'expanded',
          'onExpandedChange',
          'initialExpanded',
          'collapseBehavior',
          'disclosureId',
          'contextId',
          'children',
        ],
      },
      {
        name: 'Trigger',
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
          'expanded',
          'setExpanded',
          'collapseBehavior',
          'disclosureId',
          'contentPresent',
          'contentRef',
          'contentSize',
        ],
      },
    ],
    types: [
      {
        name: 'RootChildrenProps',
      },
    ],
  },
  Accordion: {
    exportName: 'primitives/accordion',
    components: [
      {
        name: 'Root',
        forcedSorting: [
          'multiple',
          'value',
          'onValueChange',
          'initialValue',
          'collapsible',
          'disabled',
          'orientation',
          'loop',
          'collapseBehavior',
          'contextId',
          'children',
        ],
      },
      {
        name: 'Item',
        forcedSorting: [
          'value',
          'disabled',
          'triggerId',
          'expanded',
          'onExpandedChange',
          'initialExpanded',
          'collapseBehavior',
          'disclosureId',
          'contextId',
          'children',
          'as',
          'asChild',
        ],
      },
      {
        name: 'Trigger',
      },
      {
        name: 'Content',
        forcedSorting: ['forceMount', 'contextId', 'as', 'asChild'],
      },
    ],
    contexts: [
      {
        name: 'useContext',
        forcedSorting: [
          'multiple',
          'value',
          'setValue',
          'collapsible',
          'disabled',
          'orientation',
          'loop',
          'collapseBehavior',
        ],
      },
      {
        name: 'useItemContext',
        forcedSorting: ['value', 'disabled', 'triggerId'],
      },
    ],
    types: [
      {
        name: 'RootChildrenProps',
        forcedSorting: [
          'multiple',
          'value',
          'setValue',
          'collapsible',
          'disabled',
          'orientation',
          'loop',
          'collapseBehavior',
        ],
      },
      {
        name: 'ItemChildrenProps',
        forcedSorting: ['value', 'disabled', 'triggerId'],
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
