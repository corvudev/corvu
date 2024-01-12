# corvu

## 0.2.1

### Patch Changes

- Refactor preventScroll to require fewer event listeners and make element optional - [`503d816`](https://github.com/corvudev/corvu/commit/503d8163d009d1e232f2367ab0e363525f588cbb) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.2.0

### Minor Changes

- Remove scrollThreshold from the drawer as it's not needed anymore - [`c73b2fb`](https://github.com/corvudev/corvu/commit/c73b2fb96519f08549b67243425af160a0627b4f) ([@GiyoMoon](https://github.com/GiyoMoon))

- Rename createDisableScroll to createPreventScroll - [`ca5b647`](https://github.com/corvudev/corvu/commit/ca5b6478541637208a45d1ea4eebe0e844f82d75) ([@GiyoMoon](https://github.com/GiyoMoon))

- Rewrite createDisableScroll - [`a37b873`](https://github.com/corvudev/corvu/commit/a37b873710644411ebf40c15fbac34463b7a4cb4) ([@GiyoMoon](https://github.com/GiyoMoon))

- Unify create functions and improve docs - [`fb50ce3`](https://github.com/corvudev/corvu/commit/fb50ce3ef57f303ed4d5779fdd0d0f189268d1b6) ([@GiyoMoon](https://github.com/GiyoMoon))

### Patch Changes

- Watch for drawer height changes - [`fda114e`](https://github.com/corvudev/corvu/commit/fda114ed35cd791e1af53730a575ec3da30e4e48) ([@GiyoMoon](https://github.com/GiyoMoon))

- Add transitionState to the drawer primitive - [`8232435`](https://github.com/corvudev/corvu/commit/8232435a820aa44857428f8fcf27a354f95c70b6) ([@GiyoMoon](https://github.com/GiyoMoon))

- Disable drag on elements with the data-corvu-no-drag attribute - [`0427844`](https://github.com/corvudev/corvu/commit/0427844dcdc2d7bc2028667c6ff93f44a38810b6) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.1.2

### Patch Changes

- Fix createDisableScroll not working on iOS platform - [`bb6f568`](https://github.com/corvudev/corvu/commit/bb6f568020c767f35d301af3ca52d23b23419183) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.1.1

### Patch Changes

- Prevent dialog content children memo from being cleaned up - [`8072f69`](https://github.com/corvudev/corvu/commit/8072f698f9135a6ea961a5827c86f565a6a4bb27) ([@GiyoMoon](https://github.com/GiyoMoon))

- Watch for DOM changes inside focus trap - [`526143c`](https://github.com/corvudev/corvu/commit/526143c55af2981537c14455b9c5d64840f25138) ([@GiyoMoon](https://github.com/GiyoMoon))

- Improve drawer transition behavior - [`d442cc9`](https://github.com/corvudev/corvu/commit/d442cc99152db09aed31ffa8219d4d44d7ff93c1) ([@GiyoMoon](https://github.com/GiyoMoon))

- Refactor children memoization - [`bc9f78e`](https://github.com/corvudev/corvu/commit/bc9f78e3dedc88af82de0c8749e0de5ee68807c3) ([@GiyoMoon](https://github.com/GiyoMoon), [@danieltroger](https://github.com/danieltroger/))

- Remove focus if there are no focusable elements in trap - [`68aad25`](https://github.com/corvudev/corvu/commit/68aad2568e24a416cfe5e6cce198a1fc2d7f576d) ([@GiyoMoon](https://github.com/GiyoMoon))

- Improve types of createControllableSignal and createPresence - [`966e420`](https://github.com/corvudev/corvu/commit/966e42016a1692a84a0fd76db73c966e4ae5e531) ([@GiyoMoon](https://github.com/GiyoMoon))

- Don't listen to gesture events when drawer isn't open - [`7299030`](https://github.com/corvudev/corvu/commit/72990303dd709997096d282ed0400e412a7c9ed1) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.1.0

### Minor Changes

- Initial release
