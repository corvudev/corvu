import { isFunction } from '@lib/assertions'
import createDismissible, {
  CreateDismissableProps,
} from '@lib/create/dismissible'
import createOnce from '@lib/create/once'
import { access } from '@lib/utils'
import {
  createContext,
  useContext,
  splitProps,
  createUniqueId,
  createSignal,
  onCleanup,
  Show,
  untrack,
  createMemo,
} from 'solid-js'
import type { Accessor, Component, JSX } from 'solid-js'

type DismissibleContextValue = {
  layers: Accessor<string[]>
  onLayerShow: (newLayer: string) => void
  onLayerDismiss: (dismissedLayer: string) => void
}

const DismissibleContext = createContext<DismissibleContextValue>()

const Dismissible: Component<
  CreateDismissableProps & {
    children: JSX.Element | ((props: { isLastLayer: boolean }) => JSX.Element)
  }
> = (props) => {
  const upperContext = useContext(DismissibleContext)

  return (
    <Show when={upperContext} fallback={<RootDismissible {...props} />} keyed>
      {(upperContext) => <ChildDismissible {...props} {...upperContext} />}
    </Show>
  )
}

const RootDismissible: Component<
  CreateDismissableProps & {
    children: JSX.Element | ((props: { isLastLayer: boolean }) => JSX.Element)
  }
> = (props) => {
  const [localProps, otherProps] = splitProps(props, [
    'children',
    'disableDismissOnEscape',
    'disableDismissOnOutsideInteract',
    'onDismiss',
  ])

  const layerId = createUniqueId()
  const [layers, setLayers] = createSignal<string[]>([layerId])

  const onLayerShow = (layerId: string) => {
    setLayers((layers) => [...layers, layerId])
  }

  const onLayerDismiss = (layerId: string) => {
    setLayers((layers) => layers.filter((layer) => layer !== layerId))
  }

  const isLastLayer = () => layers()[layers().length - 1] === layerId

  createDismissible({
    disableDismissOnEscape: () =>
      access(localProps.disableDismissOnEscape) || !isLastLayer(),
    disableDismissOnOutsideInteract: () =>
      access(localProps.disableDismissOnOutsideInteract) || !isLastLayer(),
    onDismiss: (reason) => {
      onLayerDismiss(layerId)
      localProps.onDismiss?.(reason)
    },
    ...otherProps,
  })

  const memoizedChildren = createOnce(() => localProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()()
    if (isFunction(children)) {
      return children({
        get isLastLayer() {
          return isLastLayer()
        },
      })
    }
    return children
  }

  return (
    <DismissibleContext.Provider
      value={{
        layers,
        onLayerShow,
        onLayerDismiss,
      }}
    >
      {untrack(() => resolveChildren())}
    </DismissibleContext.Provider>
  )
}

const ChildDismissible: Component<
  CreateDismissableProps &
    DismissibleContextValue & {
      children: JSX.Element | ((props: { isLastLayer: boolean }) => JSX.Element)
    }
> = (props) => {
  const [localProps, otherProps] = splitProps(props, [
    'children',
    'disableDismissOnEscape',
    'disableDismissOnOutsideInteract',
    'onDismiss',
    'layers',
    'onLayerShow',
    'onLayerDismiss',
  ])

  const layerId = createUniqueId()
  // eslint-disable-next-line solid/reactivity
  localProps.onLayerShow(layerId)

  const isLastLayer = () => {
    return localProps.layers()[localProps.layers().length - 1] === layerId
  }

  onCleanup(() => {
    localProps.onLayerDismiss(layerId)
  })

  createDismissible({
    disableDismissOnEscape: () =>
      access(localProps.disableDismissOnEscape) || !isLastLayer(),
    disableDismissOnOutsideInteract: () =>
      access(localProps.disableDismissOnOutsideInteract) || !isLastLayer(),
    onDismiss: (reason) => {
      localProps.onLayerDismiss(layerId)
      localProps.onDismiss?.(reason)
    },
    ...otherProps,
  })

  const memoizedChildren = createMemo(() => localProps.children)

  const resolveChildren = () => {
    const children = memoizedChildren()
    if (isFunction(children)) {
      return children({
        get isLastLayer() {
          return isLastLayer()
        },
      })
    }
    return children
  }

  return <>{untrack(() => resolveChildren())}</>
}

export default Dismissible
