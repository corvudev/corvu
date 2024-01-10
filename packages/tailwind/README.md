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
This is the [tailwindcss](https://tailwindcss.com/) plugin for [corvu](https://corvu.dev/). It adds modifiers to style primitives based on their state:

```tsx
<Dialog.Content
  class="corvu-open:animate-in corvu-closed:animate-out"
>
  ...
</Dialog.Content>
```

## Getting started
Install the plugin with the package manager of your choice:

```bash
npm install @corvu/tailwind
```

Then add the plugin to your `tailwind.config.js` file:

```js
module.exports = {
  // ...
  plugins: [
    // Use it with the default prefix 'corvu'
    require('@corvu/tailwind'),
    // or with a custom prefix
    require('@corvu/tailwind')({ prefix: 'ui' }),
    // ...
  ],
}
```
