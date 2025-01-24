import type {
  ApiDeclaration,
  Comment,
  DeclarationVariant,
  LiteralType,
  ReferenceType,
  ReflectionType,
  Type,
} from '@lib/typedoc/types/typedoc'
import type {
  ApiReference,
  PropType,
  Tag,
} from '@lib/typedoc/types/apiReferences'
import {
  formatText,
  getDefaultValue,
  resolveReferenceType,
  resolveTypeTopLevel,
} from '@lib/typedoc/resolve/lib'
import type { ComponentTypeSpecification } from '@lib/typedoc/types/specifications'

const inheritAllowList = ['CreateDismissibleProps', 'CalendarRootBaseProps']

const resolveComponent = (
  api: ApiDeclaration,
  name: string,
  component: ComponentTypeSpecification,
): ApiReference => {
  const componentDeclaration = api.children.find(
    (child) =>
      child.name === (component.isDefaultExport === true ? 'default' : name),
  )
  if (!componentDeclaration) {
    throw new Error(`Component declaration not found: ${name}`)
  }
  const props = resolveComponentProps(componentDeclaration).sort((a, b) => {
    const indexA = component.sorting.indexOf(a.name)
    const indexB = component.sorting.indexOf(b.name)
    if (indexA === -1) {
      throw new Error(`Missing sorting for ${name}.${a.name}`)
    }
    if (indexB === -1) {
      throw new Error(`Missing sorting for ${name}.${b.name}`)
    }
    return indexA - indexB
  })
  // Helper to detect unused component.sorting values
  const unusedSorting = component.sorting.filter(
    (name) => !props.find((prop) => prop.name === name),
  )
  if (unusedSorting.length) {
    throw new Error(
      `Unused sorting values for ${name}: ${unusedSorting.join(', ')}`,
    )
  }
  const dataTags = getTags('data', componentDeclaration.comment)
  const cssTags = getTags('css', componentDeclaration.comment)

  return {
    name,
    kind: 'component',
    descriptionHtml: formatText(componentDeclaration.comment?.summary),
    props,
    inherits: component.inherits ?? null,
    data: dataTags,
    css: cssTags,
  }
}

const resolveComponentProps = (component: DeclarationVariant) => {
  // Components always have their props inside a separate type
  let propsType = component.signatures![0].parameters![0].type

  if (propsType.type === 'intersection') {
    propsType = propsType.types[0]
  }

  if (propsType.type !== 'reference') {
    throw new Error(`Expected props type to be a reference: ${component.name}`)
  }

  let isDynamicComponent = false

  if (propsType.name === 'DynamicProps') {
    isDynamicComponent = true
    propsType = propsType.typeArguments![1]
  }

  if (propsType.type !== 'reference') {
    throw new Error(`Expected props type to be a reference: ${component.name}`)
  }

  const propsDeclaration = resolveReferenceType(propsType)

  if (typeof propsDeclaration === 'string') {
    if (isDynamicComponent) {
      const defaultAs = resolveDefaultDynamicAs(component)
      const asProps: PropType = {
        name: 'as',
        type: 'ValidComponent',
        defaultHtml: `<code>${defaultAs}</code>`,
        descriptionHtml: 'Component to render the dynamic component as.',
        isFunction: false,
      }
      return [asProps]
    }
    return []
  }

  if (!propsDeclaration.type) {
    throw new Error(`Missing type for the ${component.name} component`)
  }

  let type: Type | null = null

  switch (propsDeclaration.type.type) {
    case 'reflection':
      type = propsDeclaration.type
      break
    case 'reference':
      const typeArgument = propsDeclaration.type.typeArguments![1]
      if (typeArgument.type === 'intersection') {
        const types = typeArgument.types.filter(
          (type) => !(type.type === 'reference' && type.name === 'Omit'),
        )
        type = {
          type: 'intersection',
          types,
        }
        break
      }
      type = typeArgument
      break
    case 'intersection':
      type = propsDeclaration.type
      break
    case 'union':
      type = propsDeclaration.type
      break
    default:
      throw new Error(`Unexpected type ${propsDeclaration.type.type}`)
  }

  const propTypes = getTypeProps(type)

  if (isDynamicComponent) {
    const defaultAs = resolveDefaultDynamicAs(component)
    const asProps: PropType = {
      name: 'as',
      type: 'ValidComponent',
      defaultHtml: `<code>${defaultAs}</code>`,
      descriptionHtml: 'Component to render the dynamic component as.',
      isFunction: false,
    }
    propTypes.push(asProps)
  }

  return propTypes
}

