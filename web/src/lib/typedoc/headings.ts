import libraries from '@lib/typedoc/libraries'

const getApiReferenceHeadings = (libraryName: string) => {
  const library = libraries.find((lib) => lib.name === libraryName)
  if (!library) return []

  const headings: {
    text: string
    slug: string
  }[] = []

  for (const [name, item] of Object.entries(library.items)) {
    headings.push({
      text:
        item.kind === 'component' || item.kind === 'inherited-component'
          ? `<${name} />`
          : name,
      slug: encodeURIComponent(name),
    })
  }

  return headings
}

export default getApiReferenceHeadings
