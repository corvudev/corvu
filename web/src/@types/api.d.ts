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

type DeclarationVariantWithSignature = {
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

type TypeParamVariant = {
  id: number
  name: string
  variant: 'typeParam'
  kind: number
  flags: object
  type: Type
  default?: Type
}

type ReferenceVariant = {
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
  | TupleType

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
  value: string | null
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

type TupleType = {
  type: 'tuple'
  elements: Type[]
}
