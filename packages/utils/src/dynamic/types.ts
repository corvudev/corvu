import type { Component, ComponentProps, JSX, ValidComponent } from 'solid-js'

type DynamicAttributes<
  T extends ValidComponent,
  ElementProps extends object = object,
> = {
  /**
   * Component to render the dynamic component as.
   * @defaultValue `div`
   */
  as?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | (T extends Component<any>
        ? (
            props: Omit<ComponentProps<T>, keyof ElementProps> & ElementProps,
          ) => JSX.Element
        : T)
    | keyof JSX.HTMLElementTags
}

type OverrideProps<T, P> = Omit<T, keyof P> & P

type DynamicProps<
  T extends ValidComponent,
  Props extends object,
  ElementProps extends object = object,
> = OverrideProps<ComponentProps<T>, Props & DynamicAttributes<T, ElementProps>>

export type { DynamicAttributes, DynamicProps }
