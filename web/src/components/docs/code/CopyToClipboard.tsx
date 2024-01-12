import clsx from 'clsx'
import {
  createEffect,
  createSignal,
  onCleanup,
  type VoidComponent,
} from 'solid-js'

const CopyToClipboard: VoidComponent<{ code: string }> = (props) => {
  const [copied, setCopied] = createSignal(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(props.code)
    setCopied(true)
  }

  createEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (copied()) {
      timeout = setTimeout(() => setCopied(false), 2000)
    }
    onCleanup(() => clearTimeout(timeout))
  })

  return (
    <>
      {copied() && (
        <p class="absolute right-8 top-0 bg-corvu-1000 p-2 text-sm text-corvu-400/90 opacity-100 animate-in slide-in-from-right-3">
          copied!
        </p>
      )}
      <button
        class={clsx('absolute right-1 top-0 bg-corvu-1000 p-2', {
          'text-corvu-400/80': !copied(),
          'text-corvu-400': copied(),
        })}
        onClick={copyToClipboard}
      >
        <span class="sr-only">{copied() ? 'Code copied' : 'Copy code'}</span>
        {copied() ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5"
          >
            <g>
              <g>
                <rect width="24" height="24" opacity="0" />
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M14.7 8.39l-3.78 5-1.63-2.11a1 1 0 0 0-1.58 1.23l2.43 3.11a1 1 0 0 0 .79.38 1 1 0 0 0 .79-.39l4.57-6a1 1 0 1 0-1.6-1.22z" />
              </g>
            </g>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5"
          >
            <g>
              <g>
                <rect width="24" height="24" opacity="0" />
                <path d="M18 5V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1a3 3 0 0 0-3 3v11a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zM8 4h8v4H8V4zm11 15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a1 1 0 0 1 1 1z" />
              </g>
            </g>
          </svg>
        )}
      </button>
    </>
  )
}

export default CopyToClipboard
