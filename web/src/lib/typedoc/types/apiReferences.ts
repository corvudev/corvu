import type { Library } from '@lib/typedoc/types/specifications'

export type ApiReference =
  | ComponentApiReference
  | InheritedComponentApiReference
  | ContextApiReference
  | InheritedContextApiReference
  | ChildrenPropsApiReference
  | FunctionApiReference
  | SimpleApiReference

export type ComponentApiReference = {
  name: string
  kind: 'component'
  descriptionHtml: string
  inherits: {
    library: Library
    name: string
  } | null
  props: PropType[]
  data: Tag[]
  css: Tag[]
}

export type InheritedComponentApiReference = {
  name: string
  kind: 'inherited-component'
  descriptionHtml: string
  inherits: {
    library: Library
    name: string
  }
  data: Tag[]
  css: Tag[]
}

export type ContextApiReference = {
  name: string
  kind: 'context'
  descriptionHtml: string
  returns: ReturnType[]
}

export type InheritedContextApiReference = {
  name: string
  kind: 'inherited-context'
  descriptionHtml: string
  inherits: {
    library: Library
    name: string
  }
}

export type ChildrenPropsApiReference = {
  name: string
  kind: 'childrenProps'
  descriptionHtml: string
  inherits: {
    library: Library
    name: string
  } | null
  props: ReturnType[]
}

export type FunctionApiReference = {
  name: string
  kind: 'function'
  props: PropType[]
  returns: ReturnType[] | null
}

export type SimpleApiReference = {
  name: string
  kind: 'simple'
  type: string
}

export type PropType = {
  name: string
  defaultHtml: string | null
  type: string
  descriptionHtml: string
  isFunction: boolean
}

export type Tag = {
  name: string
  descriptionHtml: string
}

export type ReturnType = {
  name: string
  type: string
  descriptionHtml: string
  isFunction: boolean
}
