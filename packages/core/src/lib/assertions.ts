const isFunction = <T extends Function = Function>(
  value: unknown,
): value is T => {
  return typeof value === 'function'
}

/**!
 * Original code for "isButton" by Ariakit
 * MIT License, Copyright (c) Diego Haz
 *
 * Credits to the Ariakit team:
 * https://github.com/ariakit/ariakit/blob/b26cdee02011d2a6b4b544a80842a6fa4ae9e7c5/packages/ariakit-core/src/utils/dom.ts#L90
 */

const buttonInputTypes = ['button', 'color', 'file', 'image', 'reset', 'submit']
const isButton = (tagName: string, type?: string) => {
  if (tagName === 'button') return true
  if (tagName === 'input' && type) {
    return buttonInputTypes.indexOf(type) !== -1
  }
  return false
}

export { isFunction, isButton }
