import type { ApiDeclaration, Comment } from '@lib/typedoc/types/typedoc'
import type { ApiReference, Tag } from '@lib/typedoc/types/apiReferences'
import { formatText } from '@lib/typedoc/resolve/lib'
import type { InheritedComponentTypeSpecification } from '@lib/typedoc/types/specifications'

const resolveInheritedComponent = (
  api: ApiDeclaration,
  name: string,
  inheritedComponent: InheritedComponentTypeSpecification,
): ApiReference => {
  const componentDeclaration = api.children.find((child) => child.name === name)
  if (!componentDeclaration) {
    throw new Error(`Component declaration not found: ${name}`)
  }
  const dataTags = getTags('data', componentDeclaration.comment)
  const cssTags = getTags('css', componentDeclaration.comment)

  return {
    name,
    kind: 'inherited-component',
    descriptionHtml: formatText(componentDeclaration.comment?.summary),
    inherits: inheritedComponent.inherits,
    data: dataTags,
    css: cssTags,
  }
}

const getTags = (name: 'data' | 'css', comment?: Comment): Tag[] => {
  if (!comment || !comment.blockTags) {
    return []
  }
  const dataTags = comment.blockTags.filter((tag) => tag.tag === `@${name}`)
  return dataTags.map((dataTag) => {
    return {
      name: dataTag.content[0].text.slice(1, -1),
      descriptionHtml: formatText(dataTag.content.slice(1)).replace(' - ', ''),
    }
  })
}

export default resolveInheritedComponent
