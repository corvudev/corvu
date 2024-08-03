import type { ApiDeclaration } from '@lib/typedoc/types/typedoc'
import type { ApiReference } from '@lib/typedoc/types/apiReferences'
import { resolveTypeTopLevel } from '@lib/typedoc/resolve/lib'

const resolveSimple = (api: ApiDeclaration, name: string): ApiReference => {
  const simpleDeclaration = api.children.find((child) => child.name === name)
  if (
    !simpleDeclaration ||
    (!simpleDeclaration.type && !simpleDeclaration.signatures?.[0].type)
  ) {
    throw new Error(`Simple declaration not found: ${name}`)
  }

  let type
  if (simpleDeclaration.type) {
    type = resolveTypeTopLevel(simpleDeclaration.type)
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
