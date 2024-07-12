import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { mergeProps } from 'solid-js'

/**
 * Creates a keyboard navigable list.
 *
 * @param props.itemCount The number of items in the list.
 * @param props.initialSelected The index of the initially selected item. *Default = `null`*
 * @param props.orientation The orientation of the list. *Default = `'vertical'`*
 * @param props.loop Whether the list should loop. *Default = `true`*
 * @param props.textDirection The text direction of the list. *Default = `'ltr'`*
 * @param props.handleTab Whether tab key presses should be handled. *Default = `true`*
 * @param props.vimMode Whether vim movement key bindings should be used additionally to arrow key navigation. *Default = `false`*
 * @param props.vimKeys The vim movement key bindings to use. *Default = `{ up: 'k', down: 'j', right: 'l', left: 'h' }`*
 * @param props.onSelectedChange Callback fired when the selected index changes.
 * @returns ```typescript
 * {
 *   selected: () => number | null
 *   setSelected: Set<number | null>
 *   onKeyDown: (event: KeyboardEvent) => void
 *   onFocus: (index: number) => void
 * }
 * ```
 */
const createList = (props: {
  itemCount: MaybeAccessor<number>
  initialSelected?: number | null
  orientation?: MaybeAccessor<'vertical' | 'horizontal'>
  loop?: MaybeAccessor<boolean>
  textDirection?: MaybeAccessor<'ltr' | 'rtl'>
  handleTab?: MaybeAccessor<boolean>
  vimMode?: MaybeAccessor<boolean>
  vimKeys?: MaybeAccessor<{
    up: string
    down: string
    right: string
    left: string
  }>
  onSelectedChange?: (selected: number | null) => void
}) => {
  const defaultedProps = mergeProps(
    {
      initialSelected: null,
      orientation: 'vertical' as const,
      loop: true,
      textDirection: 'ltr' as const,
      handleTab: true,
      vimMode: false,
      vimKeys: {
        up: 'k',
        down: 'j',
        right: 'l',
        left: 'h',
      },
    },
    props,
  )

  const [selected, setSelected] = createControllableSignal<number | null>({
    initialValue: defaultedProps.initialSelected,
    onChange: defaultedProps.onSelectedChange,
  })

  const nextKeys = () => {
    const vimKeys = access(defaultedProps.vimKeys)
    let arrowKey: string
    let vimKey: string
    if (access(defaultedProps.orientation) === 'vertical') {
      arrowKey = 'ArrowDown'
      vimKey = vimKeys.down
    } else if (access(defaultedProps.textDirection) === 'ltr') {
      arrowKey = 'ArrowRight'
      vimKey = vimKeys.right
    } else {
      arrowKey = 'ArrowLeft'
      vimKey = vimKeys.left
    }
    return access(defaultedProps.vimMode) ? [arrowKey, vimKey] : [arrowKey]
  }

  const previousKeys = () => {
    const vimKeys = access(defaultedProps.vimKeys)
    let arrowKey: string
    let vimKey: string
    if (access(defaultedProps.orientation) === 'vertical') {
      arrowKey = 'ArrowUp'
      vimKey = vimKeys.up
    } else if (access(defaultedProps.textDirection) === 'ltr') {
      arrowKey = 'ArrowLeft'
      vimKey = vimKeys.left
    } else {
      arrowKey = 'ArrowRight'
      vimKey = vimKeys.right
    }
    return access(defaultedProps.vimMode) ? [arrowKey, vimKey] : [arrowKey]
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const _itemCount = access(defaultedProps.itemCount)
    if (_itemCount < 2) return

    const _selected = selected()

    if (nextKeys().includes(event.key)) {
      event.preventDefault()
      if (selected() === _itemCount - 1) {
        if (access(defaultedProps.loop)) {
          setSelected(0)
        }
      } else {
        setSelected(_selected !== null ? _selected + 1 : 0)
      }
    } else if (previousKeys().includes(event.key)) {
      event.preventDefault()
      if (_selected === 0) {
        if (access(defaultedProps.loop)) {
          setSelected(_itemCount - 1)
        }
      } else {
        setSelected(_selected !== null ? _selected - 1 : _itemCount - 1)
      }
    } else if (event.key === 'Home') {
      event.preventDefault()
      setSelected(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setSelected(_itemCount - 1)
    } else if (access(defaultedProps.handleTab) && _selected !== null) {
      if (
        event.key === 'Tab' &&
        !event.shiftKey &&
        _selected < _itemCount - 1
      ) {
        event.preventDefault()
        setSelected(_selected + 1)
      }
      if (event.key === 'Tab' && event.shiftKey && _selected > 0) {
        event.preventDefault()
        setSelected(_selected - 1)
      }
    }
  }

  const onFocus = (index: number) => {
    setSelected(index)
  }

  return { selected, setSelected, onKeyDown, onFocus }
}

export default createList
