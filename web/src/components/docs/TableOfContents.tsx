import { createEffect, createSignal, For, onCleanup } from 'solid-js'
import clsx from 'clsx'
import type { VoidComponent } from 'solid-js'

type Heading = {
  depth: number
  text: string
  slug: string
  subheadings: Heading[]
}

const TableOfContents: VoidComponent<{
  headings: {
    depth: number
    text: string
    slug: string
  }[]
  apiHeadings: {
    text: string
    slug: string
  }[]
}> = (props) => {
  const tableOfContents: Heading[] = []
  const parentHeadings = new Map()

  const [headingsInView, setHeadingsInView] = createSignal<string[]>([])

  // eslint-disable-next-line solid/reactivity
  props.headings
    .filter((h) => h.depth !== 1)
    .forEach((h) => {
      const heading = { ...h, subheadings: [] }
      parentHeadings.set(heading.depth, heading)
      if (heading.depth === 2) {
        tableOfContents.push(heading)
      } else {
        parentHeadings.get(heading.depth - 1).subheadings.push(heading)
      }
    })

  if (props.apiHeadings.length > 0) {
    const apiTitle = tableOfContents.find((h) => h.slug === 'api-reference')
    if (apiTitle) {
      apiTitle.subheadings = props.apiHeadings.map((h) => {
        return {
          depth: 3,
          text: h.text,
          slug: h.slug,
          subheadings: [],
        }
      })
    }
  }

  createEffect(() => {
    const observer = new IntersectionObserver((sections) => {
      sections.forEach((section) => {
        const id = section.target.getAttribute('id')
        if (id === null) return

        if (section.isIntersecting && !headingsInView().includes(id)) {
          setHeadingsInView([...headingsInView(), id])
          return
        }
        if (!section.isIntersecting && headingsInView().includes(id)) {
          setHeadingsInView(headingsInView().filter((h) => h !== id))
          return
        }
      })
    })

    document.querySelectorAll('h2, h3, h4').forEach((section) => {
      observer.observe(section)
    })

    onCleanup(() => observer.disconnect())
  })

  return (
    <div class="ml-6 hidden w-52 text-sm lg:flex">
      <nav class="fixed">
        {tableOfContents.length > 0 && (
          <p class="text-base font-semibold">On this page</p>
        )}
        <ul class="mt-3 space-y-2">
          <For each={tableOfContents}>
            {(heading) => {
              return (
                <TocItem heading={heading} headingsInView={headingsInView()} />
              )
            }}
          </For>
        </ul>
      </nav>
    </div>
  )
}

const TocItem: VoidComponent<{ heading: Heading; headingsInView: string[] }> = (
  props,
) => {
  return (
    <li>
      <a
        href={`#${props.heading.slug}`}
        class={clsx('block py-0.5 hover:text-corvu-link-hover', {
          'opacity-60 hover:opacity-100': !props.headingsInView.includes(
            props.heading.slug,
          ),
        })}
        style={{
          'padding-left': `${(props.heading.depth - 2) * 1}rem`,
        }}
        onClick={(e) => {
          e.preventDefault()
          document
            .getElementById(props.heading.slug)
            ?.scrollIntoView({ behavior: 'smooth' })
          history.pushState({}, '', `#${props.heading.slug}`)
        }}
      >
        {props.heading.text}
      </a>
      {props.heading.subheadings.length > 0 && (
        <ul class="mt-1">
          <For each={props.heading.subheadings}>
            {(heading) => {
              return (
                <TocItem
                  heading={heading}
                  headingsInView={props.headingsInView}
                />
              )
            }}
          </For>
        </ul>
      )}
    </li>
  )
}

export default TableOfContents
