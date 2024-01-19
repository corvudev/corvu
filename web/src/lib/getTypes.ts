import apiJson from '@assets/api.json'
import {
  type ComponentSpecifications,
  componentSpecifications,
  utilitySpecifications,
  type UtilitySpecifications,
} from '@lib/apiSpecifications'
import type {
  CorvuApi,
  DeclarationVariant,
  ParamVariant,
  ReferenceType,
  Type,
  Text,
  ReflectionType,
  ReferenceVariant,
  DeclarationVariantWithSignature,
  LiteralType,
} from 'src/@types/api'

const corvuApi = apiJson as CorvuApi
const corvuApiIndex = corvuApi.children.find((child) => child.name === 'index')!

export type ApiReference = {
  type: 'component' | 'context' | 'function' | 'type'
  name: string
  descriptionHtml?: string
  parts: {
    name: string
    description?: string
    props: ApiType[]
  }[]
}

type ApiType = {
  name: string
  type?: string
  defaultHtml?: string
  descriptionHtml: string
  displayType?: 'property' | 'function' | 'data' | 'children'
}

const getComponent = (componentName: ComponentSpecifications) => {
  const { exportName, components, contexts, types } =
    componentSpecifications[componentName]

  const parentDeclaration = corvuApi.children.find(
    (child) => child.name === exportName,
  )

  if (!parentDeclaration || !parentDeclaration.children) {
    throw new Error(`${exportName} type not found`)
  }

  const apiReferences: ApiReference[] = []

  for (const component of components) {
    const componentDeclaration = findDeclaration(
      parentDeclaration,
      component.name,
    )

    let apiTypes = resolveComponent(componentDeclaration)
    // Insert zero width space to prevent components rendering as
    apiTypes = apiTypes.map((apiType) => {
      apiType.defaultHtml = replaceElements(apiType.defaultHtml)
      apiType.descriptionHtml = replaceElements(apiType.descriptionHtml)!
      return apiType
    })

    const dataTags = getDataTags(componentDeclaration.signatures[0].comment)
    const cssTags = getCssTags(componentDeclaration.signatures[0].comment)
    const apiReference: ApiReference = {
      type: 'component',
      name: `${componentName}.${component.name}`,
      descriptionHtml: formatText(
        componentDeclaration.signatures[0].comment?.summary,
      ),
      parts: [],
    }
    apiReference.parts.push({
      name: 'Props',
      props: apiTypes.sort((a, b) => {
        const aIndex = component.forcedSorting?.indexOf(a.name)
        const bIndex = component.forcedSorting?.indexOf(b.name)
        if (aIndex !== undefined && bIndex !== undefined) {
          return aIndex - bIndex
        }
        if (aIndex !== undefined) {
          return -1
        }
        if (bIndex !== undefined) {
          return 1
        }
        return a.name.localeCompare(b.name)
      }),
    })
    if (dataTags) {
      apiReference.parts.push({
        name: 'Data',
        description: `Data attributes present on ${componentName}.${component.name} components.`,
        props: dataTags,
      })
    }
    if (cssTags) {
      apiReference.parts.push({
        name: 'CSS props',
        description: `CSS properties attributes present on ${componentName}.${component.name} components.`,
        props: cssTags,
      })
    }

    apiReferences.push(apiReference)
  }

  for (const context of contexts) {
    const contextDeclaration = findDeclaration(parentDeclaration, context.name)

    let apiTypes = resolveContext(contextDeclaration)
    // Insert zero width space to prevent components rendering as
    apiTypes = apiTypes.map((apiType) => {
      apiType.defaultHtml = replaceElements(apiType.defaultHtml)
      apiType.descriptionHtml = replaceElements(apiType.descriptionHtml)!
      return apiType
    })

    const apiReference: ApiReference = {
      type: 'context',
      name: `${componentName}.${context.name}`,
      descriptionHtml: formatText(
        contextDeclaration.signatures![0].comment?.summary,
      ),
      parts: [],
    }
    apiReference.parts.push({
      name: 'Returns',
      props: apiTypes.sort((a, b) => {
        const aIndex = context.forcedSorting?.indexOf(a.name)
        const bIndex = context.forcedSorting?.indexOf(b.name)
        if (aIndex !== undefined && bIndex !== undefined) {
          return aIndex - bIndex
        }
        if (aIndex !== undefined) {
          return -1
        }
        if (bIndex !== undefined) {
          return 1
        }
        return a.name.localeCompare(b.name)
      }),
    })

    apiReferences.push(apiReference)
  }

  for (const type of types) {
    let typeDeclaration = parentDeclaration.children.find(
      (c) => c.name === type.name,
    )
    if (!typeDeclaration) {
      throw new Error(`${componentName}.${type.name} not found`)
    }

    typeDeclaration = typeDeclaration as DeclarationVariant

    let apiTypes = resolveType(typeDeclaration)
    // Insert zero width space to prevent components rendering as
    apiTypes = apiTypes.map((apiType) => {
      apiType.defaultHtml = replaceElements(apiType.defaultHtml)
      apiType.descriptionHtml = replaceElements(apiType.descriptionHtml)!
      return apiType
    })

    const apiReference: ApiReference = {
      type: 'type',
      name: `${componentName}.${type.name}`,
      descriptionHtml: formatText(typeDeclaration.comment?.summary),
      parts: [],
    }
    apiReference.parts.push({
      name: 'Props',
      props: apiTypes.sort((a, b) => {
        const aIndex = type.forcedSorting?.indexOf(a.name)
        const bIndex = type.forcedSorting?.indexOf(b.name)
        if (aIndex !== undefined && bIndex !== undefined) {
          return aIndex - bIndex
        }
        if (aIndex !== undefined) {
          return -1
        }
        if (bIndex !== undefined) {
          return 1
        }
        return a.name.localeCompare(b.name)
      }),
    })

    apiReferences.push(apiReference)
  }

  return apiReferences
}

