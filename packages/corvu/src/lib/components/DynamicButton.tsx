import {
  createMemo,
  createSignal,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import Dynamic, { type DynamicAttributes } from '@lib/components/Dynamic'
import createTagName from '@lib/create/tagName'
import { isButton } from '@lib/assertions'
import { mergeRefs } from '@lib/utils'
import type { OverrideComponentProps } from '@lib/types'

const DEFAULT_DYNAMIC_BUTTON_ELEMENT = 'button'

export type DynamicButtonProps<
  T extends ValidComponent = typeof DEFAULT_DYNAMIC_BUTTON_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    ref?: (element: HTMLElement) => void
    type?: string
  }
>

/** An accessible button that sets `type` and `role` properly based on if it's a native button. */
const DynamicButton = <
  T extends ValidComponent = typeof DEFAULT_DYNAMIC_BUTTON_ELEMENT,
>(
  props: DynamicButtonProps<T>,
) => {
  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const [localProps, otherProps] = splitProps(props, ['as', 'ref', 'type'])

  const tagName = createTagName({
    element: ref,
    fallback: DEFAULT_DYNAMIC_BUTTON_ELEMENT,
  })

  const isNativeButton = createMemo(() => {
    return isButton(tagName(), localProps.type)
  })

  return (
    <Dynamic
      as={
        (localProps.as as ValidComponent | undefined) ??
        DEFAULT_DYNAMIC_BUTTON_ELEMENT
      }
      ref={mergeRefs(setRef, localProps.ref)}
      type={isNativeButton() ? 'button' : undefined}
      role={!isNativeButton() ? 'button' : undefined}
      {...otherProps}
    />
  )
}

export default DynamicButton
