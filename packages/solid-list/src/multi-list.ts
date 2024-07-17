import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { mergeProps } from 'solid-js'

/**
 * Creates a keyboard navigable multiselect list.
 *
 * @param props.items The items in the list. Should be in the same order as they appear in the DOM.
 * @param props.initialCursor The initially focused item. *Default = `null`*
 * @param props.initialActive The initially active items. *Default = `[]`*
 * @param props.initialSelected The initially selected items. *Default = `[]`*
 * @param props.orientation The orientation of the list. *Default = `'vertical'`*
 * @param props.loop Whether the list should loop. *Default = `true`*
 * @param props.textDirection The text direction of the list. *Default = `'ltr'`*
 * @param props.handleTab Whether tab key presses should be handled. *Default = `true`*
 * @param props.vimMode Whether vim movement key bindings should be used additionally to arrow key navigation. *Default = `false`*
 * @param props.vimKeys The vim movement key bindings to use. *Default = `{ up: 'k', down: 'j', right: 'l', left: 'h' }`*
 * @param props.onCursorChange Callback fired when the cursor changes.
 * @param props.onActiveChange Callback fired when the active items change.
 * @param props.onSelectedChange Callback fired when the selected items change.
 * @returns ```typescript
 * {
 *   cursor: () => T | null
 *   setCursor: Setter<T | null>
 *   active: () => T[]
 *   setActive: Setter<T[]>
 *   setCursorActive: (item: T | null) => void
 *   selected: () => T[]
 *   setSelected: Setter<T[]>
 *   toggleSelected: (item: T) => void
 *   onKeyDown: (event: KeyboardEvent) => void
 * }
 * ```
 */
const createMultiList = <T>(props: {
  items: MaybeAccessor<T[]>
  initialCursor?: T | null
  initialActive?: T[]
  initialSelected?: T[]
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
  onCursorChange?: (cursor: T | null) => void
  onActiveChange?: (active: T[]) => void
  onSelectedChange?: (selected: T[]) => void
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

  const [cursor, setCursor] = createControllableSignal<T | null>({
    initialValue: defaultedProps.initialCursor,
    onChange: defaultedProps.onCursorChange,
  })

  const [active, setActive] = createControllableSignal<T[]>({
    initialValue: defaultedProps.initialActive,
    onChange: defaultedProps.onActiveChange,
  })

  const [selected, setSelected] = createControllableSignal<T[]>({
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

  let direction: 'next' | 'previous' | null = null

  const setCursorActive = (item: T | null) => {
    setCursor(() => item)
    setActive(item !== null ? [item] : [])
    direction = null
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const eventKey = event.key.toLowerCase()
    const _items = access(defaultedProps.items)
    if (_items.length === 0) return
    const _itemCount = _items.length
    const _cursor = cursor()
    const _cursorIndex = _cursor !== null ? _items.indexOf(_cursor) : null
    const _active = active()

    if (nextKeys().includes(eventKey)) {
      event.preventDefault()
      if (event.shiftKey) {
        if (_cursorIndex === null) {
          setCursorActive(_items[0]!)
          setSelected([_items[0]!])
        } else if (
          _cursorIndex !== _itemCount - 1 ||
          (_active.length === 1 && direction === 'previous')
        ) {
          if (_active.length === 1 && direction !== 'next') {
            toggleSelected(_cursor!)
            direction = direction === 'previous' ? null : 'next'
          } else {
            const newCursor = _items[_cursorIndex + 1]!
            setCursor(() => newCursor)
            if (_active.includes(newCursor)) {
              setActive((active) =>
                active.filter((active) => active !== _cursor),
              )
              toggleSelected(_cursor!)
            } else {
              setActive((active) => [...active, newCursor])
              toggleSelected(newCursor)
            }
          }
        }
      } else {
        if (_cursorIndex === _itemCount - 1) {
          if (access(defaultedProps.loop)) {
            setCursorActive(_items[0]!)
          }
        } else {
          setCursorActive(_items[_cursorIndex !== null ? _cursorIndex + 1 : 0]!)
        }
      }
    } else if (previousKeys().includes(eventKey)) {
      event.preventDefault()
      if (event.shiftKey) {
        if (_cursorIndex === null) {
          setCursorActive(_items[_itemCount - 1]!)
          setSelected([_items[_itemCount - 1]!])
        } else if (
          _cursorIndex !== 0 ||
          (_active.length === 1 && direction === 'next')
        ) {
          if (_active.length === 1 && direction !== 'previous') {
            toggleSelected(_cursor!)
            direction = direction === 'next' ? null : 'previous'
          } else {
            const newCursor = _items[_cursorIndex - 1]!
            setCursor(() => newCursor)
            if (_active.includes(newCursor)) {
              setActive((active) =>
                active.filter((active) => active !== _cursor),
              )
              toggleSelected(_cursor!)
            } else {
              setActive((active) => [...active, newCursor])
              toggleSelected(newCursor)
            }
          }
        }
      } else {
        if (_cursorIndex === 0) {
          if (access(defaultedProps.loop)) {
            setCursorActive(_items[_itemCount - 1]!)
          }
        } else {
          setCursorActive(
            _items[_cursorIndex !== null ? _cursorIndex - 1 : _itemCount - 1]!,
          )
        }
      }
    } else if (eventKey === 'home') {
      event.preventDefault()
      setCursorActive(_items[0]!)
    } else if (eventKey === 'end') {
      event.preventDefault()
      setCursorActive(_items[_itemCount - 1]!)
    } else if (access(defaultedProps.handleTab) && _cursorIndex !== null) {
      if (
        eventKey === 'tab' &&
        !event.shiftKey &&
        _cursorIndex < _itemCount - 1
      ) {
        event.preventDefault()
        setCursorActive(_items[_cursorIndex + 1]!)
      }
      if (eventKey === 'tab' && event.shiftKey && _cursorIndex > 0) {
        event.preventDefault()
        setCursorActive(_items[_cursorIndex - 1]!)
      }
    }
  }

  const toggleSelected = (item: T) => {
    setSelected((selected) =>
      selected.includes(item)
        ? selected.filter((selected) => selected !== item)
        : [...selected, item],
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
