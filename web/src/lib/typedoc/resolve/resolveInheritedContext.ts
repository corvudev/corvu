import type { ApiDeclaration } from '@lib/typedoc/types/typedoc'
import type { ApiReference } from '@lib/typedoc/types/apiReferences'
import { formatText } from '@lib/typedoc/resolve/lib'
import type { InheritedContextTypeSpecification } from '@lib/typedoc/types/specifications'

const resolveInheritedContext = (
  api: ApiDeclaration,
  name: string,
  inheritedContext: InheritedContextTypeSpecification,
): ApiReference => {
  const contextDeclaration = api.children.find((child) => child.name === name)
  if (!contextDeclaration) {
    throw new Error(`Context declaration not found: ${name}`)
  }
  return {
    name,
    kind: 'inherited-context',
    descriptionHtml: formatText(contextDeclaration.comment?.summary),
    inherits: inheritedContext.inherits,
  }
}

export default resolveInheritedContext
