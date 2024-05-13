import {
  createMemo,
  createSignal,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import createTagName from '@src/create/tagName'
import Dynamic from '@src/dynamic/Dynamic'
import type { DynamicProps } from '@src/dynamic/types'
import { isButton } from '@src/assertions'
import { mergeRefs } from '@src/reactivity'
import type { Ref } from '@src/dom'

const DEFAULT_DYNAMIC_BUTTON_ELEMENT = 'button'

export type DynamicButtonSharedElementProps = {
  ref: Ref
  type: 'button' | 'submit' | 'reset' | undefined
}

export type DynamicButtonElementProps = DynamicButtonSharedElementProps & {
  role: 'button' | undefined
}

export type DynamicButtonProps = Partial<DynamicButtonSharedElementProps>

/** An accessible button that sets `type` and `role` properly based on if it's a native button. */
const DynamicButton = <
  T extends ValidComponent = typeof DEFAULT_DYNAMIC_BUTTON_ELEMENT,
>(
  props: DynamicProps<T, DynamicButtonProps, DynamicButtonElementProps>,
) => {
  const [ref, setRef] = createSignal<HTMLElement | null>(null)

  const [localProps, otherProps] = splitProps(props, ['ref', 'type'])

  const tagName = createTagName({
    element: ref,
    fallback: DEFAULT_DYNAMIC_BUTTON_ELEMENT,
  })

  const memoizedIsButton = createMemo(() => {
    return isButton(tagName(), localProps.type)
  })

  return (
    <Dynamic<DynamicButtonElementProps>
      // === SharedElementProps ===
      ref={mergeRefs(setRef, localProps.ref)}
      type={memoizedIsButton() ? 'button' : undefined}
      // === ElementProps ===
      role={!memoizedIsButton() ? 'button' : undefined}
      {...otherProps}
    />
  )
}

export default DynamicButton
