import accordionTypedoc from '../../../../packages/accordion/api.json'
import type { ApiDeclaration } from '@lib/typedoc/types/typedoc'
import calendarTypedoc from '../../../../packages/calendar/api.json'
import dialogTypedoc from '../../../../packages/dialog/api.json'
import disclosureTypedoc from '../../../../packages/disclosure/api.json'
import dismissibleTypedoc from '../../../../packages/solid-dismissible/api.json'
import drawerTypedoc from '../../../../packages/drawer/api.json'
import focusTrapTypedoc from '../../../../packages/solid-focus-trap/api.json'
import type { Library } from '@lib/typedoc/types/specifications'
import listTypedoc from '../../../../packages/solid-list/api.json'
import otpFieldTypedoc from '../../../../packages/otp-field/api.json'
import persistentTypedoc from '../../../../packages/solid-persistent/api.json'
import popoverTypedoc from '../../../../packages/popover/api.json'
import presenceTypedoc from '../../../../packages/solid-presence/api.json'
import preventScrollTypedoc from '../../../../packages/solid-prevent-scroll/api.json'
import resizableTypedoc from '../../../../packages/resizable/api.json'
import tooltipTypedoc from '../../../../packages/tooltip/api.json'
import transitionSizeTypedoc from '../../../../packages/solid-transition-size/api.json'
import utilsTypedoc from '../../../../packages/utils/api.json'

export const Typedoc: { [key: string]: ApiDeclaration } = {
  '@corvu/accordion': accordionTypedoc as ApiDeclaration,
  '@corvu/calendar': calendarTypedoc as ApiDeclaration,
  '@corvu/dialog': dialogTypedoc as ApiDeclaration,
  '@corvu/disclosure': disclosureTypedoc as ApiDeclaration,
  '@corvu/drawer': drawerTypedoc as ApiDeclaration,
  '@corvu/otp-field': otpFieldTypedoc as ApiDeclaration,
  '@corvu/popover': popoverTypedoc as ApiDeclaration,
  '@corvu/resizable': resizableTypedoc as ApiDeclaration,
  '@corvu/tooltip': tooltipTypedoc as ApiDeclaration,
  '@corvu/utils': utilsTypedoc as ApiDeclaration,
  'solid-dismissible': dismissibleTypedoc as ApiDeclaration,
  'solid-focus-trap': focusTrapTypedoc as ApiDeclaration,
  'solid-list': listTypedoc as ApiDeclaration,
  'solid-persistent': persistentTypedoc as ApiDeclaration,
  'solid-presence': presenceTypedoc as ApiDeclaration,
  'solid-prevent-scroll': preventScrollTypedoc as ApiDeclaration,
  'solid-transition-size': transitionSizeTypedoc as ApiDeclaration,
}

const Disclosure: Library = {
  api: Typedoc['@corvu/disclosure'],
  name: 'Disclosure',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'expanded',
        'onExpandedChange',
        'initialExpanded',
        'collapseBehavior',
        'disclosureId',
        'contextId',
      ],
    },
    Trigger: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Content: {
      kind: 'component',
      sorting: ['as', 'forceMount', 'contextId'],
    },
    useContext: {
      kind: 'context',
      sorting: [
        'expanded',
        'setExpanded',
        'collapseBehavior',
        'disclosureId',
        'contentPresent',
        'contentRef',
        'contentSize',
      ],
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'expanded',
        'setExpanded',
        'collapseBehavior',
        'disclosureId',
        'contentPresent',
        'contentRef',
        'contentSize',
      ],
    },
  },
}