const resolveComponent = (component: DeclarationVariant) => {
  let defaultAs: string | undefined

  // Generic components are Polymorphic components.
  if (component.signatures![0].typeParameter && component.name !== 'As') {
    if (
      !component.signatures![0].typeParameter[0] ||
      !component.signatures![0].typeParameter[0].default
    ) {
      throw new Error(
        `Missing default type parameter for the ${component.name} component`,
      )
    }
    if (
      component.signatures![0].typeParameter[0].default.type === 'literal' &&
      component.signatures![0].typeParameter[0].default.value
    ) {
      defaultAs = component.signatures![0].typeParameter[0].default.value
    } else if (
      component.signatures![0].typeParameter[0].default.type === 'reference'
    ) {
      defaultAs = component.signatures![0].typeParameter[0].default.name
    } else {
      throw new Error(
        `Missing default type parameter for the ${component.name} component`,
      )
    }
  }

  // Components always have their props inside a separate type
  const referenceType = component.signatures![0].parameters[0].type

  if (referenceType.type !== 'reference') {
    throw new Error(`Missing type for the ${component.name} component`)
  }

  const propDeclaration = resolveReference(referenceType)

  if (typeof propDeclaration === 'string') {
    return [
      {
        name: 'props',
        type: propDeclaration,
        descriptionHtml: '',
        displayType: 'property',
      },
    ] as ApiType[]
  }

  if (!propDeclaration.type) {
    throw new Error(`Missing props for the ${component.name} component`)
  }

  const apiTypes: ApiType[] = []

  if (propDeclaration.type.type === 'reflection') {
    apiTypes.push(...getReflectionProps(propDeclaration.type))
  }
  if (propDeclaration.type.type === 'reference') {
    const typeArgument = propDeclaration.type.typeArguments?.[1]
    if (!typeArgument) {
      throw new Error(
        `Missing type argument for the ${component.name} component`,
      )
    }
    if (typeArgument.type === 'reference') {
      const propDeclaration = resolveReference(typeArgument)
      if (
        typeof propDeclaration === 'string' ||
        !propDeclaration.type ||
        propDeclaration.type.type !== 'reflection'
      ) {
        throw new Error(`Missing props for the ${component.name} component`)
      }
      apiTypes.push(...getReflectionProps(propDeclaration.type))
    }
    if (typeArgument.type === 'reflection') {
      apiTypes.push(...getReflectionProps(typeArgument))
    }
    if (typeArgument.type === 'intersection') {
      for (const type of typeArgument.types) {
        switch (type.type) {
          case 'reference':
            if (type.name === 'Omit') {
              const allProps = getReflectionProps(
                (
                  resolveReference(
                    type.typeArguments![0] as ReferenceType,
                  ) as DeclarationVariant
                ).type as ReflectionType,
              )
              const omittedProps =
                type.typeArguments![1].type === 'union'
                  ? type.typeArguments![1].types.map(
                      (type) => (type as LiteralType).value,
                    )
                  : [(type.typeArguments![1] as LiteralType).value]

              apiTypes.push(
                ...allProps.filter((prop) => !omittedProps.includes(prop.name)),
              )
              break
            }
            const resolvedReference = resolveReference(type)
            if (
              typeof resolvedReference === 'string' ||
              !resolvedReference.type ||
              resolvedReference.type.type !== 'reflection'
            ) {
              throw new Error(
                `Missing props for the ${component.name} component`,
              )
            }
            apiTypes.push(...getReflectionProps(resolvedReference.type))
            break
          case 'reflection':
            if (type.declaration.children) {
              apiTypes.push(...getReflectionProps(type))
            }
            break
          default:
            throw new Error(
              `Unexpected type ${type.type} for the ${component.name} component`,
            )
        }
      }
    }
  }
  if (propDeclaration.type.type === 'intersection') {
    // Currently, only the drawer root component has an intersection type. We only want the first type.
    apiTypes.push(
      ...getReflectionProps(propDeclaration.type.types[0] as ReflectionType),
    )
  }

  const asProps = apiTypes.find((prop) => prop.name === 'as')

  if (asProps) {
    asProps.defaultHtml = `<code>${defaultAs}</code>`
    asProps.type = 'ValidComponent'
  }

  return apiTypes
}

