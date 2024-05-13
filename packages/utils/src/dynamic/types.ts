import type { ComponentProps, JSX, ValidComponent } from 'solid-js'

type DynamicAttributes<T extends ValidComponent> = {
  /**
   * Component to render the dynamic component as.
   * @defaultValue `div`
   */
  as?: T | keyof JSX.HTMLElementTags
}

type OverrideComponentProps<T extends ValidComponent, Props> = OverrideProps<
  ComponentProps<T>,
  Props
>
type OverrideProps<T, P> = Omit<T, keyof P> & P

export type { DynamicAttributes, OverrideComponentProps, OverrideProps }
