# corvu

## 0.4.2

### Patch Changes

- Add key to createStyle to group corresponding calls - [`0f0d9eb`](https://github.com/corvudev/corvu/commit/0f0d9eb877d884db285884938efee5dfb89d4a0c) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.4.1

### Patch Changes

- Fix drawer and popover trigger data attributes - [`2659d1a`](https://github.com/corvudev/corvu/commit/2659d1a780a91f0bfd8ce4705e603e2c5938728c) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.4.0

### Minor Changes

- Rename polymorphic to dynamic - [`1012fe7`](https://github.com/corvudev/corvu/commit/1012fe7112ece54fcac10ab737b7a5503f8664ed) ([@GiyoMoon](https://github.com/GiyoMoon))

- Simplify the polymorphic component - [`a5571fa`](https://github.com/corvudev/corvu/commit/a5571faeb620e29d8e755efe6b67924690d94dcf) ([@GiyoMoon](https://github.com/GiyoMoon))

### Patch Changes

- Refactor tooltip logic - [`89af6fa`](https://github.com/corvudev/corvu/commit/89af6faf1704fdb6d1206985f08c94ef961dcca2) ([@GiyoMoon](https://github.com/GiyoMoon))

- Add drawer data attributes to the overlay - [`f544083`](https://github.com/corvudev/corvu/commit/f544083e7c1f82fa4068ed75ce89e1fa6fdf0eca) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.3.0

### Minor Changes

- Add `closeOnOutsidePointerStrategy` to dialog and use `corvu-drawer-*` data attributes for drawer components - [`629871f`](https://github.com/corvudev/corvu/commit/629871fdd57e290829fb8ac7560a0a1f4b0741e7) ([@GiyoMoon](https://github.com/GiyoMoon))

- Add allowPinchZoom option to dialog primitive - [`5deb1c5`](https://github.com/corvudev/corvu/commit/5deb1c56655059e9878161892061db20c80e980c) ([@GiyoMoon](https://github.com/GiyoMoon))

### Patch Changes

- Allow text selection on drawer content - [`9efcac5`](https://github.com/corvudev/corvu/commit/9efcac545ea9f76ea8e147fa19e8a508da571c44) ([@GiyoMoon](https://github.com/GiyoMoon))

- Add popover and tooltip primitives - [#6](https://github.com/corvudev/corvu/pull/6) [`3e29aae`](https://github.com/corvudev/corvu/commit/3e29aaea2ac7f7c1a2ba3b47a454ff3a4eb6693d) ([@GiyoMoon](https://github.com/GiyoMoon))

- Fix drawer `open` not being controllable - [`617f95a`](https://github.com/corvudev/corvu/commit/617f95add007310f2271385a47c39ef57e046294) ([@GiyoMoon](https://github.com/GiyoMoon))

- Detect scrollable root elements in createPreventScroll - [`82504e9`](https://github.com/corvudev/corvu/commit/82504e963bfe47c6180084994b33efa2ff3f4516) ([@GiyoMoon](https://github.com/GiyoMoon))

- Add `typesVersions` to package.json to support older `moduleResolution` strategies - [`705a538`](https://github.com/corvudev/corvu/commit/705a538011521eda940a3e692303898b6389e0c8) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.2.4

### Patch Changes

- Add disclosure and accordion primitives - [#5](https://github.com/corvudev/corvu/pull/5) [`6960a2d`](https://github.com/corvudev/corvu/commit/6960a2d269bb3c680b36a52e42b7dab23fa9a040) ([@GiyoMoon](https://github.com/GiyoMoon))

- Dialog: prevent possible hydration bug - [`e79efd4`](https://github.com/corvudev/corvu/commit/e79efd43c71431ad5fef56941368c4a2f355c36b) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.2.3

### Patch Changes

- Correctly use requestAnimationFrame to wait for browser repaint - [`5704a0b`](https://github.com/corvudev/corvu/commit/5704a0b28f99d4ed0c2922a6f82aa6e9dfe0fea2) ([@GiyoMoon](https://github.com/GiyoMoon))

## 0.2.2

### Patch Changes

- Possibility to transition the width/height of drawers with a dynamic size - [`5f9a5d0`](https://github.com/corvudev/corvu/commit/5f9a5d03f108ff0c23895951955bb97a9cdad20b) ([@GiyoMoon](https://github.com/GiyoMoon))

- Add contentRef and overlayRef to dialog root children props - [`6c5142a`](https://github.com/corvudev/corvu/commit/6c5142a392c9db4281fd7d8f7943975ece3d08b3) ([@GiyoMoon](https://github.com/GiyoMoon))

- Export DialogContextValue in corvu/drawer - [`e295703`](https://github.com/corvudev/corvu/commit/e295703957dbfe254725562c73e928ea5f5e6750) ([@GiyoMoon](https://github.com/GiyoMoon))

- Fix drawer opening transition and set data-snapping properly - [`82e07bb`](https://github.com/corvudev/corvu/commit/82e07bb9fca2488ee085fbc7f4aabb954adf2753) ([@GiyoMoon](https://github.com/GiyoMoon))

- Drawer: export missing prop types - [`9b16e26`](https://github.com/corvudev/corvu/commit/9b16e26e50709add035a43cbcb17037b02888d58) ([@GiyoMoon](https://github.com/GiyoMoon))

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