const Accordion: Library = {
  api: Typedoc['@corvu/accordion'],
  name: 'Accordion',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'multiple',
        'value',
        'onValueChange',
        'initialValue',
        'collapsible',
        'disabled',
        'orientation',
        'loop',
        'textDirection',
        'collapseBehavior',
        'contextId',
      ],
    },
    Item: {
      kind: 'component',
      sorting: ['value', 'disabled', 'triggerId', 'as'],
      inherits: {
        library: Disclosure,
        name: 'Root',
      },
    },
    Trigger: {
      kind: 'inherited-component',
      inherits: {
        library: Disclosure,
        name: 'Trigger',
      },
    },
    Content: {
      kind: 'inherited-component',
      inherits: {
        library: Disclosure,
        name: 'Content',
      },
    },
    useContext: {
      kind: 'context',
      sorting: [
        'multiple',
        'value',
        'setValue',
        'collapsible',
        'disabled',
        'orientation',
        'loop',
        'textDirection',
        'collapseBehavior',
      ],
    },
    useItemContext: {
      kind: 'context',
      sorting: ['value', 'disabled', 'triggerId'],
    },
    useDisclosureContext: {
      kind: 'inherited-context',
      inherits: {
        library: Disclosure,
        name: 'useContext',
      },
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'multiple',
        'value',
        'setValue',
        'collapsible',
        'disabled',
        'orientation',
        'loop',
        'textDirection',
        'collapseBehavior',
      ],
    },
    ItemChildrenProps: {
      kind: 'childrenProps',
      sorting: ['value', 'disabled', 'triggerId'],
      inherits: {
        library: Disclosure,
        name: 'RootChildrenProps',
      },
    },
  },
}

const Calendar: Library = {
  api: Typedoc['@corvu/calendar'],
  name: 'Calendar',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'mode',
        'value',
        'onValueChange',
        'initialValue',
        'month',
        'onMonthChange',
        'initialMonth',
        'focusedDate',
        'onFocusedDateChange',
        'initialFocusedDate',
        'view',
        'onViewChange',
        'initialView',
        'required',
        'startOfWeek',
        'numberOfMonths',
        'disableOutsideDays',
        'disabled',
        'fixedWeeks',
        'min',
        'max',
        'excludeDisabled',
        'textDirection',
        'labelId',
        'contextId',
      ],
    },
    useContext: {
      kind: 'context',
      sorting: [
        'mode',
        'value',
        'setValue',
        'month',
        'setMonth',
        'focusedDate',
        'setFocusedDate',
        'view',
        'setView',
        'required',
        'startOfWeek',
        'numberOfMonths',
        'disableOutsideDays',
        'fixedWeeks',
        'min',
        'max',
        'excludeDisabled',
        'weekdays',
        'months',
        'weeks',
        'navigate',
        'textDirection',
        'labelId',
      ],
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'mode',
        'value',
        'setValue',
        'month',
        'setMonth',
        'focusedDate',
        'setFocusedDate',
        'view',
        'setView',
        'required',
        'startOfWeek',
        'numberOfMonths',
        'disableOutsideDays',
        'fixedWeeks',
        'min',
        'max',
        'excludeDisabled',
        'weekdays',
        'months',
        'weeks',
        'navigate',
        'textDirection',
        'labelId',
      ],
    },
    DateValue: {
      kind: 'simple',
    },
  },
}

const Dialog: Library = {
  api: Typedoc['@corvu/dialog'],
  name: 'Dialog',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'role',
        'open',
        'onOpenChange',
        'initialOpen',
        'modal',
        'closeOnEscapeKeyDown',
        'onEscapeKeyDown',
        'closeOnOutsideFocus',
        'closeOnOutsidePointer',
        'closeOnOutsidePointerStrategy',
        'onOutsideFocus',
        'onOutsidePointer',
        'noOutsidePointerEvents',
        'preventScroll',
        'hideScrollbar',
        'preventScrollbarShift',
        'preventScrollbarShiftMode',
        'restoreScrollPosition',
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
      ],
    },
    Trigger: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Portal: {
      kind: 'component',
      sorting: ['forceMount', 'contextId'],
    },
    Overlay: {
      kind: 'component',
      sorting: ['as', 'forceMount', 'contextId'],
    },
    Content: {
      kind: 'component',
      sorting: ['as', 'forceMount', 'contextId'],
    },
    Close: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Label: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Description: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    useContext: {
      kind: 'context',
      sorting: [
        'role',
        'open',
        'setOpen',
        'modal',
        'closeOnEscapeKeyDown',
        'closeOnOutsideFocus',
        'closeOnOutsidePointer',
        'closeOnOutsidePointerStrategy',
        'noOutsidePointerEvents',
        'preventScroll',
        'hideScrollbar',
        'preventScrollbarShift',
        'preventScrollbarShiftMode',
        'restoreScrollPosition',
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
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'role',
        'open',
        'setOpen',
        'modal',
        'closeOnEscapeKeyDown',
        'closeOnOutsideFocus',
        'closeOnOutsidePointer',
        'closeOnOutsidePointerStrategy',
        'noOutsidePointerEvents',
        'preventScroll',
        'hideScrollbar',
        'preventScrollbarShift',
        'preventScrollbarShiftMode',
        'restoreScrollPosition',
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
  },
}

