import apiJson from '@assets/api.json'
import type {
  CorvuApi,
  DeclarationVariant,
  ParamVariant,
  ReferenceType,
  Type,
  Text,
  ReflectionType,
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

type TypeSpecification = {
  name: string
  forcedSorting?: string[]
}

type ComponentSpecifications = 'Dialog' | 'Drawer'

const componentSpecifications: {
  [key in ComponentSpecifications]: {
    exportName: string
    components: TypeSpecification[]
    contexts: TypeSpecification[]
    types: TypeSpecification[]
  }
} = {
  Dialog: {
    exportName: 'primitives/dialog',
    components: [
      {
        name: 'Root',
        forcedSorting: [
          'role',
          'open',
          'onOpenChange',
          'initialOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'onEscapeKeyDown',
          'closeOnOutsidePointerDown',
          'onOutsidePointerDown',
          'noOutsidePointerEvents',
          'preventScroll',
          'preventScrollbarShift',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'onInitialFocus',
          'finalFocusEl',
          'onFinalFocus',
          'dialogId',
          'labelId',
          'descriptionId',
          'contextId',
          'children',
        ],
      },
      {
        name: 'Trigger',
      },
      {
        name: 'Portal',
        forcedSorting: ['forceMount', 'contextId'],
      },
      {
        name: 'Overlay',
        forcedSorting: ['as', 'asChild', 'forceMount', 'contextId'],
      },
      {
        name: 'Content',
        forcedSorting: ['as', 'asChild', 'forceMount', 'contextId'],
      },
      {
        name: 'Close',
      },
      {
        name: 'Label',
      },
      {
        name: 'Description',
      },
    ],
    contexts: [
      {
        name: 'useContext',
        forcedSorting: [
          'role',
          'open',
          'contentPresent',
          'overlayPresent',
          'setOpen',
          'initialOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'onEscapeKeyDown',
          'closeOnOutsidePointerDown',
          'onOutsidePointerDown',
          'noOutsidePointerEvents',
          'preventScroll',
          'preventScrollbarShift',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'onInitialFocus',
          'finalFocusEl',
          'onFinalFocus',
          'dialogId',
          'labelId',
          'descriptionId',
        ],
      },
    ],
    types: [
      {
        name: 'RootChildrenProps',
        forcedSorting: [
          'role',
          'open',
          'contentPresent',
          'overlayPresent',
          'setOpen',
          'initialOpen',
          'modal',
          'closeOnEscapeKeyDown',
          'onEscapeKeyDown',
          'closeOnOutsidePointerDown',
          'onOutsidePointerDown',
          'noOutsidePointerEvents',
          'preventScroll',
          'preventScrollbarShift',
          'trapFocus',
          'restoreFocus',
          'initialFocusEl',
          'onInitialFocus',
          'finalFocusEl',
          'onFinalFocus',
          'dialogId',
          'labelId',
          'descriptionId',
        ],
      },
    ],
  },
  Drawer: {
    exportName: 'primitives/drawer',
    components: [
      {
        name: 'Root',
        forcedSorting: [
          'snapPoints',
          'breakPoints',
          'defaultSnapPoint',
          'activeSnapPoint',
          'onActiveSnapPointChange',
          'side',
          'dampFunction',
          'velocityFunction',
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'scrollThreshold',
          'children',
        ],
      },
      {
        name: 'Content',
        forcedSorting: ['as', 'asChild', 'forceMount', 'contextId'],
      },
    ],
    contexts: [
      {
        name: 'useContext',
        forcedSorting: [
          'snapPoints',
          'breakPoints',
          'defaultSnapPoint',
          'activeSnapPoint',
          'setActiveSnapPoint',
          'side',
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'scrollThreshold',
          'isDragging',
          'isTransitioning',
          'openPercentage',
          'translate',
        ],
      },
    ],
    types: [
      {
        name: 'RootChildrenProps',
        forcedSorting: [
          'snapPoints',
          'breakPoints',
          'defaultSnapPoint',
          'activeSnapPoint',
          'setActiveSnapPoint',
          'side',
          'velocityCacheReset',
          'allowSkippingSnapPoints',
          'handleScrollableElements',
          'scrollThreshold',
          'isDragging',
          'isTransitioning',
          'openPercentage',
          'translate',
        ],
      },
    ],
  },
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
    const componentDeclaration = parentDeclaration.children.find(
      (c) => c.name === component.name,
    )
    if (
      !componentDeclaration ||
      !componentDeclaration.signatures ||
      !componentDeclaration.signatures[0]
    ) {
      throw new Error(`${componentName}.${component.name} not found`)
    }

    let apiTypes = resolveComponent(componentDeclaration)
    // Insert zero width space to prevent components rendering as
    apiTypes = apiTypes.map((apiType) => {
      apiType.defaultHtml = replaceElements(apiType.defaultHtml)
      apiType.descriptionHtml = replaceElements(apiType.descriptionHtml)!
      return apiType
    })

    const dataTags = getDataTags(componentDeclaration.signatures[0].comment)
    const apiReference: ApiReference = {
      type: 'component',
      name: `${componentName}.${component.name}`,
      descriptionHtml: formatText(
        componentDeclaration.signatures[0].comment?.summary,
      ),
      parts: [],
    }
    if (apiTypes) {
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
    }
    if (dataTags) {
      apiReference.parts.push({
        name: 'Data',
        description: `Data attributes present on ${parentDeclaration.name}.${component.name} components.`,
        props: dataTags ?? [],
      })
    }

    apiReferences.push(apiReference)
  }

  for (const context of contexts) {
    const contextDeclaration = parentDeclaration.children.find(
      (c) => c.name === context.name,
    )
    if (!contextDeclaration || !contextDeclaration.signatures![0]) {
      throw new Error(`${componentName}.${context.name} not found`)
    }

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
    if (apiTypes) {
      apiReference.parts.push({
        name: 'Props',
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
    }

    apiReferences.push(apiReference)
  }

  for (const type of types) {
    const typeDeclaration = parentDeclaration.children.find(
      (c) => c.name === type.name,
    )
    if (!typeDeclaration) {
      throw new Error(`${componentName}.${type.name} not found`)
    }

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
    if (apiTypes) {
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
    }

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
      !component.signatures![0].typeParameter[0].default ||
      component.signatures![0].typeParameter[0].default.type !== 'literal'
    ) {
      throw new Error(
        `Missing default type parameter for the ${component.name} component`,
      )
    }
    defaultAs = component.signatures![0].typeParameter[0].default.value
  }

  // Components always have their props inside a separate type
  const referenceType = component.signatures![0].parameters[0].type

  if (!referenceType || referenceType.type !== 'reference') {
    throw new Error(`Missing type for the ${component.name} component`)
  }

  const propDeclaration = resolveReferenceType(referenceType)

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
      const propDeclaration = resolveReferenceType(typeArgument)
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
            const resolvedReference = resolveReferenceType(type)
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

  if (!referenceType || referenceType.type !== 'reference') {
    throw new Error(`Missing type for the ${context.name} component`)
  }

  const propDeclaration = resolveReferenceType(referenceType)

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

type UtilitySpecifications =
  | 'createControllableSignal'
  | 'createDisableScroll'
  | 'createFocusTrap'
  | 'keyedContext'
  | 'createPresence'
  | 'Polymorphic'

const titleToUtilitySpecification = (
  title:
    | 'Controllable Signal'
    | 'Disable Scroll'
    | 'Focus Trap'
    | 'Keyed Context'
    | 'Presence'
    | 'Polymorphic',
): UtilitySpecifications => {
  switch (title) {
    case 'Controllable Signal':
      return 'createControllableSignal'
    case 'Disable Scroll':
      return 'createDisableScroll'
    case 'Focus Trap':
      return 'createFocusTrap'
    case 'Keyed Context':
      return 'keyedContext'
    case 'Presence':
      return 'createPresence'
    case 'Polymorphic':
      return 'Polymorphic'
  }
}

const utilitySpecifications: {
  [key in UtilitySpecifications]: {
    components?: TypeSpecification[]
    functions?: TypeSpecification[]
  }
} = {
  createControllableSignal: {
    functions: [
      {
        name: 'createControllableSignal',
        forcedSorting: ['value', 'onChange', 'defaultValue'],
      },
    ],
  },
  createDisableScroll: {
    functions: [
      {
        name: 'createDisableScroll',
        forcedSorting: ['enabled', 'preventScrollbarShift'],
      },
    ],
  },
  createFocusTrap: {
    functions: [
      {
        name: 'createFocusTrap',
        forcedSorting: [
          'element',
          'enabled',
          'initialFocusElement',
          'onInitialFocus',
          'restoreFocus',
          'finalFocusElement',
          'onFinalFocus',
        ],
      },
    ],
  },
  keyedContext: {
    functions: [
      {
        name: 'createKeyedContext',
        forcedSorting: ['key', 'defaultValue'],
      },
      {
        name: 'getKeyedContext',
      },
      {
        name: 'useKeyedContext',
      },
    ],
  },
  createPresence: {
    functions: [
      {
        name: 'createPresence',
        forcedSorting: ['show', 'element'],
      },
    ],
  },
  Polymorphic: {
    components: [
      {
        name: 'Polymorphic',
      },
      {
        name: 'As',
      },
    ],
  },
}

const getUtility = (utilityName: UtilitySpecifications) => {
  const { components, functions } = utilitySpecifications[utilityName]

  const apiReferences: ApiReference[] = []

  if (components) {
    for (const component of components) {
      const componentDeclaration = corvuApiIndex.children!.find(
        (c) => c.name === component.name,
      )
      if (!componentDeclaration || !componentDeclaration.signatures![0]) {
        throw new Error(`${component.name} not found`)
      }

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
      if (apiTypes) {
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
      }
      if (dataTags) {
        apiReference.parts.push({
          name: 'Data',
          description: `Data attributes present on ${component.name} components.`,
          props: dataTags ?? [],
        })
      }

      apiReferences.push(apiReference)
    }
  }

  if (functions) {
    for (const functionSpec of functions) {
      const typeDeclaration = corvuApiIndex.children!.find(
        (c) => c.name === functionSpec.name,
      )
      if (!typeDeclaration) {
        throw new Error(`${functionSpec.name} not found`)
      }

      let apiTypes = resolveFunction(typeDeclaration)
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
      if (apiTypes) {
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
      }

      apiReferences.push(apiReference)
    }
  }
  return apiReferences
}

const resolveFunction = (functionVariant: DeclarationVariant) => {
  const parameterType = functionVariant.signatures![0].parameters[0].type

  if (!parameterType) {
    throw new Error(`Missing signature for the ${functionVariant.name} utility`)
  }

  if (parameterType.type === 'reflection') {
    return getReflectionProps(parameterType)
  }

  const apiTypes: ApiType[] = []

  for (const parameter of functionVariant.signatures![0].parameters) {
    if (!parameter.type) {
      throw new Error(
        `Missing type for the ${parameter} parameter of ${functionVariant.name} utility`,
      )
    }

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

const getReflectionProps = (type: ReflectionType) => {
  const props = type.declaration.children
  if (!props) {
    throw new Error(`Missing props while trying to resolve reflection props`)
  }

  const apiTypes: ApiType[] = []

  for (const prop of props) {
    // Functions have signatures. Get the first signature and use it's parameters.
    if (prop.signatures) {
      const signature = prop.signatures[0]
      if (!signature.parameters) {
        throw new Error(`Missing signature for the ${prop.name} prop`)
      }

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
      if (!signature.parameters) {
        throw new Error(`Missing signature for the ${prop.name} prop`)
      }

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
  return text?.replaceAll(/<([^\>]*)\/>/g, (_, b) => {
    return `<​${b} />`
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

const resolveReferenceType = (
  type: ReferenceType,
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
    if (declaration.id === id) {
      return declaration
    }

    if (declaration.children) {
      const foundDeclaration = findDeclarationById(id, declaration.children)
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
      typeName += `'${type.value}'`
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
      typeName += '['
      typeName += resolveTypeTopLevel(type.elementType)
      typeName += ']'
      break
    case 'query':
      typeName += resolveTypeTopLevel(type.queryType)
      break
  }
  return typeName
}

const getHeadings = (name: string) => {
  const componentSpecification =
    componentSpecifications[name as ComponentSpecifications]
  const headings: {
    text: string
    slug: string
  }[] = []

  if (componentSpecification) {
    const { components, contexts, types } = componentSpecification

    for (const component of components) {
      headings.push({
        text: component.name,
        slug: encodeURIComponent(`${name}.${component.name}`),
      })
    }

    for (const context of contexts) {
      headings.push({
        text: context.name,
        slug: encodeURIComponent(`${name}.${context.name}`),
      })
    }

    for (const type of types) {
      headings.push({
        text: type.name,
        slug: encodeURIComponent(`${name}.${type.name}`),
      })
    }

    return headings
  }

  const utilitySpecification =
    utilitySpecifications[titleToUtilitySpecification(name as never)]

  if (utilitySpecification) {
    const { components, functions } = utilitySpecification

    if (components) {
      for (const component of components) {
        headings.push({
          text: component.name,
          slug: encodeURIComponent(component.name),
        })
      }
    }

    if (functions) {
      for (const functionType of functions) {
        headings.push({
          text: functionType.name,
          slug: encodeURIComponent(functionType.name),
        })
      }
    }

    return headings
  }

  return []
}

export { getComponent, getUtility, getHeadings }
