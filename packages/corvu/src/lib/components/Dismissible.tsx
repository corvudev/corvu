import {
  type Accessor,
  type Component,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  mergeProps,
  splitProps,
  untrack,
  useContext,
} from 'solid-js'
import createDismissible, {
  type CreateDismissableProps,
} from '@lib/create/dismissible'
import { access } from '@lib/utils'
import { isFunction } from '@lib/assertions'

type DismissibleContextValue = {
  layers: Accessor<string[]>
  onLayerShow: (newLayer: string) => void
  onLayerDismiss: (dismissedLayer: string) => void
}

const DismissibleContext = createContext<DismissibleContextValue>()

type DismissibleProps = {
  /** Whether the dismissible is enabled. *Default = `true`* */
  enabled: boolean
  children: JSX.Element | ((props: { isLastLayer: boolean }) => JSX.Element)
} & CreateDismissableProps

/** A component that can be dismissed by pressing the escape key or clicking outside of it. Can be nested. */
const DismissibleProvider: Component<DismissibleProps> = (props) => {
  const memoizedDismissible = createMemo(() => {
    const upperContext = useContext(DismissibleContext)
    if (upperContext) {
      return <Dismissible {...props} />
    }

    const layerId = createUniqueId()
    const [layers, setLayers] = createSignal<string[]>([layerId])

    const onLayerShow = (layerId: string) => {
      setLayers((layers) => [...layers, layerId])
    }

    const onLayerDismiss = (layerId: string) => {
      setLayers((layers) => layers.filter((layer) => layer !== layerId))
    }

    return (
      <DismissibleContext.Provider
        value={{
          layers,
          onLayerShow,
          onLayerDismiss,
        }}
      >
        <Dismissible {...props} />
      </DismissibleContext.Provider>
    )
  })

  return memoizedDismissible as unknown as JSX.Element
}

const Dismissible: Component<DismissibleProps> = (props) => {
  const defaultedProps = mergeProps(
    {
      enabled: true,
      dismissOnEscapeKeyDown: true,
      dismissOnOutsidePointer: true,
      dismissOnOutsidePointerStrategy: 'pointerup' as const,
      noOutsidePointerEvents: true,
    },
    props,
  )

  const [localProps, otherProps] = splitProps(defaultedProps, [
    'enabled',
    'children',
    'dismissOnEscapeKeyDown',
    'dismissOnOutsidePointer',
    'dismissOnOutsidePointerStrategy',
    'dismissOnOutsidePointerIgnore',
    'noOutsidePointerEvents',
    'onDismiss',
  ])

  const context = useContext(DismissibleContext) as DismissibleContextValue

  const layerId = createUniqueId()

  createEffect(() => {
    if (localProps.enabled) {
      context.onLayerShow(layerId)
    } else {
      context.onLayerDismiss(layerId)
    }
  })

  const isLastLayer = () => {
    return context.layers()[context.layers().length - 1] === layerId
  }

  createDismissible({
    dismissOnEscapeKeyDown: () =>
      access(localProps.dismissOnEscapeKeyDown) &&
      isLastLayer() &&
      localProps.enabled,
    dismissOnOutsidePointer: () =>
      access(localProps.dismissOnOutsidePointer) &&
      isLastLayer() &&
      localProps.enabled,
    dismissOnOutsidePointerStrategy: localProps.dismissOnOutsidePointerStrategy,
    dismissOnOutsidePointerIgnore: localProps.dismissOnOutsidePointerIgnore,
    noOutsidePointerEvents: () =>
      access(localProps.noOutsidePointerEvents) && localProps.enabled,
    onDismiss: (reason) => {
      localProps.onDismiss(reason)
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

  return untrack(() => resolveChildren())
}

export default DismissibleProvider
