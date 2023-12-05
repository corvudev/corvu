import { Context, createContext, useContext } from 'solid-js'

const keyedContexts = new Map<string, Context<unknown>>()

/** Creates a keyed context that can be obtained and used with `getKeyedContext` and `useKeyedContext`. */
const createKeyedContext = <T>(key: string, defaultValue?: T) => {
  if (keyedContexts.has(key)) {
    return keyedContexts.get(key) as Context<T | undefined>
  }
  const keyedContext = createContext(defaultValue)
  keyedContexts.set(key, keyedContext as Context<unknown>)
  return keyedContext
}

/** Gets a keyed context created with `createKeyedContext`. */
const getKeyedContext = <T>(key: string) => {
  const keyedContext = keyedContexts.get(key)
  return keyedContext as Context<T | undefined> | undefined
}

/** Use a keyed context created with `createKeyedContext` to receive a scoped state from a parent's Context.Provider. */
const useKeyedContext = <T>(key: string) => {
  const keyedContext = keyedContexts.get(key)
  if (!keyedContext) return undefined
  return useContext(keyedContext) as T | undefined
}

export { createKeyedContext, getKeyedContext, useKeyedContext }
