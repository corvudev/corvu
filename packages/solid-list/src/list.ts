import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { mergeProps } from 'solid-js'

/**
 * Creates a keyboard navigable list.
 *
 * @param props.items The items in the list. Should be in the same order as they appear in the DOM.
 * @param props.initialActive The initially active item. *Default = `null`*
 * @param props.orientation The orientation of the list. *Default = `'vertical'`*
 * @param props.loop Whether the list should loop. *Default = `true`*
 * @param props.textDirection The text direction of the list. *Default = `'ltr'`*
 * @param props.handleTab Whether tab key presses should be handled. *Default = `true`*
 * @param props.vimMode Whether vim movement key bindings should be used additionally to arrow key navigation. *Default = `false`*
 * @param props.vimKeys The vim movement key bindings to use. *Default = `{ up: 'k', down: 'j', right: 'l', left: 'h' }`*
 * @param props.onActiveChange Callback fired when the active item changes.
 * @returns ```typescript
 * {
 *   active: () => T | null
 *   setActive: Setter<T | null>
 *   onKeyDown: (event: KeyboardEvent) => void
 * }
 * ```
 */
const createList = <T>(props: {
  items: MaybeAccessor<T[]>
  initialActive?: T | null
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
  onActiveChange?: (active: T | null) => void
}) => {
  const defaultedProps = mergeProps(
    {
      initialActive: null,
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

  const [active, setActive] = createControllableSignal<T | null>({
    initialValue: defaultedProps.initialActive,
    onChange: defaultedProps.onActiveChange,
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

  const onKeyDown = (event: KeyboardEvent) => {
    const eventKey = event.key.toLowerCase()
    const _items = access(defaultedProps.items)
    if (_items.length === 0) return
    const _itemCount = _items.length
    const _active = active()
    const _activeIndex = _active !== null ? _items.indexOf(_active) : null

    if (nextKeys().includes(eventKey)) {
      event.preventDefault()
      if (_activeIndex === _itemCount - 1) {
        if (access(defaultedProps.loop)) {
          setActive(() => _items[0]!)
        }
      } else {
        setActive(() => _items[_activeIndex !== null ? _activeIndex + 1 : 0]!)
      }
    } else if (previousKeys().includes(eventKey)) {
      event.preventDefault()
      if (_activeIndex === 0) {
        if (access(defaultedProps.loop)) {
          setActive(() => _items[_itemCount - 1]!)
        }
      } else {
        setActive(
          () =>
            _items[_activeIndex !== null ? _activeIndex - 1 : _itemCount - 1]!,
        )
      }
    } else if (eventKey === 'home') {
      event.preventDefault()
      setActive(() => _items[0]!)
    } else if (eventKey === 'end') {
      event.preventDefault()
      setActive(() => _items[_itemCount - 1]!)
    } else if (access(defaultedProps.handleTab) && _activeIndex !== null) {
      if (
        eventKey === 'tab' &&
        !event.shiftKey &&
        _activeIndex < _itemCount - 1
      ) {
        event.preventDefault()
        setActive(() => _items[_activeIndex + 1]!)
      }
      if (eventKey === 'tab' && event.shiftKey && _activeIndex > 0) {
        event.preventDefault()
        setActive(() => _items[_activeIndex - 1]!)
      }
    }
  }

  return { active, setActive, onKeyDown }
}

export default createList
