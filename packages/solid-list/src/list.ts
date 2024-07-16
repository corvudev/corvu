import { access, type MaybeAccessor } from '@corvu/utils/reactivity'
import createControllableSignal from '@corvu/utils/create/controllableSignal'
import { mergeProps } from 'solid-js'

/**
 * Creates a keyboard navigable list.
 *
 * @param props.itemCount The number of items in the list.
 * @param props.initialActive The index of the initially active item. *Default = `null`*
 * @param props.orientation The orientation of the list. *Default = `'vertical'`*
 * @param props.loop Whether the list should loop. *Default = `true`*
 * @param props.textDirection The text direction of the list. *Default = `'ltr'`*
 * @param props.handleTab Whether tab key presses should be handled. *Default = `true`*
 * @param props.vimMode Whether vim movement key bindings should be used additionally to arrow key navigation. *Default = `false`*
 * @param props.vimKeys The vim movement key bindings to use. *Default = `{ up: 'k', down: 'j', right: 'l', left: 'h' }`*
 * @param props.onActiveChange Callback fired when the active index changes.
 * @returns ```typescript
 * {
 *   active: () => number | null
 *   setActive: Setter<number | null>
 *   onKeyDown: (event: KeyboardEvent) => void
 * }
 * ```
 */
const createList = (props: {
  itemCount: MaybeAccessor<number>
  initialActive?: number | null
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
  onActiveChange?: (active: number | null) => void
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

  const [active, setActive] = createControllableSignal<number | null>({
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
    const _itemCount = access(defaultedProps.itemCount)
    if (_itemCount < 2) return

    const _active = active()

    if (nextKeys().includes(eventKey)) {
      event.preventDefault()
      if (_active === _itemCount - 1) {
        if (access(defaultedProps.loop)) {
          setActive(0)
        }
      } else {
        setActive(_active !== null ? _active + 1 : 0)
      }
    } else if (previousKeys().includes(eventKey)) {
      event.preventDefault()
      if (_active === 0) {
        if (access(defaultedProps.loop)) {
          setActive(_itemCount - 1)
        }
      } else {
        setActive(_active !== null ? _active - 1 : _itemCount - 1)
      }
    } else if (eventKey === 'home') {
      event.preventDefault()
      setActive(0)
    } else if (eventKey === 'end') {
      event.preventDefault()
      setActive(_itemCount - 1)
    } else if (access(defaultedProps.handleTab) && _active !== null) {
      if (eventKey === 'tab' && !event.shiftKey && _active < _itemCount - 1) {
        event.preventDefault()
        setActive(_active + 1)
      }
      if (eventKey === 'tab' && event.shiftKey && _active > 0) {
        event.preventDefault()
        setActive(_active - 1)
      }
    }
  }

  return { active, setActive, onKeyDown }
}

export default createList
