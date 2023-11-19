export * from './primitives'
export { default as Polymorphic, As } from '@lib/components/Polymorphic'
export { default as createControllableSignal } from '@lib/create/controllableSignal'
export { default as createDisableScroll } from '@lib/create/disableScroll'
export { default as createFocusTrap } from '@lib/create/focusTrap'
export { default as createOnce } from '@lib/create/once'
export { default as createPresence } from '@lib/create/presence'

export type {
  PolymorphicAttributes,
  PolymorphicProps,
} from '@lib/components/Polymorphic'
export type {
  MaybeAccessor,
  OverrideComponentProps,
  OverrideProps,
} from '@lib/types'
