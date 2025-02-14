import {
  createMemo,
  type JSX,
  omit,
  untrack,
  type ValidComponent,
} from 'solid-js'
import type { DynamicAttributes } from '@src/dynamic'
import { Dynamic as SolidDynamic } from '@solidjs/web'

/** corvu's version of Solid's `Dynamic` component. Renders as a div by default and can be overridden with the `as` property. */
const Dynamic = <ElementProps,>(
  props: DynamicAttributes<ValidComponent> & ElementProps,
) => {
  const otherProps = omit(props, 'as')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const cached = createMemo<Function | string>(() => props.as ?? 'div')
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
