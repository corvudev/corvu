import type { ApiDeclaration } from '@lib/typedoc/types/typedoc'
import type { ApiReference } from '@lib/typedoc/types/apiReferences'
import { resolveTypeTopLevel } from '@lib/typedoc/resolve/lib'

const resolveSimple = (api: ApiDeclaration, name: string): ApiReference => {
  const simpleDeclaration = api.children.find((child) => child.name === name)
  if (!simpleDeclaration || !simpleDeclaration.type) {
    throw new Error(`Simlpe declaration not found: ${name}`)
  }

  const type = resolveTypeTopLevel(simpleDeclaration.type)

  return {
    name,
    kind: 'simple',
    type: `type ${name} = ${type}`,
  }
}

export default resolveSimple