const resolveDefaultDynamicAs = (component: DeclarationVariant) => {
  let defaultAs = null

  if (component.signatures![0].typeParameters) {
    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      !component.signatures![0].typeParameters[0] ||
      !component.signatures![0].typeParameters[0].default
    ) {
      throw new Error(
        `Missing default type parameter for the ${component.name} component`,
      )
    }
    if (
      component.signatures![0].typeParameters[0].default.type === 'literal' &&
      component.signatures![0].typeParameters[0].default.value !== null
    ) {
      defaultAs = component.signatures![0].typeParameters[0].default.value
    } else if (
      component.signatures![0].typeParameters[0].default.type === 'reference'
    ) {
      defaultAs = component.signatures![0].typeParameters[0].default.name
    } else if (
      component.signatures![0].typeParameters[0].default.type === 'union' &&
      component.signatures![0].typeParameters[0].default.types[0].type ===
        'literal'
    ) {
      defaultAs = component.signatures![0].typeParameters[0].default.types[0]
        .value as string
    } else {
      throw new Error(
        `Missing default type parameter for the ${component.name} component`,
      )
    }
  }

  return defaultAs
}

const getReflectionProps = (type: ReflectionType) => {
  const props = type.declaration.children
  if (!props) {
    throw new Error(`Missing props while trying to resolve reflection props`)
  }

  const propTypes: PropType[] = []

  for (const prop of props as DeclarationVariant[]) {
    // Functions have signatures. Get the first signature and use it's parameters.
    if (prop.signatures) {
      const signature = prop.signatures[0]

      const type = resolveTypeTopLevel(signature.type, 1, signature.parameters)
      propTypes.push({
        name: signature.name,
        defaultHtml: getDefaultValue(signature.comment),
        type,
        descriptionHtml: formatText(prop.comment?.summary),
        isFunction: true,
      })
    } else if (prop.type?.type === 'reflection') {
      if (prop.type.declaration.signatures) {
        const signature = prop.type.declaration.signatures[0]

        const type = resolveTypeTopLevel(
          signature.type,
          1,
          signature.parameters,
        )
        propTypes.push({
          name: prop.name,
          defaultHtml: getDefaultValue(signature.comment),
          type,
          descriptionHtml: formatText(prop.comment?.summary),
          isFunction: true,
        })
      } else {
        const type = resolveTypeTopLevel(prop.type, 1)
        propTypes.push({
          name: prop.name,
          defaultHtml: getDefaultValue(prop.comment),
          type,
          descriptionHtml: formatText(prop.comment?.summary),
          isFunction: true,
        })
      }
    } else {
      if (!prop.type) {
        throw new Error(`Missing type for the ${prop.name} prop`)
      }
      let type: string | null = null
      if (prop.name === 'as') {
        type = 'ValidComponent'
      } else {
        type = resolveTypeTopLevel(prop.type)
      }
      propTypes.push({
        name: prop.name,
        defaultHtml: getDefaultValue(prop.comment),
        type,
        descriptionHtml: formatText(prop.comment?.summary),
        isFunction: false,
      })
    }
  }
  return propTypes
}

const getTypeProps = (type: Type, propTypes: PropType[] = []): PropType[] => {
  switch (type.type) {
    case 'reference':
      if (type.name === 'Omit') {
        const allProps = getReflectionProps(
          (
            resolveReferenceType(
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
        propTypes.push(
          ...allProps.filter((prop) => !omittedProps.includes(prop.name)),
        )
        break
      }
      const propDeclaration = resolveReferenceType(type)
      if (typeof propDeclaration === 'string' || !propDeclaration.type) {
        throw new Error(`Missing props for ${type.name}`)
      }
      propTypes.push(...getTypeProps(propDeclaration.type))
      break
    case 'reflection':
      propTypes.push(...getReflectionProps(type))
      break
    case 'intersection':
      propTypes.push(...getTypeProps(type.types[0]))
      for (const inheritType of type.types.slice(1)) {
        if (
          inheritType.type === 'reference' &&
          inheritAllowList.includes(inheritType.name)
        ) {
          propTypes.push(...getTypeProps(inheritType))
        }
      }
      break
    case 'union':
      for (const unionType of type.types) {
        getTypeProps(unionType, propTypes)
      }

      // TODO find props that only exist in one of the union types and set description "(Only available in ``"
      const mergedProps: PropType[] = []
      for (const prop of propTypes) {
        const existingProp = mergedProps.find((p) => p.name === prop.name)
        if (existingProp) {
          if (existingProp.type !== prop.type) {
            existingProp.type = `${existingProp.type} | ${prop.type}`
          }
        } else {
          mergedProps.push(prop)
        }
      }

      propTypes = mergedProps

      break
    default:
      throw new Error(`Unknown type ${type.type}`)
  }

  return propTypes
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

export default resolveComponent
