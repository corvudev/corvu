import { isButton } from '@lib/assertions'
import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import createTagName from '@lib/create/tagName'
import { OverrideComponentProps } from '@lib/types'
import { mergeRefs } from '@lib/utils'
import { ValidComponent, createMemo, createSignal, splitProps } from 'solid-js'

const DEFAULT_POLYMORPHIC_BUTTON_ELEMENT = 'button'

export type PolymorphicButtonProps<
  T extends ValidComponent = typeof DEFAULT_POLYMORPHIC_BUTTON_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    ref?: (element: HTMLElement) => void
    type?: string
  }
>

const PolymorphicButton = <
  T extends ValidComponent = typeof DEFAULT_POLYMORPHIC_BUTTON_ELEMENT,
>(
  props: PolymorphicButtonProps<T>,
) => {
  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const [localProps, otherProps] = splitProps(props, ['as', 'ref', 'type'])

  const tagName = createTagName({
    element: ref,
    fallback: DEFAULT_POLYMORPHIC_BUTTON_ELEMENT,
  })

  const isNativeButton = createMemo(() => {
    return isButton(tagName(), localProps.type)
  })

  return (
    <Polymorphic
      as={
        localProps.as ?? (DEFAULT_POLYMORPHIC_BUTTON_ELEMENT as ValidComponent)
      }
      ref={mergeRefs(setRef, localProps.ref)}
      type={isNativeButton() ? 'button' : undefined}
      role={!isNativeButton() ? 'button' : undefined}
      {...otherProps}
    />
  )
}

export default PolymorphicButton
