import type { ComponentProps, JSX, ValidComponent } from 'solid-js'

type DynamicAttributes<T extends ValidComponent> = {
  /**
   * Component to render the dynamic component as.
   * @defaultValue `div`
   */
  as?: T | keyof JSX.HTMLElementTags
}

type OverrideProps<T, P> = Omit<T, keyof P> & P

type DynamicProps<
  T extends ValidComponent,
  Props extends object,
> = OverrideProps<ComponentProps<T>, Props & DynamicAttributes<T>>

export type { DynamicAttributes, DynamicProps }