const Drawer: Library = {
  api: Typedoc['@corvu/drawer'],
  name: 'Drawer',
  items: {
    Root: {
      kind: 'component',
      sorting: [
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
      ],
      inherits: {
        library: Dialog,
        name: 'Root',
      },
    },
    Trigger: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Trigger',
      },
    },
    Portal: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Portal',
      },
    },
    Overlay: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Overlay',
      },
    },
    Content: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Content',
      },
    },
    Close: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Close',
      },
    },
    Label: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Label',
      },
    },
    Description: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Description',
      },
    },
    useContext: {
      kind: 'context',
      sorting: [
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
    useDialogContext: {
      kind: 'inherited-context',
      inherits: {
        library: Dialog,
        name: 'useContext',
      },
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
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
      inherits: {
        library: Dialog,
        name: 'RootChildrenProps',
      },
    },
    Side: {
      kind: 'simple',
    },
    Size: {
      kind: 'simple',
    },
  },
}

const OtpField: Library = {
  api: Typedoc['@corvu/otp-field'],
  name: 'OTP Field',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'maxLength',
        'value',
        'onValueChange',
        'onComplete',
        'shiftPWManagers',
        'contextId',
        'as',
      ],
    },
    Input: {
      kind: 'component',
      sorting: ['pattern', 'noScriptCSSFallback', 'contextId', 'as'],
    },
    useContext: {
      kind: 'context',
      sorting: [
        'value',
        'isFocused',
        'isHovered',
        'isInserting',
        'maxLength',
        'activeSlots',
        'shiftPWManagers',
      ],
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'value',
        'isFocused',
        'isHovered',
        'isInserting',
        'maxLength',
        'activeSlots',
        'shiftPWManagers',
      ],
    },
  },
}

const Popover: Library = {
  api: Typedoc['@corvu/popover'],
  name: 'Popover',
  items: {
    Root: {
      kind: 'component',
      sorting: ['placement', 'strategy', 'floatingOptions'],
      inherits: {
        library: Dialog,
        name: 'Root',
      },
    },
    Anchor: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Trigger: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Trigger',
      },
    },
    Portal: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Portal',
      },
    },
    Overlay: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Overlay',
      },
    },
    Arrow: {
      kind: 'component',
      sorting: ['size', 'as', 'contextId'],
    },
    Content: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Content',
      },
    },
    Close: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Close',
      },
    },
    Label: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Label',
      },
    },
    Description: {
      kind: 'inherited-component',
      inherits: {
        library: Dialog,
        name: 'Description',
      },
    },
    useContext: {
      kind: 'context',
      sorting: ['placement', 'strategy', 'floatingOptions', 'floatingState'],
    },
    useDialogContext: {
      kind: 'inherited-context',
      inherits: {
        library: Dialog,
        name: 'useContext',
      },
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: ['placement', 'strategy', 'floatingOptions', 'floatingState'],
      inherits: {
        library: Dialog,
        name: 'RootChildrenProps',
      },
    },
    FloatingOptions: {
      kind: 'simple',
    },
    FloatingState: {
      kind: 'simple',
    },
  },
}

