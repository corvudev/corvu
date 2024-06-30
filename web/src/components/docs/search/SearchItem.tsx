import clsx from 'clsx'
import type { SearchItemType } from '@components/docs/search/Search'

const SearchItem = (props: {
  item: SearchItemType
  onMouseMove: () => void
  isActive: boolean
}) => {
  return (
    <a
      href={props.item.href}
      class={clsx('block p-2 text-sm', {
        'bg-corvu-300': props.isActive,
        'bg-corvu-100': !props.isActive,
      })}
      onMouseMove={props.onMouseMove}
    >
      <span class="block font-bold">{props.item.hierarchy}</span>
      <span
        class="block truncate [&>mark]:rounded [&>mark]:bg-corvu-400 [&>mark]:px-0.5"
        // eslint-disable-next-line solid/no-innerhtml
        innerHTML={props.item.content}
      />
    </a>
  )
}

export default SearchItem