const resolveContext = (context: DeclarationVariant) => {
  // Contexts always have their props inside a separate type
  const referenceType = context.signatures![0].type

  if (referenceType.type !== 'reference') {
    throw new Error(`Missing type for the ${context.name} component`)
  }

  const propDeclaration = resolveReference(referenceType)

  if (typeof propDeclaration === 'string' || !propDeclaration.type) {
    throw new Error(`Missing props for the ${context.name} component`)
  }

  const apiTypes: ApiType[] = []

  if (propDeclaration.type.type === 'reflection') {
    apiTypes.push(...getReflectionProps(propDeclaration.type))
  }

  return apiTypes
}

const resolveType = (type: DeclarationVariant) => {
  if (!type.type || type.type.type !== 'reflection') {
    throw new Error(`Missing type for the ${type.name} type`)
  }

  const apiTypes = getReflectionProps(type.type)

  return apiTypes
}

const getUtility = (utilityName: UtilitySpecifications) => {
  const { components, functions } = utilitySpecifications[utilityName]

  const apiReferences: ApiReference[] = []

  if (components) {
    for (const component of components) {
      const componentDeclaration = findDeclaration(
        corvuApiIndex,
        component.name,
      )

      let apiTypes = resolveComponent(componentDeclaration)
      // Insert zero width space to prevent components rendering as
      apiTypes = apiTypes.map((apiType) => {
        apiType.defaultHtml = replaceElements(apiType.defaultHtml)
        apiType.descriptionHtml = replaceElements(apiType.descriptionHtml)!
        return apiType
      })

      const dataTags = getDataTags(componentDeclaration.signatures![0].comment)
      const apiReference: ApiReference = {
        type: 'component',
        name: component.name,
        descriptionHtml: replaceElements(
          formatText(componentDeclaration.signatures![0].comment?.summary),
        ),
        parts: [],
      }
      apiReference.parts.push({
        name: 'Props',
        props: apiTypes.sort((a, b) => {
          const aIndex = component.forcedSorting?.indexOf(a.name)
          const bIndex = component.forcedSorting?.indexOf(b.name)
          if (aIndex !== undefined && bIndex !== undefined) {
            return aIndex - bIndex
          }
          if (aIndex !== undefined) {
            return -1
          }
          if (bIndex !== undefined) {
            return 1
          }
          return a.name.localeCompare(b.name)
        }),
      })
      if (dataTags) {
        apiReference.parts.push({
          name: 'Data',
          description: `Data attributes present on ${component.name} components.`,
          props: dataTags,
        })
      }

      apiReferences.push(apiReference)
    }
  }

  if (functions) {
    for (const functionSpec of functions) {
      let typeDeclaration = corvuApiIndex.children!.find(
        (c) => c.name === functionSpec.name,
      )
      if (!typeDeclaration) {
        throw new Error(`${functionSpec.name} not found`)
      }

      typeDeclaration = typeDeclaration as DeclarationVariant

      let apiTypes = resolveFunctionProps(typeDeclaration)
      // Insert zero width space to prevent components rendering as
      apiTypes = apiTypes.map((apiType) => {
        apiType.defaultHtml = replaceElements(apiType.defaultHtml)
        apiType.descriptionHtml = replaceElements(apiType.descriptionHtml)!
        return apiType
      })

      const apiReference: ApiReference = {
        type: 'function',
        name: functionSpec.name,
        descriptionHtml: formatText(
          typeDeclaration.signatures![0].comment?.summary,
        ),
        parts: [],
      }
      apiReference.parts.push({
        name: 'Props',
        props: apiTypes.sort((a, b) => {
          const aIndex = functionSpec.forcedSorting?.indexOf(a.name)
          const bIndex = functionSpec.forcedSorting?.indexOf(b.name)
          if (aIndex !== undefined && bIndex !== undefined) {
            return aIndex - bIndex
          }
          if (aIndex !== undefined) {
            return -1
          }
          if (bIndex !== undefined) {
            return 1
          }
          return a.name.localeCompare(b.name)
        }),
      })

      let apiReturns = resolveFunctionReturns(typeDeclaration)
      // Insert zero width space to prevent components rendering as
      apiReturns = apiReturns.map((apiReturn) => {
        apiReturn.defaultHtml = replaceElements(apiReturn.defaultHtml)
        apiReturn.descriptionHtml = replaceElements(apiReturn.descriptionHtml)!
        return apiReturn
      })

      if (!(apiReturns.length === 1 && apiReturns[0].type === 'void')) {
        apiReference.parts.push({
          name: 'Returns',
          props: apiReturns.sort((a, b) => {
            const aIndex = functionSpec.forcedSorting?.indexOf(a.name)
            const bIndex = functionSpec.forcedSorting?.indexOf(b.name)
            if (aIndex !== undefined && bIndex !== undefined) {
              return aIndex - bIndex
            }
            if (aIndex !== undefined) {
              return -1
            }
            if (bIndex !== undefined) {
              return 1
            }
            return a.name.localeCompare(b.name)
          }),
        })
      }

      apiReferences.push(apiReference)
    }
  }
  return apiReferences
}

