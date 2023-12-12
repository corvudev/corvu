export type CorvuApi = {
  id: 0
  name: 'corvu'
  variant: 'project'
  kind: 1
  flags: object
  children: DeclarationVariant[]
  groups: {
    title: string
    children: number[]
  }[]
  packageName: 'corvu'
  readme: Text[]
  symbolIdMap: {
    [key: string]: {
      sourceFileName: string
      qualifiedName: string
    }
  }
}

type ParamVariant = {
  id: number
  name: string
  variant: 'param'
  kind: number
  flags: object
  type: Type
}

type SignatureVariant = {
  id: number
  name: string
  variant: 'signature'
  kind: number
  flags: object
  comment?: Comment
  sources?: Source[]
  typeParameter?: TypeParamVariant[]
  parameters: ParamVariant[]
  type: Type
  default?: Type
}

type DeclarationVariant = {
  id: number
  name: string
  variant: 'declaration'
  kind: number
  flags: object
  comment?: Comment
  children?: DeclarationVariant[]
  groups?: {
    title: string
    children: number[]
  }[]
  sources: Source[]
  signatures?: SignatureVariant[]
  typeParameters?: TypeParamVariant[]
  type?: Type
}

type TypeParamVariant = {
  id: number
  name: string
  variant: 'typeParam'
  kind: number
  flags: object
  type: Type
  default?: Type
}

type Source = {
  fileName: string
  line: number
  character: number
  url: string
}

type Comment = {
  summary: Text[]
  blockTags?: {
    tag: string
    content: Text[]
  }[]
}

type Text = {
  kind: 'text' | 'code'
  text: string
}

type Type =
  | UnionType
  | IntrinsicType
  | ReferenceType
  | LiteralType
  | IntersectionType
  | ReflectionType
  | ArrayType
  | QueryType

type UnionType = {
  type: 'union'
  types: (IntrinsicType | ReferenceType | LiteralType)[]
}

type IntrinsicType = {
  type: 'intrinsic'
  name: string
}

type ReferenceType = {
  type: 'reference'
  target:
    | {
        sourceFileName: string
        qualifiedName: string
      }
    | number
  typeArguments?: Type[]
  name: string
  refersToTypeParameter?: boolean
  package: 'typescript' | 'solid-js' | 'corvu'
}

type LiteralType = {
  type: 'literal'
  value: string
}

type IntersectionType = {
  type: 'intersection'
  types: Type[]
}

type ReflectionType = {
  type: 'reflection'
  declaration: DeclarationVariant
}

type ArrayType = {
  type: 'array'
  elementType: Type
}

type QueryType = {
  type: 'query'
  queryType: Type
}