const Resizable: Library = {
  api: Typedoc['@corvu/resizable'],
  name: 'Resizable',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'orientation',
        'sizes',
        'onSizesChange',
        'initialSizes',
        'keyboardDelta',
        'handleCursorStyle',
        'as',
        'contextId',
      ],
    },
    Panel: {
      kind: 'component',
      sorting: [
        'initialSize',
        'minSize',
        'maxSize',
        'collapsible',
        'collapsedSize',
        'collapseThreshold',
        'onResize',
        'onCollapse',
        'onExpand',
        'as',
        'contextId',
        'panelId',
      ],
    },
    Handle: {
      kind: 'component',
      sorting: [
        'startIntersection',
        'endIntersection',
        'altKey',
        'onHandleDragStart',
        'onHandleDrag',
        'onHandleDragEnd',
        'as',
        'contextId',
      ],
    },
    useContext: {
      kind: 'context',
      sorting: [
        'orientation',
        'sizes',
        'setSizes',
        'keyboardDelta',
        'handleCursorStyle',
        'resize',
        'collapse',
        'expand',
      ],
    },
    usePanelContext: {
      kind: 'context',
      sorting: [
        'size',
        'minSize',
        'maxSize',
        'collapsible',
        'collapsedSize',
        'collapseThreshold',
        'collapsed',
        'resize',
        'collapse',
        'expand',
        'panelId',
      ],
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'orientation',
        'sizes',
        'setSizes',
        'keyboardDelta',
        'handleCursorStyle',
        'resize',
        'collapse',
        'expand',
      ],
    },
    PanelChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'size',
        'minSize',
        'maxSize',
        'collapsible',
        'collapsedSize',
        'collapseThreshold',
        'collapsed',
        'resize',
        'collapse',
        'expand',
        'panelId',
      ],
    },
    Size: {
      kind: 'simple',
    },
  },
}

const Tooltip: Library = {
  api: Typedoc['@corvu/tooltip'],
  name: 'Tooltip',
  items: {
    Root: {
      kind: 'component',
      sorting: [
        'open',
        'onOpenChange',
        'initialOpen',
        'placement',
        'strategy',
        'floatingOptions',
        'openDelay',
        'closeDelay',
        'skipDelayDuration',
        'hoverableContent',
        'group',
        'openOnFocus',
        'onFocus',
        'onBlur',
        'openOnHover',
        'onHover',
        'onLeave',
        'closeOnEscapeKeyDown',
        'onEscapeKeyDown',
        'closeOnPointerDown',
        'onPointerDown',
        'closeOnScroll',
        'onScroll',
        'tooltipId',
        'contextId',
      ],
    },
    Anchor: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Trigger: {
      kind: 'component',
      sorting: ['as', 'contextId'],
    },
    Portal: {
      kind: 'component',
      sorting: ['forceMount', 'contextId'],
    },
    Content: {
      kind: 'component',
      sorting: ['forceMount', 'as', 'contextId'],
    },
    Arrow: {
      kind: 'component',
      sorting: ['size', 'as', 'contextId'],
    },
    useContext: {
      kind: 'context',
      sorting: [
        'open',
        'setOpen',
        'placement',
        'strategy',
        'floatingOptions',
        'floatingState',
        'openDelay',
        'closeDelay',
        'skipDelayDuration',
        'hoverableContent',
        'group',
        'openOnFocus',
        'openOnHover',
        'closeOnEscapeKeyDown',
        'closeOnPointerDown',
        'contentPresent',
        'contentRef',
        'tooltipId',
      ],
    },
    RootChildrenProps: {
      kind: 'childrenProps',
      sorting: [
        'open',
        'setOpen',
        'placement',
        'strategy',
        'floatingOptions',
        'floatingState',
        'openDelay',
        'closeDelay',
        'skipDelayDuration',
        'hoverableContent',
        'group',
        'openOnFocus',
        'openOnHover',
        'closeOnEscapeKeyDown',
        'closeOnPointerDown',
        'contentPresent',
        'contentRef',
        'tooltipId',
      ],
    },
    FloatingOptions: {
      kind: 'simple',
    },
    FloatingState: {
      kind: 'simple',
    },
  },
}

