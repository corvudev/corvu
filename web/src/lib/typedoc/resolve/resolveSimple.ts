import {
  resolveObjectType,
  resolveTypeTopLevel,
} from '@lib/typedoc/resolve/lib'
import type { ApiDeclaration } from '@lib/typedoc/types/typedoc'
import type { ApiReference } from '@lib/typedoc/types/apiReferences'

const resolveSimple = (api: ApiDeclaration, name: string): ApiReference => {
  const simpleDeclaration = api.children.find((child) => child.name === name)
  if (
    !simpleDeclaration ||
    (!simpleDeclaration.type &&
      !simpleDeclaration.children &&
      !simpleDeclaration.signatures?.[0].type)
  ) {
    throw new Error(`Simple declaration not found: ${name}`)
  }

  let type
  // Since typedoc 0.28, signal accessors are variables of type `Accessor<T>` instead of functions
  if (
    simpleDeclaration.type?.type === 'reference' &&
    simpleDeclaration.type.package === 'solid-js' &&
    simpleDeclaration.type.name === 'Accessor'
  ) {
    type = resolveTypeTopLevel(
      simpleDeclaration.type.typeArguments![0],
      undefined,
      [],
    )
  } else if (simpleDeclaration.type) {
    type = resolveTypeTopLevel(simpleDeclaration.type)
  } else if (simpleDeclaration.children) {
    // Object literal type aliases have no type but carry their members as children
    type = resolveObjectType(simpleDeclaration.children)
  } else {
    type = resolveTypeTopLevel(
      simpleDeclaration.signatures![0].type,
      undefined,
      [],
    )
  }

  return {
    name,
    kind: 'simple',
    type: `type ${name} = ${type}`,
  }
}

export default resolveSimple