const resolveFunctionProps = (functionVariant: DeclarationVariant) => {
  const parameterType = functionVariant.signatures![0].parameters[0].type

  if (parameterType.type === 'reflection') {
    return getReflectionProps(parameterType)
  }

  const apiTypes: ApiType[] = []

  for (const parameter of functionVariant.signatures![0].parameters) {
    const type = resolveTypeTopLevel(parameter.type)
    apiTypes.push({
      name: parameter.name,
      type,
      descriptionHtml: '',
      displayType: 'property',
    })
  }

  return apiTypes
}

const resolveFunctionReturns = (functionVariant: DeclarationVariant) => {
  const parameterType = functionVariant.signatures![0].type

  if (parameterType.type === 'reflection') {
    return getReflectionProps(parameterType)
  }

  return [
    {
      name: '',
      type: resolveTypeTopLevel(parameterType),
      descriptionHtml: '',
      displayType: 'property',
    },
  ] as ApiType[]
}

const getReflectionProps = (type: ReflectionType) => {
  const props = type.declaration.children
  if (!props) {
    throw new Error(`Missing props while trying to resolve reflection props`)
  }

  const apiTypes: ApiType[] = []

  for (const prop of props as DeclarationVariant[]) {
    // Functions have signatures. Get the first signature and use it's parameters.
    if (prop.signatures) {
      const signature = prop.signatures[0]

      const type = resolveTypeTopLevel(signature.type, signature.parameters)
      apiTypes.push({
        name: signature.name,
        type,
        descriptionHtml: formatText(signature.comment?.summary),
        defaultHtml: getDefaultValue(signature.comment),
        displayType: 'function',
      })
    } else if (prop.type?.type === 'reflection') {
      const signature = prop.type.declaration.signatures![0]

      const type = resolveTypeTopLevel(signature.type, signature.parameters)
      apiTypes.push({
        name: prop.name,
        type,
        descriptionHtml: formatText(signature.comment?.summary),
        defaultHtml: getDefaultValue(signature.comment),
        displayType: 'function',
      })
    } else {
      if (!prop.type) {
        throw new Error(`Missing type for the ${prop.name} prop`)
      }
      const type = resolveTypeTopLevel(prop.type)
      apiTypes.push({
        name: prop.name,
        type,
        descriptionHtml: formatText(prop.comment?.summary),
        defaultHtml: getDefaultValue(prop.comment),
        displayType: 'property',
      })
    }
  }
  return apiTypes
}

