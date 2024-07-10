import type { ApiDeclaration } from '@lib/typedoc/types/typedoc'

export type Library = {
  api: ApiDeclaration
  name: string
  items: { [name: string]: TypeSpecification }
}

export type TypeSpecification =
  | ComponentTypeSpecification
  | InheritedComponentTypeSpecification
  | ContextTypeSpecification
  | InheritedContextTypeSpecification
  | ChildrenPropsTypeSpecification
  | FunctionTypeSpecification
  | SimpleTypeSpecification
  | TemporaryTypeSpecification

export type ComponentTypeSpecification = {
  kind: 'component'
  sorting: string[]
  inherits?: {
    library: Library
    name: string
  }
}

export type InheritedComponentTypeSpecification = {
  kind: 'inherited-component'
  inherits: {
    library: Library
    name: string
  }
}

export type ContextTypeSpecification = {
  kind: 'context'
  sorting: string[]
}

export type InheritedContextTypeSpecification = {
  kind: 'inherited-context'
  inherits: {
    library: Library
    name: string
  }
}

export type ChildrenPropsTypeSpecification = {
  kind: 'childrenProps'
  sorting: string[]
  inherits?: {
    library: Library
    name: string
  }
}

export type FunctionTypeSpecification = {
  isDefaultExport?: boolean
  kind: 'function'
  propsSorting: string[]
  returnsSorting?: string[]
}

export type SimpleTypeSpecification = {
  kind: 'simple'
}

export type TemporaryTypeSpecification = {
  kind: 'temporary'
}
