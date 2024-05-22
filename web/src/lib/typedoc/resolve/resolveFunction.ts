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
import type { FunctionTypeSpecification } from '@lib/typedoc/types/specifications'

const resolveFunction = (
  api: ApiDeclaration,
  name: string,
  functionSpecification: FunctionTypeSpecification,
): ApiReference => {
  const functionDeclaration = api.children.find(
    (child) =>
      child.name ===
      (functionSpecification.isDefaultExport === true ? 'default' : name),
  )
  if (!functionDeclaration) {
    throw new Error(`Function declaration not found: ${name}`)
  }
  const props = resolveFunctionProps(functionDeclaration).sort((a, b) => {
    const indexA = functionSpecification.propsSorting.indexOf(a.name)
    const indexB = functionSpecification.propsSorting.indexOf(b.name)
    if (indexA === -1) {
      throw new Error(`Missing propsSorting for ${name}.${a.name}`)
    }
    if (indexB === -1) {
      throw new Error(`Missing propsSorting for ${name}.${b.name}`)
    }
    return indexA - indexB
  })
  // Helper to detect unused function.propsSorting values
  const unusedSorting = functionSpecification.propsSorting.filter(
    (name) => !props.find((prop) => prop.name === name),
  )
  if (unusedSorting.length) {
    throw new Error(
      `Unused propsSorting values for ${name}: ${unusedSorting.join(', ')}`,
    )
  }
  const returns = resolveFunctionReturns(functionDeclaration)
  if (returns) {
    if (!functionSpecification.returnsSorting) {
      throw new Error(`Missing returnsSorting for ${name}`)
    }
    returns.sort((a, b) => {
      const indexA = functionSpecification.returnsSorting!.indexOf(a.name)
      const indexB = functionSpecification.returnsSorting!.indexOf(b.name)
      if (indexA === -1) {
        throw new Error(`Missing returnsSorting for ${name}.${a.name}`)
      }
      if (indexB === -1) {
        throw new Error(`Missing returnsSorting for ${name}.${b.name}`)
      }
      return indexA - indexB
    })
    // Helper to detect unused function.propsSorting values
    const unusedSorting = functionSpecification.returnsSorting.filter(
      (name) => !returns.find((prop) => prop.name === name),
    )
    if (unusedSorting.length) {
      throw new Error(
        `Unused sorting values for ${name}: ${unusedSorting.join(', ')}`,
      )
    }
  }

  return {
    name,
    kind: 'function',
    props,
    returns,
  }
}

const resolveFunctionProps = (functionDeclaration: DeclarationVariant) => {
  if (!functionDeclaration.signatures) {
    throw new Error(
      `Expected type to be a reflection: ${functionDeclaration.name}`,
    )
  }
  const propTypes = getTypeProps(
    functionDeclaration.signatures[0].parameters[0].type,
  )

  return propTypes
}

const resolveFunctionReturns = (functionDeclaration: DeclarationVariant) => {
  if (!functionDeclaration.signatures) {
    throw new Error(
      `Expected type to be a reflection: ${functionDeclaration.name}`,
    )
  }
  if (
    functionDeclaration.signatures[0].type.type === 'intrinsic' &&
    functionDeclaration.signatures[0].type.name === 'void'
  ) {
    return null
  }
  const propTypes = getTypeProps(functionDeclaration.signatures[0].type)

  return propTypes
}

const getReflectionProps = (type: ReflectionType) => {
  const props = type.declaration.children
  if (!props) {
    throw new Error(`Missing props while trying to resolve reflection props`)
  }

  let propTypes: PropType[] = []

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
      const signature = prop.type.declaration.signatures![0]

      const type = resolveTypeTopLevel(signature.type, 1, signature.parameters)
      propTypes.push({
        name: prop.name,
        defaultHtml: getDefaultValue(signature.comment),
        type,
        descriptionHtml: formatText(prop.comment?.summary),
        isFunction: true,
      })
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

  propTypes = propTypes.map((prop) => {
    if (prop.descriptionHtml.includes('*Default = ')) {
      prop.defaultHtml = prop.descriptionHtml
        .split('*Default = ')[1]
        .split('*')[0]
      prop.descriptionHtml = prop.descriptionHtml.split('*Default = ')[0]
    }
    return prop
  })
  return propTypes
}

const getTypeProps = (type: Type): PropType[] => {
  const propTypes: PropType[] = []

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
      if (
        typeof propDeclaration === 'string' ||
        !propDeclaration.type ||
        propDeclaration.type.type !== 'reflection'
      ) {
        throw new Error(`Missing props for ${type.name}`)
      }
      propTypes.push(...getReflectionProps(propDeclaration.type))
      break
    case 'reflection':
      propTypes.push(...getReflectionProps(type))
      break
    case 'intersection':
      for (const intersectionType of type.types) {
        propTypes.push(...getTypeProps(intersectionType))
      }
      break
    default:
      throw new Error(`Unknown type ${type.type}`)
  }

  return propTypes
}

export default resolveFunction