const formatText = (text?: Text[]) => {
  if (!text) {
    return ''
  }

  let html = ''

  for (const part of text) {
    if (part.kind === 'text') {
      const textParts = part.text.split('\n\n')
      html += textParts.join('<br />')
    }
    if (part.kind === 'code') {
      if (part.text.startsWith('```ts')) {
        html += `<code>${part.text.slice(6, -4)}</code>`
      } else {
        html += `<code>${part.text.slice(1, -1)}</code>`
      }
    }
  }

  return html
}

const replaceElements = (text?: string) => {
  return text?.replaceAll(/<([^\>]*)>/g, (string, b) => {
    if (string === '<code>' || string === '</code>') {
      return string
    }
    return `<\u200B${b}>`
  })
}

const getDefaultValue = (comment?: DeclarationVariant['comment']) => {
  if (!comment || !comment.blockTags) {
    return undefined
  }
  const defaultTag = comment.blockTags.find(
    (tag) => tag.tag === '@defaultValue',
  )
  if (!defaultTag) {
    return undefined
  }
  return formatText(defaultTag.content)
}

const getDataTags = (comment?: DeclarationVariant['comment']) => {
  if (!comment || !comment.blockTags) {
    return undefined
  }
  const dataTags = comment.blockTags.filter((tag) => tag.tag === '@data')
  return dataTags.map((dataTag) => {
    return {
      name: dataTag.content[0].text.slice(1, -1),
      descriptionHtml: formatText(dataTag.content.slice(1)).replace(' - ', ''),
      displayType: 'data',
    }
  }) as ApiType[]
}

