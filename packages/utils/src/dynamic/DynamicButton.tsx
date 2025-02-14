import { createMemo, createSignal, omit, type ValidComponent } from 'solid-js'
import type { ElementOf, Ref } from '@src/dom'
import createTagName from '@src/create/tagName'
import Dynamic from '@src/dynamic/Dynamic'
import type { DynamicProps } from '@src/dynamic/types'
import { isButton } from '@src/assertions'
import { mergeRefs } from '@src/reactivity'

export type DynamicButtonSharedElementProps<
  T extends ValidComponent = 'button',
> = {
  ref: Ref<ElementOf<T>>
  type: string | undefined
}

export type DynamicButtonElementProps = DynamicButtonSharedElementProps & {
  role: 'button' | undefined
}

export type DynamicButtonProps<T extends ValidComponent = 'button'> = Partial<
  DynamicButtonSharedElementProps<T>
>

/** An accessible button that sets `type` and `role` properly based on if it's a native button. */
const DynamicButton = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, DynamicButtonProps<T>>,
) => {
  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const otherProps = omit(props as DynamicButtonProps<'button'>, 'ref', 'type')

  const tagName = createTagName({
    element: ref,
    fallback: 'button',
  })

  const memoizedIsButton = createMemo(() => {
    return isButton(tagName(), props.type)
  })

  return (
    <Dynamic<DynamicButtonElementProps>
      as="button"
      // === SharedElementProps ===
      ref={mergeRefs(setRef, props.ref as Ref<HTMLButtonElement>)}
      type={memoizedIsButton() ? 'button' : undefined}
      // === ElementProps ===
      role={!memoizedIsButton() ? 'button' : undefined}
      {...otherProps}
    />
  )
}

export default DynamicButton
