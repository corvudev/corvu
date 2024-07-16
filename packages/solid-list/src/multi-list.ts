import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { mergeProps } from 'solid-js'

/**
 * Creates a keyboard navigable multiselect list.
 *
 * @param props.itemCount The number of items in the list.
 * @param props.initialCursor The index of the initially focused item. *Default = `null`*
 * @param props.initialActive The index of the initially active items. *Default = `null`*
 * @param props.initialSelected The index of the initially selected items. *Default = `null`*
 * @param props.orientation The orientation of the list. *Default = `'vertical'`*
 * @param props.loop Whether the list should loop. *Default = `true`*
 * @param props.textDirection The text direction of the list. *Default = `'ltr'`*
 * @param props.handleTab Whether tab key presses should be handled. *Default = `true`*
 * @param props.vimMode Whether vim movement key bindings should be used additionally to arrow key navigation. *Default = `false`*
 * @param props.vimKeys The vim movement key bindings to use. *Default = `{ up: 'k', down: 'j', right: 'l', left: 'h' }`*
 * @param props.onCursorChange Callback fired when the cursor index changes.
 * @param props.onActiveChange Callback fired when the active index changes.
 * @param props.onSelectedChange Callback fired when the selected index changes.
 * @returns ```typescript
 * {
 *   cursor: () => number | null
 *   setCursor: Setter<number | null>
 *   active: () => number[]
 *   setActive: Setter<number[]>
 *   setCursorActive: (index: number | null) => void
 *   selected: () => number[]
 *   setSelected: Setter<number[]>
 *   toggleSelected: (index: number) => void
 *   onKeyDown: (event: KeyboardEvent) => void
 * }
 * ```
 */
const createMultiList = (props: {
  itemCount: MaybeAccessor<number>
  initialCursor?: number | null
  initialActive?: number[]
  initialSelected?: number[]
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
  onCursorChange?: (cursor: number | null) => void
  onActiveChange?: (active: number[]) => void
  onSelectedChange?: (selected: number[]) => void
}) => {
  const defaultedProps = mergeProps(
    {
      initialCursor: null,
      initialActive: [],
      initialSelected: [],
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

  const [cursor, setCursor] = createControllableSignal<number | null>({
    initialValue: defaultedProps.initialCursor,
    onChange: defaultedProps.onCursorChange,
  })

  const [active, setActive] = createControllableSignal<number[]>({
    initialValue: defaultedProps.initialActive,
    onChange: defaultedProps.onActiveChange,
  })

  const [selected, setSelected] = createControllableSignal<number[]>({
    initialValue: defaultedProps.initialSelected,
    onChange: defaultedProps.onSelectedChange,
  })

  const nextKeys = () => {
    const vimKeys = access(defaultedProps.vimKeys)
    let arrowKey: string
    let vimKey: string
    if (access(defaultedProps.orientation) === 'vertical') {
      arrowKey = 'arrowdown'
      vimKey = vimKeys.down
    } else if (access(defaultedProps.textDirection) === 'ltr') {
      arrowKey = 'arrowright'
      vimKey = vimKeys.right
    } else {
      arrowKey = 'arrowleft'
      vimKey = vimKeys.left
    }
    return access(defaultedProps.vimMode) ? [arrowKey, vimKey] : [arrowKey]
  }

  const previousKeys = () => {
    const vimKeys = access(defaultedProps.vimKeys)
    let arrowKey: string
    let vimKey: string
    if (access(defaultedProps.orientation) === 'vertical') {
      arrowKey = 'arrowup'
      vimKey = vimKeys.up
    } else if (access(defaultedProps.textDirection) === 'ltr') {
      arrowKey = 'arrowleft'
      vimKey = vimKeys.left
    } else {
      arrowKey = 'arrowright'
      vimKey = vimKeys.right
    }
    return access(defaultedProps.vimMode) ? [arrowKey, vimKey] : [arrowKey]
  }

  const setCursorActive = (index: number | null) => {
    setCursor(index)
    setActive(index !== null ? [index] : [])
  }

  let direction: 'next' | 'previous' | null = null

  const onKeyDown = (event: KeyboardEvent) => {
    const eventKey = event.key.toLowerCase()
    const _itemCount = access(defaultedProps.itemCount)
    if (_itemCount < 2) return

    const _cursor = cursor()
    const _active = active()

    if (nextKeys().includes(eventKey)) {
      event.preventDefault()
      if (event.shiftKey) {
        if (_cursor === null) {
          setCursorActive(0)
          setSelected([0])
        } else if (_cursor !== _itemCount - 1) {
          const newCursor = _cursor + 1
          setCursor(newCursor)
          if (_active.includes(newCursor)) {
            setActive((active) => active.filter((active) => active !== _cursor))
            if (direction === 'previous') {
              direction = 'next'
              toggleSelected(_cursor)
            }
          } else {
            setActive((active) => [...active, newCursor])
            if (_active.length === 1) {
              direction = 'next'
              toggleSelected(_cursor)
            }
          }
          toggleSelected(newCursor)
        }
      } else {
        if (_cursor === _itemCount - 1) {
          if (access(defaultedProps.loop)) {
            setCursorActive(0)
          }
        } else {
          setCursorActive(_cursor !== null ? _cursor + 1 : 0)
        }
      }
    } else if (previousKeys().includes(eventKey)) {
      event.preventDefault()
      if (event.shiftKey) {
        if (_cursor === null) {
          setCursorActive(_itemCount - 1)
          setSelected([_itemCount - 1])
        } else if (_cursor !== 0) {
          const newCursor = _cursor - 1
          setCursor(newCursor)
          if (_active.includes(newCursor)) {
            setActive((active) => active.filter((active) => active !== _cursor))
            if (direction === 'next') {
              direction = 'previous'
              toggleSelected(_cursor)
            }
          } else {
            setActive((active) => [...active, newCursor])
            if (_active.length === 1) {
              direction = 'previous'
              toggleSelected(_cursor)
            }
          }
          toggleSelected(newCursor)
        }
      } else {
        if (_cursor === 0) {
          if (access(defaultedProps.loop)) {
            setCursorActive(_itemCount - 1)
          }
        } else {
          setCursorActive(_cursor !== null ? _cursor - 1 : _itemCount - 1)
        }
      }
    } else if (eventKey === 'home') {
      event.preventDefault()
      setCursorActive(0)
    } else if (eventKey === 'end') {
      event.preventDefault()
      setCursorActive(_itemCount - 1)
    } else if (access(defaultedProps.handleTab) && _cursor !== null) {
      if (eventKey === 'tab' && !event.shiftKey && _cursor < _itemCount - 1) {
        event.preventDefault()
        setCursorActive(_cursor + 1)
      }
      if (eventKey === 'tab' && event.shiftKey && _cursor > 0) {
        event.preventDefault()
        setCursorActive(_cursor - 1)
      }
    }
  }

  const toggleSelected = (index: number) => {
    setSelected((selected) =>
      selected.includes(index)
        ? selected.filter((selected) => selected !== index)
        : [...selected, index],
    )
  }

  return {
    cursor,
    setCursor,
    active,
    setActive,
    setCursorActive,
    selected,
    setSelected,
    toggleSelected,
    onKeyDown,
  }
}

export default createMultiList
