import {
  createMemo,
  type JSX,
  splitProps,
  untrack,
  type ValidComponent,
} from 'solid-js'
import type { DynamicAttributes } from '@src/dynamic'
import { Dynamic as SolidDynamic } from 'solid-js/web'

const DEFAULT_DYNAMIC_ELEMENT = 'div'

/** corvu's version of Solid's `Dynamic` component. Renders as a div by default and can be overridden with the `as` property. */
const Dynamic = <ElementProps,>(
  props: DynamicAttributes<ValidComponent> & ElementProps,
) => {
  const [localProps, otherProps] = splitProps(props, ['as'])

  const cached = createMemo<Function | string>(
    () => localProps.as ?? DEFAULT_DYNAMIC_ELEMENT,
  )
  const memoizedDynamic = createMemo(() => {
    const component = cached()
    switch (typeof component) {
      case 'function':
        return untrack(() => component(otherProps))
      case 'string':
        return <SolidDynamic component={component} {...otherProps} />
    }
  })

  return memoizedDynamic as unknown as JSX.Element
}

export default Dynamic
