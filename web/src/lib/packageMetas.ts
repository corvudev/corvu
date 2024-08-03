import accordion from '../../../packages/accordion/package.json'
import corvu from '../../../packages/corvu/package.json'
import dialog from '../../../packages/dialog/package.json'
import disclosure from '../../../packages/disclosure/package.json'
import dismissible from '../../../packages/solid-dismissible/package.json'
import drawer from '../../../packages/drawer/package.json'
import focusTrap from '../../../packages/solid-focus-trap/package.json'
import list from '../../../packages/solid-list/package.json'
import otpField from '../../../packages/otp-field/package.json'
import persistent from '../../../packages/solid-persistent/package.json'
import popover from '../../../packages/popover/package.json'
import presence from '../../../packages/solid-presence/package.json'
import preventScroll from '../../../packages/solid-prevent-scroll/package.json'
import resizable from '../../../packages/resizable/package.json'
import tooltip from '../../../packages/tooltip/package.json'
import transitionSize from '../../../packages/solid-transition-size/package.json'

const packageMetas: {
  [library: string]: {
    version: string
    npmHref: string
    sourceHref: string
  }
} = {
  corvu: {
    version: corvu.version,
    npmHref: 'https://www.npmjs.com/package/corvu',
    sourceHref: 'https://github.com/corvudev/corvu/tree/main/packages/corvu',
  },
  '@corvu/accordion': {
    version: accordion.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/accordion',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/accordion',
  },
  '@corvu/dialog': {
    version: dialog.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/dialog',
    sourceHref: 'https://github.com/corvudev/corvu/tree/main/packages/dialog',
  },
  '@corvu/disclosure': {
    version: disclosure.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/disclosure',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/disclosure',
  },
  '@corvu/drawer': {
    version: drawer.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/drawer',
    sourceHref: 'https://github.com/corvudev/corvu/tree/main/packages/drawer',
  },
  '@corvu/otp-field': {
    version: otpField.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/otp-field',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/otp-field',
  },
  '@corvu/popover': {
    version: popover.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/popover',
    sourceHref: 'https://github.com/corvudev/corvu/tree/main/packages/popover',
  },
  '@corvu/resizable': {
    version: resizable.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/resizable',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/resizable',
  },
  '@corvu/tooltip': {
    version: tooltip.version,
    npmHref: 'https://www.npmjs.com/package/@corvu/tooltip',
    sourceHref: 'https://github.com/corvudev/corvu/tree/main/packages/tooltip',
  },
  'solid-dismissible': {
    version: dismissible.version,
    npmHref: 'https://www.npmjs.com/package/solid-dismissible',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-dismissible',
  },
  'solid-focus-trap': {
    version: focusTrap.version,
    npmHref: 'https://www.npmjs.com/package/solid-focus-trap',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-focus-trap',
  },
  'solid-list': {
    version: list.version,
    npmHref: 'https://www.npmjs.com/package/solid-list',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-list',
  },
  'solid-persistent': {
    version: persistent.version,
    npmHref: 'https://www.npmjs.com/package/solid-persistent',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-persistent',
  },
  'solid-presence': {
    version: presence.version,
    npmHref: 'https://www.npmjs.com/package/solid-presence',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-presence',
  },
  'solid-prevent-scroll': {
    version: preventScroll.version,
    npmHref: 'https://www.npmjs.com/package/solid-prevent-scroll',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-prevent-scroll',
  },
  'solid-transition-size': {
    version: transitionSize.version,
    npmHref: 'https://www.npmjs.com/package/solid-transition-size',
    sourceHref:
      'https://github.com/corvudev/corvu/tree/main/packages/solid-transition-size',
  },
}

export default packageMetas
