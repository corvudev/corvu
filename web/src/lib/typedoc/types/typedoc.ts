export type ApiDeclaration = {
  id: 0
  name: string
  variant: 'project'
  kind: 1
  flags: object
  children: DeclarationVariant[]
  groups: {
    title: string
    children: number[]
  }[]
  packageName: string
  readme: Text[]
  symbolIdMap: {
    [key: string]: {
      sourceFileName: string
      qualifiedName: string
    }
  }
}

export type ParamVariant = {
  id: number
  name: string
  variant: 'param'
  kind: number
  flags: object
  type: Type
}

export type SignatureVariant = {
  id: number
  name: string
  variant: 'signature'
  kind: number
  flags: object
  comment?: Comment
  sources?: Source[]
  typeParameters?: TypeParamVariant[]
  parameters?: ParamVariant[]
  type: Type
  default?: Type
}

export type DeclarationVariant = {
  id: number
  name: string
  variant: 'declaration'
  kind: number
  flags: object
  comment?: Comment
  children?: (DeclarationVariant | ReferenceVariant)[]
  groups?: {
    title: string
    children: number[]
  }[]
  sources: Source[]
  signatures?: SignatureVariant[]
  typeParameters?: TypeParamVariant[]
  type?: Type
}

export type DeclarationVariantWithSignature = {
  id: number
  name: string
  variant: 'declaration'
  kind: number
  flags: object
  comment?: Comment
  children?: (DeclarationVariant | ReferenceVariant)[]
  groups?: {
    title: string
    children: number[]
  }[]
  sources: Source[]
  signatures: [SignatureVariant]
  typeParameters?: TypeParamVariant[]
  type?: Type
}

export type TypeParamVariant = {
  id: number
  name: string
  variant: 'typeParam'
  kind: number
  flags: object
  type?: Type
  default?: Type
}

export type ReferenceVariant = {
  id: number
  name: string
  variant: 'reference'
  kind: number
  flags: object
  soruces: Source[]
  target:
    | {
        sourceFileName: string
        qualifiedName: string
      }
    | number
}

export type Source = {
  fileName: string
  line: number
  character: number
}

export type Comment = {
  summary: Text[]
  blockTags?: {
    tag: string
    content: Text[]
  }[]
}

export type Text = {
  kind: 'text' | 'code'
  text: string
}

export type Type =
  | UnionType
  | IntrinsicType
  | ReferenceType
  | LiteralType
  | TemplateLiteralType
  | IntersectionType
  | ReflectionType
  | ArrayType
  | QueryType
  | TupleType
  | ConditionalType

export type UnionType = {
  type: 'union'
  types: (IntrinsicType | ReferenceType | LiteralType)[]
}

export type IntrinsicType = {
  type: 'intrinsic'
  name: string
}

export type ReferenceType = {
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
  package:
    | 'typescript'
    | 'solid-js'
    | '@floating-ui/utils'
    | '@floating-ui/dom'
    | '@floating-ui/core'
    | 'corvu'
    | '@internationalized/date'
}

export type LiteralType = {
  type: 'literal'
  value: string | null
}

export type TemplateLiteralType = {
  type: 'templateLiteral'
  head: string
  tail: (IntrinsicType | string)[][]
}

export type IntersectionType = {
  type: 'intersection'
  types: Type[]
}

export type ReflectionType = {
  type: 'reflection'
  declaration: DeclarationVariant
}

export type ArrayType = {
  type: 'array'
  elementType: Type
}

export type QueryType = {
  type: 'query'
  queryType: Type
}

export type TupleType = {
  type: 'tuple'
  elements: Type[]
}

export type ConditionalType = {
  type: 'conditional'
  checkType: Type
  extendsType: Type
  trueType: Type
  falseType: Type
}
