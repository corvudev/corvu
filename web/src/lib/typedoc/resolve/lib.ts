import type {
  DeclarationVariant,
  ParamVariant,
  ReferenceType,
  Text,
  Type,
} from '@lib/typedoc/types/typedoc'
import { Typedoc } from '@lib/typedoc/libraries'

const resolveDenyList = ['Side', 'Size', 'FloatingOptions', 'FloatingState']

const resolveReferenceType = (
  type: ReferenceType,
): DeclarationVariant | string => {
  if (type.refersToTypeParameter === true) return type.name
  if (resolveDenyList.includes(type.name)) {
    return type.name
  }
  if (typeof type.target !== 'number') {
    switch (type.package) {
      case 'solid-js':
        return type.name
      case 'typescript':
        return type.name
      case '@floating-ui/utils':
        return type.name
      case '@floating-ui/dom':
        return type.name
      case '@floating-ui/core':
        return type.name
    }
    const api = Typedoc[type.package]
    const declaration = findDeclarationByName(api.name, api.children)

    if (!declaration) {
      // TODO: DisclosureRootProps -> RootProps etc.
      throw new Error(
        `Declaration with Name ${type.name} not found. Probably shouldn't arrive here as these are inherited props :P`,
      )
    }

    return declaration
  }
  const api = Typedoc[type.package]
  const declaration = findDeclarationById(type.target, api.children)
  if (!declaration) {
    throw new Error(`Declaration with ID ${type.target} not found`)
  }

  return declaration
}

const findDeclarationByName = (
  name: string,
  scope: DeclarationVariant[],
): DeclarationVariant | undefined => {
  for (const declaration of scope) {
    if (declaration.name === name) {
      return declaration
    }

    if (declaration.children) {
      const foundDeclaration = findDeclarationByName(
        name,
        declaration.children as DeclarationVariant[],
      )
      if (foundDeclaration) {
        return foundDeclaration
      }
    }
  }

  return undefined
}

const findDeclarationById = (
  id: number,
  scope: DeclarationVariant[],
): DeclarationVariant | undefined => {
  for (const declaration of scope) {
    if (declaration.id === id) {
      return declaration
    }

    if (declaration.children) {
      const foundDeclaration = findDeclarationById(
        id,
        declaration.children as DeclarationVariant[],
      )
      if (foundDeclaration) {
        return foundDeclaration
      }
    }
  }

  return undefined
}

// Resolve type but don't resolve references
const resolveTypeTopLevel = (
  type: Type,
  nestLevel = 1,
  parameters?: ParamVariant[],
): string => {
  let typeName = ''
  if (parameters) {
    const params: {
      name: string
      type: string
    }[] = []
    for (const parameter of parameters) {
      params.push({
        name: parameter.name,
        type: resolveTypeTopLevel(parameter.type, nestLevel),
      })
    }
    typeName += `(${params
      .map((param) => `${param.name}: ${param.type}`)
      .join(', ')}) => `
  }

  switch (type.type) {
    case 'intrinsic':
      typeName += type.name
      break
    case 'literal':
      typeName += `${type.value === null ? 'null' : `'${type.value}'`}`
      break
    case 'union':
      typeName += type.types
        .map((type) => resolveTypeTopLevel(type, nestLevel))
        .join(' | ')
      break
    case 'reference':
      const argumentNames = []
      for (const argument of type.typeArguments ?? []) {
        argumentNames.push(resolveTypeTopLevel(argument, nestLevel))
      }
      if (argumentNames.length > 0) {
        typeName += `${type.name}<${argumentNames.join(', ')}>`
      } else {
        // The child function of the drawer root component accepts both the drawer and dialog children props.
        // Use their original name to avoid confusion.
        if (type.name.endsWith('RootChildrenProps')) {
          return type.name
        }
        const resolvedReference = resolveReferenceType(type)
        if (typeof resolvedReference === 'string') {
          typeName += resolvedReference
        } else {
          typeName += resolvedReference.name
        }
      }
      break
    case 'intersection':
      typeName += type.types
        .map((type) => resolveTypeTopLevel(type, nestLevel))
        .join(' & ')
      break
    case 'reflection':
      if (!type.declaration.signatures) {
        // Yeah, pretty ugly. No signatures = object type
        typeName += '{\n'
        for (const child of type.declaration.children!) {
          if (child.variant !== 'declaration') {
            throw new Error(`Missing type for the ${child.name} prop`)
          }
          typeName += `${'  '.repeat(nestLevel)}${child.name}: ${resolveTypeTopLevel(child.type!, nestLevel + 1)},\n`
        }
        typeName += `${'  '.repeat(nestLevel - 1)}}`
        break
      }
      const resolvedType = resolveTypeTopLevel(
        type.declaration.signatures![0].type,
        nestLevel,
        type.declaration.signatures![0].parameters,
      )
      typeName += resolvedType
      break
    case 'array':
      if (type.elementType.type === 'intrinsic') {
        typeName += resolveTypeTopLevel(type.elementType, nestLevel)
        typeName += '[]'
        break
      } else if (type.elementType.type === 'union') {
        typeName += '['
        typeName += resolveTypeTopLevel(type.elementType, nestLevel)
        typeName += ']'
        break
      } else if (type.elementType.type === 'reference') {
        typeName += resolveTypeTopLevel(type.elementType, nestLevel)
        typeName += '[]'
        break
      } else if (type.elementType.type === 'reflection') {
        typeName += resolveTypeTopLevel(type.elementType, nestLevel)
        typeName += '[]'
        break
      } else if (type.elementType.type === 'array') {
        typeName += resolveTypeTopLevel(type.elementType, nestLevel)
        typeName += '[]'
        break
      } else {
        throw new Error(
          `Unexpected array element type ${type.elementType.type}`,
        )
      }
    case 'query':
      typeName += resolveTypeTopLevel(type.queryType, nestLevel)
      break
    case 'tuple':
      typeName += '['
      typeName += type.elements
        .map((type) => resolveTypeTopLevel(type, nestLevel))
        .join(', ')
      typeName += ']'
      break
    case 'templateLiteral':
      typeName += '`'
      for (const tail of type.tail) {
        for (const part of tail) {
          if (typeof part === 'string') {
            typeName += part
          } else {
            typeName += `\$\{${resolveTypeTopLevel(part, nestLevel)}\}`
          }
        }
      }
      typeName += '`'
      break
    default:
      // @ts-expect-error: Could happen that we didn't cover all types
      throw new Error(`Unexpected type ${type.type!}`)
  }
  return typeName
}

const getDefaultValue = (comment?: DeclarationVariant['comment']) => {
  if (!comment || !comment.blockTags) {
    return null
  }
  const defaultTag = comment.blockTags.find(
    (tag) => tag.tag === '@defaultValue',
  )
  if (!defaultTag) {
    return null
  }
  return formatText(defaultTag.content)
}

const formatText = (text?: Text[]) => {
  if (!text) {
    return ''
  }

  let html = ''
  for (const part of text) {
    const text = part.text.replace('<', '&lt;').replace('>', '&gt;')
    switch (part.kind) {
      case 'text':
        const textParts = text.split('\n\n')
        html += textParts.join('<br />')
        break
      case 'code':
        if (text.startsWith('```ts')) {
          html += `<code>${text.slice(6, -4)}</code>`
        } else {
          html += `<code>${text.slice(1, -1)}</code>`
        }
        break
      default:
        throw new Error(`Unknown text kind: ${part.kind}`)
    }
  }

  return html
}

export {
  resolveReferenceType,
  resolveTypeTopLevel,
  getDefaultValue,
  formatText,
}
