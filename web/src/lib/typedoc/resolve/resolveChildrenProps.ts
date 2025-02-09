import type {
  ApiDeclaration,
  DeclarationVariant,
  LiteralType,
  ReferenceType,
  ReflectionType,
  Type,
} from '@lib/typedoc/types/typedoc'
import type { ApiReference, PropType } from '@lib/typedoc/types/apiReferences'
import {
  formatText,
  getDefaultValue,
  resolveReferenceType,
  resolveTypeTopLevel,
} from '@lib/typedoc/resolve/lib'
import type { ChildrenPropsTypeSpecification } from '@lib/typedoc/types/specifications'

const resolveChildrenProps = (
  api: ApiDeclaration,
  name: string,
  childrenProps: ChildrenPropsTypeSpecification,
): ApiReference => {
  const childrenPropsDeclaration = api.children.find(
    (child) => child.name === name,
  )
  if (!childrenPropsDeclaration) {
    throw new Error(`ChildrenProps declaration not found: ${name}`)
  }
  const props = resolveChildrenPropsReturns(childrenPropsDeclaration).sort(
    (a, b) => {
      const indexA = childrenProps.sorting.indexOf(a.name)
      const indexB = childrenProps.sorting.indexOf(b.name)
      if (indexA === -1) {
        throw new Error(`Missing sorting for ${name}.${a.name}`)
      }
      if (indexB === -1) {
        throw new Error(`Missing sorting for ${name}.${b.name}`)
      }
      return indexA - indexB
    },
  )
  // Helper to detect unused childrenProps.sorting values
  const unusedSorting = childrenProps.sorting.filter(
    (name) => !props.find((prop) => prop.name === name),
  )
  if (unusedSorting.length) {
    throw new Error(
      `Unused sorting values for ${name}: ${unusedSorting.join(', ')}`,
    )
  }

  return {
    name,
    kind: 'childrenProps',
    descriptionHtml: formatText(childrenPropsDeclaration.comment?.summary),
    props,
    inherits: childrenProps.inherits ?? null,
  }
}

const resolveChildrenPropsReturns = (childrenProps: DeclarationVariant) => {
  if (!childrenProps.type) {
    throw new Error(`Missing type for the ${childrenProps.name} children props`)
  }

  let type: Type | null = null

  switch (childrenProps.type.type) {
    case 'reflection':
      type = childrenProps.type
      break
    case 'union':
      type = childrenProps.type
      break
    default:
      throw new Error(`Unexpected type ${childrenProps.type.type}`)
  }

  const propTypes = getTypeProps(type)

  return propTypes
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
        isFunction: type.startsWith('Setter'),
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
      for (const intersectionType of type.types) {
        propTypes.push(...getTypeProps(intersectionType))
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

export default resolveChildrenProps
