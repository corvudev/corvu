import { OverrideComponentProps } from '@lib/types'
import { combineProps } from '@solid-primitives/props'
import {
  children,
  JSX,
  splitProps,
  type ValidComponent,
  For,
  Show,
  ResolvedJSXElement,
} from 'solid-js'
import { Dynamic, DynamicProps } from 'solid-js/web'

const DEFAULT_POLYMORPHIC_ELEMENT = 'div'

export type PolymorphicAttributes<T extends ValidComponent> = {
  /** Component to render the polymorphic component as. */
  as?: T
  /** Whether to render the polymorphic component as the first `<As />` component found in its children. */
  asChild?: boolean
  /** @hidden */
  children?: JSX.Element
}

export type PolymorphicProps<
  T extends ValidComponent = typeof DEFAULT_POLYMORPHIC_ELEMENT,
> = OverrideComponentProps<T, PolymorphicAttributes<T>>

const Polymorphic = <
  T extends ValidComponent = typeof DEFAULT_POLYMORPHIC_ELEMENT,
>(
  props: PolymorphicProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'asChild',
    'children',
  ])

  // eslint-disable-next-line solid/reactivity
  if (!localProps.asChild) {
    // eslint-disable-next-line solid/components-return-once
    return (
      <Dynamic
        component={localProps.as ?? DEFAULT_POLYMORPHIC_ELEMENT}
        {...otherProps}
      >
        {localProps.children}
      </Dynamic>
    )
  }

  const resolvedChildren = children(() => localProps.children).toArray()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const asComponent = resolvedChildren.find(isAsComponent) as any

  if (!asComponent) {
    throw new Error(
      '[@corvu/core]: Polymorphic component with `asChild = true` must specify the child to render as with the `As` component.',
    )
  }

  const restChildren = () => {
    return (
      <For each={resolvedChildren}>
        {(child) => (
          <Show when={child === asComponent} fallback={child}>
            {asComponent.props.children}
          </Show>
        )}
      </For>
    )
  }

  if (asComponent) {
    const asProps = asComponent.props as DynamicProps<T>

    const combinedProps = combineProps([otherProps, asProps], {
      reverseEventHandlers: true,
    })

    // eslint-disable-next-line solid/components-return-once
    return <Dynamic {...combinedProps}>{restChildren()}</Dynamic>
  }
}

const AS_COMPONENT_SYMBOL = Symbol('CorvuAsComponent')

type MaybeAsComponentType = {
  [AS_COMPONENT_SYMBOL]: boolean
  props: DynamicProps<ValidComponent>
}

export function As<T extends ValidComponent>(props: DynamicProps<T>) {
  return {
    [AS_COMPONENT_SYMBOL]: true,
    props,
  } as unknown as JSX.Element
}

const isAsComponent = (children: ResolvedJSXElement) => {
  return (
    children &&
    (children as unknown as MaybeAsComponentType)[AS_COMPONENT_SYMBOL] === true
  )
}

export default Polymorphic