const Dismissible: Library = {
  api: Typedoc['solid-dismissible'],
  name: 'Dismissible',
  items: {
    Dismissible: {
      isDefaultExport: true,
      kind: 'component',
      sorting: [
        'enabled',
        'dismissibleId',
        'element',
        'onDismiss',
        'dismissOnEscapeKeyDown',
        'dismissOnOutsideFocus',
        'dismissOnOutsidePointer',
        'outsidePointerStrategy',
        'outsidePointerIgnore',
        'noOutsidePointerEvents',
        'onEscapeKeyDown',
        'onOutsideFocus',
        'onOutsidePointer',
      ],
    },
    DismissibleChildrenProps: {
      kind: 'childrenProps',
      sorting: ['isLastLayer'],
    },
    activeDismissibles: {
      kind: 'simple',
    },
  },
}

const FocusTrap: Library = {
  api: Typedoc['solid-focus-trap'],
  name: 'Focus Trap',
  items: {
    createFocusTrap: {
      isDefaultExport: true,
      kind: 'function',
      propsSorting: [
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
  },
}

const List: Library = {
  api: Typedoc['solid-list'],
  name: 'List',
  items: {
    createList: {
      kind: 'function',
      propsSorting: [
        'items',
        'initialActive',
        'orientation',
        'loop',
        'textDirection',
        'handleTab',
        'vimMode',
        'vimKeys',
        'onActiveChange',
      ],
      returnsSorting: ['active', 'setActive', 'onKeyDown'],
    },
    createMultiList: {
      kind: 'function',
      propsSorting: [
        'items',
        'initialCursor',
        'initialActive',
        'initialSelected',
        'orientation',
        'loop',
        'textDirection',
        'handleTab',
        'vimMode',
        'vimKeys',
        'onCursorChange',
        'onActiveChange',
        'onSelectedChange',
      ],
      returnsSorting: [
        'cursor',
        'setCursor',
        'active',
        'setActive',
        'setCursorActive',
        'selected',
        'setSelected',
        'toggleSelected',
        'onKeyDown',
      ],
    },
  },
}

const Persistent: Library = {
  api: Typedoc['solid-persistent'],
  name: 'Persistent',
  items: {
    createPersistent: {
      kind: 'temporary',
    },
  },
}

const Presence: Library = {
  api: Typedoc['solid-presence'],
  name: 'Presence',
  items: {
    createPresence: {
      isDefaultExport: true,
      kind: 'function',
      propsSorting: ['show', 'element'],
      returnsSorting: ['present', 'state', 'setState'],
    },
  },
}

const PreventScroll: Library = {
  api: Typedoc['solid-prevent-scroll'],
  name: 'Prevent Scroll',
  items: {
    createPreventScroll: {
      isDefaultExport: true,
      kind: 'function',
      propsSorting: [
        'element',
        'enabled',
        'hideScrollbar',
        'preventScrollbarShift',
        'preventScrollbarShiftMode',
        'restoreScrollPosition',
        'allowPinchZoom',
      ],
    },
  },
}

const TransitionSize: Library = {
  api: Typedoc['solid-transition-size'],
  name: 'Transition Size',
  items: {
    createTransitionSize: {
      isDefaultExport: true,
      kind: 'function',
      propsSorting: ['element', 'enabled', 'dimension'],
      returnsSorting: ['transitionSize', 'transitioning'],
    },
  },
}

export {
  Accordion,
  Calendar,
  Dialog,
  Disclosure,
  Drawer,
  OtpField,
  Popover,
  Resizable,
  Tooltip,
  Dismissible,
  FocusTrap,
  List,
  Persistent,
  Presence,
  PreventScroll,
  TransitionSize,
}

export default [
  Accordion,
  Calendar,
  Dialog,
  Disclosure,
  Drawer,
  OtpField,
  Popover,
  Resizable,
  Tooltip,
  Dismissible,
  FocusTrap,
  List,
  Persistent,
  Presence,
  PreventScroll,
  TransitionSize,
]
