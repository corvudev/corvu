import { type Accessor, createSignal } from 'solid-js'

const createNavigation = (props: {
  resultCount: Accessor<number>
  onSelect: (index: number) => void
}) => {
  const [activeIndex, setActiveIndex] = createSignal<number>(0)

  const onKeyDown = (event: KeyboardEvent) => {
    if ('ArrowDown' === event.key) {
      event.preventDefault()
      if (activeIndex() === props.resultCount() - 1) {
        setActiveIndex(0)
      } else {
        setActiveIndex((activeIndex) => activeIndex + 1)
      }
    } else if ('ArrowUp' === event.key) {
      event.preventDefault()
      if (activeIndex() === 0) {
        setActiveIndex(props.resultCount() - 1)
      } else {
        setActiveIndex((activeIndex) => activeIndex - 1)
      }
    } else if (event.key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setActiveIndex(props.resultCount() - 1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      props.onSelect(activeIndex())
    }
  }

  const onMouseMove = (index: number) => setActiveIndex(index)

  return {
    onKeyDown,
    onMouseMove,
    activeIndex,
  }
}

export default createNavigation
