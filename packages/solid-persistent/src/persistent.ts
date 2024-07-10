import {
  type Accessor,
  createMemo,
  getOwner,
  type JSX,
  type Owner,
  runWithOwner,
} from 'solid-js'

/**
 * Creates a persistent component that keeps its state and elements cached when removed from the DOM.
 * @param component The component to persist.
 * @returns An accessor that returns the persisted component.
 */
const createPersistent = (component: () => JSX.Element) => {
  let owner: Owner
  let memoizedComponent: Accessor<JSX.Element> | undefined

  return () => {
    if (!memoizedComponent) {
      const currentOwner = getOwner()
      if (currentOwner) owner = { ...currentOwner }
      memoizedComponent = createMemo(() => runWithOwner(owner, component))
    }
    return memoizedComponent()
  }
}

export default createPersistent