const getCssTags = (comment?: DeclarationVariant['comment']) => {
  if (!comment || !comment.blockTags) {
    return undefined
  }
  const dataTags = comment.blockTags.filter((tag) => tag.tag === '@css')
  return dataTags.map((dataTag) => {
    return {
      name: dataTag.content[0].text.slice(1, -1),
      descriptionHtml: formatText(dataTag.content.slice(1)).replace(' - ', ''),
      displayType: 'data',
    }
  }) as ApiType[]
}

const findDeclaration = (parent: DeclarationVariant, name: string) => {
  if (!parent.children) {
    throw new Error(`${parent.name} has no children`)
  }

  let contextDeclaration = parent.children.find((c) => c.name === name)

  if (!contextDeclaration) {
    throw new Error(`${parent.name}.${name} not found`)
  }

  if (contextDeclaration.variant === 'reference') {
    contextDeclaration = resolveReference(
      contextDeclaration,
    ) as DeclarationVariant
  }

  if (!contextDeclaration.signatures![0]) {
    throw new Error(`${parent.name}.${name} has no signatures`)
  }

  return contextDeclaration as DeclarationVariantWithSignature
}

const resolveReference = (
  type: ReferenceType | ReferenceVariant,
): DeclarationVariant | string => {
  if (typeof type.target !== 'number') {
    return type.target.qualifiedName
  }

  if (type.target === -1) {
    return type.name
  }

  const declaration = findDeclarationById(type.target, corvuApi.children)

  if (!declaration) {
    throw new Error(`Declaration with ID ${type.target} not found`)
  }

  return declaration
}

const findDeclarationById = (
  id: number,
  scope: DeclarationVariant[],
): DeclarationVariant | undefined => {
  for (const declaration of scope.flatMap((child) => child.children ?? [])) {
    if (declaration.id === id && declaration.variant === 'declaration') {
      return declaration
    }

    if (declaration.variant === 'declaration' && declaration.children) {
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

// Resolve Types and don't resolve references
const resolveTypeTopLevel = (type: Type, parameters?: ParamVariant[]) => {
  let typeName = ''
  if (parameters) {
    const params: {
      name: string
      type: string
    }[] = []
    for (const parameter of parameters) {
      params.push({
        name: parameter.name,
        type: resolveTypeTopLevel(parameter.type),
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
        .map((type) => resolveTypeTopLevel(type))
        .join(' | ')
      break
    case 'reference':
      const argumentNames = []
      for (const argument of type.typeArguments ?? []) {
        argumentNames.push(resolveTypeTopLevel(argument))
      }
      if (argumentNames.length > 0) {
        typeName += `${type.name}<${argumentNames.join(', ')}>`
      } else {
        // The child function of the drawer root component accepts both the drawer and dialog children props.
        // Use their original name to avoid confusion.
        if (type.name.endsWith('RootChildrenProps')) {
          return type.name
        }
        const resolvedReference = resolveReference(type)
        if (typeof resolvedReference === 'string') {
          typeName += resolvedReference
        } else {
          typeName += resolvedReference.name
        }
      }
      break
    case 'intersection':
      typeName += type.types
        .map((type) => resolveTypeTopLevel(type))
        .join(' & ')
      break
    case 'reflection':
      const resolvedType = resolveTypeTopLevel(
        type.declaration.signatures![0].type,
        type.declaration.signatures![0].parameters,
      )
      typeName += resolvedType
      break
    case 'array':
      if (type.elementType.type === 'intrinsic') {
        typeName += resolveTypeTopLevel(type.elementType)
        typeName += '[]'
        break
      } else if (type.elementType.type === 'union') {
        typeName += '['
        typeName += resolveTypeTopLevel(type.elementType)
        typeName += ']'
        break
      } else {
        throw new Error(
          `Unexpected array element type ${type.elementType.type}`,
        )
      }
    case 'query':
      typeName += resolveTypeTopLevel(type.queryType)
      break
    case 'tuple':
      typeName += '['
      typeName += type.elements
        .map((type) => resolveTypeTopLevel(type))
        .join(', ')
      typeName += ']'
      break
  }
  return typeName
}

export { getComponent, getUtility }
