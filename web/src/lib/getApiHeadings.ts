import {
  type ComponentSpecifications,
  componentSpecifications,
  titleToUtilitySpecification,
  type UtilitySpecifications,
  utilitySpecifications,
} from '@lib/apiSpecifications'

const getApiHeadings = (name: string) => {
  const componentSpecification = componentSpecifications[
    name as ComponentSpecifications
  ] as (typeof componentSpecifications)[ComponentSpecifications] | undefined
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

  const utilitySpecification = utilitySpecifications[
    titleToUtilitySpecification(name as never)
  ] as (typeof utilitySpecifications)[UtilitySpecifications] | undefined

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

export default getApiHeadings
