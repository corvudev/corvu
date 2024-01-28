import {
  children,
  createMemo,
  For,
  type JSX,
  type ResolvedJSXElement,
  Show,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from 'solid-js/web'
import { combineProps } from '@solid-primitives/props'
import type { OverrideComponentProps } from '@lib/types'

const DEFAULT_POLYMORPHIC_ELEMENT = 'div'

export type PolymorphicAttributes<T extends ValidComponent> = {
  /**
   * Component to render the polymorphic component as.
   * @defaultValue `div`
   */
  as?: T
  /**
   * Whether to render the polymorphic component as the first `<As />` component found in its children.
   * @defaultValue `false`
   */
  asChild?: boolean
  /** @hidden */
  children?: JSX.Element
}

export type PolymorphicProps<
  T extends ValidComponent = typeof DEFAULT_POLYMORPHIC_ELEMENT,
> = OverrideComponentProps<T, PolymorphicAttributes<T>>

/** Component, which either renders as the component provided in the `as` prop or, if `asChild` is set to `true`, as the first `<As />` component found in its children. */
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

  const resolvedChildren = children(() => localProps.children)

  const asComponent = createMemo(() => {
    return resolvedChildren.toArray().find(isAsComponent) as
      | AsComponent
      | undefined
  })

  const restChildren = createMemo(() => {
    const _asComponent = asComponent()

    return (
      <For each={resolvedChildren.toArray()}>
        {(child) => (
          <Show when={child === _asComponent} fallback={child}>
            {_asComponent?.props.children}
          </Show>
        )}
      </For>
    )
  })

  const resolvedPolymorphic = createMemo(() => {
    if (!localProps.asChild) {
      return (
        <Dynamic
          component={localProps.as ?? DEFAULT_POLYMORPHIC_ELEMENT}
          {...otherProps}
        >
          {resolvedChildren()}
        </Dynamic>
      )
    }

    const _asComponent = asComponent()

    if (!_asComponent) {
      throw new Error(
        '[corvu]: Polymorphic component with `asChild = true` must specify the child to render as with the `As` component.',
      )
    }

    const asProps = _asComponent.props as DynamicProps<T>

    const combinedProps = combineProps([otherProps, asProps], {
      reverseEventHandlers: true,
    })

    // TODO: Fix type error
    // @ts-expect-error: Typescript v5.3 broke this. Works in <=v5.2
    return <Dynamic {...combinedProps}>{restChildren()}</Dynamic>
  })

  return resolvedPolymorphic as unknown as JSX.Element
}

const AS_COMPONENT_SYMBOL = Symbol('CorvuAsComponent')

type AsComponent = {
  [AS_COMPONENT_SYMBOL]: true
  props: DynamicProps<ValidComponent>
}

/** Dynamic component which the parent <Polymorphic> component should render as. */
export const As = <T extends ValidComponent>(props: DynamicProps<T>) => {
  return {
    [AS_COMPONENT_SYMBOL]: true,
    props,
  } as unknown as JSX.Element
}

const isAsComponent = (children: ResolvedJSXElement) => {
  return (
    !!children && !!(children as unknown as AsComponent)[AS_COMPONENT_SYMBOL]
  )
}

export default Polymorphic
