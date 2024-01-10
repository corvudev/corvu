<div align="center">
  <img src="https://raw.githubusercontent.com/corvudev/corvu/main/assets/banner.png" width=1000 alt="corvu banner" />
</div>
<br />
<div align="center">

[![NPM Version](https://img.shields.io/npm/v/corvu)](https://www.npmjs.com/package/corvu)
[![NPM Downloads](https://img.shields.io/npm/dm/corvu)](https://www.npmjs.com/package/corvu)
[![License](https://img.shields.io/github/license/corvudev/corvu)](https://github.com/corvudev/corvu/blob/main/LICENSE)

**[Documentation](https://corvu.dev/) • [Discussions](https://github.com/corvudev/corvu/discussions)**
</div>

## About
Corvu is a collection of open source UI primitives for SolidJS. It offers:

- 🫥 Unstyled,
- ♿ Accessible primitives
- 🪄 High customizability
- 🌟 Delightful developer experience
- 📝 A good documentation
- ✅ SSR Support

Read more at [corvu.dev](https://corvu.dev).

## Getting started
Install corvu with the package manager of your choice:

```bash
npm install corvu
```

Import a primitive and use it in your app:

```jsx
import Dialog from 'corvu/dialog';

const App = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content>
          <Dialog.Label>Hey 👋</Dialog.Label>
          <Dialog.Description>This is a basic dialog</Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
