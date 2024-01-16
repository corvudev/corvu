import clsx from 'clsx'
import { createSignal, For, Show, type JSX, type FlowComponent } from 'solid-js'

type CodeSnippets = {
  name: string
  files: {
    fileName: string
    slotName: string
  }[]
}[]

const ExampleWrapper: FlowComponent<{
  children: JSX.Element
  codeSnippets: CodeSnippets
  heading: boolean
  [key: string]: JSX.Element | CodeSnippets
}> = (props) => {
  const [viewCode, setViewCode] = createSignal(false)
  const [activeExample, setActiveExample] = createSignal(0)
  const [activeTab, setActiveTab] = createSignal(0)

  return (
    <div class="not-prose my-3 @container">
      <div class="flex h-14 items-center justify-between rounded-t-xl border-x-4 border-t-4 border-corvu-400 bg-corvu-1000 p-2">
        <Show
          when={viewCode() && props.codeSnippets.length > 1}
          fallback={<div />}
        >
          <div class="flex items-center space-x-2">
            <select
              value={activeExample()}
              onInput={(e) => {
                setActiveExample(parseInt(e.currentTarget.value, 10))
                setActiveTab(0)
              }}
              class="cursor-pointer rounded-lg border-2 border-corvu-400 bg-corvu-1000 !bg-caret py-1.5 pl-3 pr-10 text-sm text-corvu-text"
              aria-label="Select template"
            >
              <For each={props.codeSnippets}>
                {(snippet, index) => (
                  <option value={index()}>{snippet.name}</option>
                )}
              </For>
            </select>
          </div>
        </Show>
        <button
          class={clsx('rounded p-2 transition-all hover:bg-corvu-400', {
            '': !viewCode(),
            'bg-corvu-400': viewCode(),
          })}
          onClick={() => setViewCode((viewCode) => !viewCode)}
        >
          <span class="sr-only">View code</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5"
          >
            <g>
              <g>
                <rect
                  width="24"
                  height="24"
                  transform="rotate(90 12 12)"
                  opacity="0"
                />
                <path d="M8.64 5.23a1 1 0 0 0-1.41.13l-5 6a1 1 0 0 0 0 1.27l4.83 6a1 1 0 0 0 .78.37 1 1 0 0 0 .78-1.63L4.29 12l4.48-5.36a1 1 0 0 0-.13-1.41z" />
                <path d="M21.78 11.37l-4.78-6a1 1 0 0 0-1.41-.15 1 1 0 0 0-.15 1.41L19.71 12l-4.48 5.37a1 1 0 0 0 .13 1.41A1 1 0 0 0 16 19a1 1 0 0 0 .77-.36l5-6a1 1 0 0 0 .01-1.27z" />
              </g>
            </g>
          </svg>
        </button>
      </div>
      <Show when={!viewCode()}>
        <div
          class={clsx(
            'aspect-h-9 aspect-w-16 relative rounded-b-xl bg-corvu-400 text-corvu-1000 after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,_#7250AE20_2px,_transparent_0)] after:bg-[length:24px_24px]',
            {
              '@xl:aspect-h-4': !props.heading,
            },
          )}
        >
          <div class="z-10 flex size-full flex-col items-center justify-center">
            {props.children}
          </div>
        </div>
      </Show>
      <Show when={viewCode()}>
        <div class="space-x-2 border-x-4 border-corvu-400 bg-corvu-1000 px-2">
          <For each={props.codeSnippets[activeExample()].files}>
            {(file, index) => (
              <button
                class={clsx(
                  'rounded-t-md p-2 font-mono text-xs transition-all',
                  {
                    'bg-corvu-400': activeTab() === index(),
                    'hover:bg-corvu-400/50': activeTab() !== index(),
                  },
                )}
                onClick={() => setActiveTab(index())}
              >
                {file.fileName}
              </button>
            )}
          </For>
        </div>
        <div class="rounded-b-xl border-4 border-corvu-400 bg-corvu-1000 text-sm [&>astro-slot>div>pre]:max-h-[655px] [&>astro-slot]:grid">
          {
            props[
              props.codeSnippets[activeExample()].files[activeTab()].slotName
            ] as JSX.Element
          }
        </div>
      </Show>
    </div>
  )
}

export default ExampleWrapper
