import {
  createMemo,
  type JSX,
  splitProps,
  untrack,
  type ValidComponent,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import type { OverrideComponentProps } from '@lib/types'

const DEFAULT_POLYMORPHIC_ELEMENT = 'div'

export type PolymorphicAttributes<T extends ValidComponent> = {
  /**
   * Component to render the polymorphic component as.
   * @defaultValue `div`
   */
  as?: T
}

/** Component that renders as the component provided in the `as` prop and passes all other properties. */
const Polymorphic = <
  T extends ValidComponent = typeof DEFAULT_POLYMORPHIC_ELEMENT,
>(
  props: OverrideComponentProps<T, PolymorphicAttributes<T>>,
) => {
  const [localProps, otherProps] = splitProps(props, ['as'])

  const cached = createMemo<Function | string>(
    () => localProps.as ?? DEFAULT_POLYMORPHIC_ELEMENT,
  )
  const memoizedPolymorphic = createMemo(() => {
    const component = cached()
    switch (typeof component) {
      case 'function':
        return untrack(() => component(otherProps))
      case 'string':
        return <Dynamic component={component} {...otherProps} />
    }
  })

  return memoizedPolymorphic as unknown as JSX.Element
}

export default Polymorphic
