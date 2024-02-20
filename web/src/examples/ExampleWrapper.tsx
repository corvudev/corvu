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
    <div class="not-prose my-3">
      <div class="flex h-14 items-center justify-between rounded-t-xl border-x-4 border-t-4 border-corvu-400 bg-corvu-50 p-2 dark:bg-corvu-1000">
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
              class="cursor-pointer rounded-lg border-2 border-corvu-400 bg-corvu-50 !bg-caret-dark bg-[length:16px_16px] pb-1 pl-3 pr-10 pt-[7px] text-sm text-corvu-dark dark:bg-corvu-1000 dark:!bg-caret-light dark:text-corvu-text"
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
          class={clsx('rounded p-2 hover:bg-corvu-400 hover:text-corvu-dark', {
            'bg-corvu-400 text-corvu-dark': viewCode(),
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
            'relative rounded-b-xl bg-corvu-400 text-corvu-1000 after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,_#7250AE20_2px,_transparent_0)] after:bg-[length:24px_24px]',
            {
              'h-[300px] @xl:h-[400px]': props.heading,
              'h-[200px]': !props.heading,
            },
          )}
        >
          <div class="relative z-10 flex size-full flex-col items-center">
            {props.children}
          </div>
        </div>
      </Show>
      <Show when={viewCode()}>
        <div class="space-x-2 border-x-4 border-corvu-400 bg-corvu-50 px-2 dark:bg-corvu-1000">
          <For each={props.codeSnippets[activeExample()].files}>
            {(file, index) => (
              <button
                class={clsx(
                  'rounded-t-md p-2 font-mono text-xs hover:bg-corvu-400 hover:text-corvu-dark',
                  {
                    'bg-corvu-400 text-corvu-dark': activeTab() === index(),
                  },
                )}
                onClick={() => setActiveTab(index())}
              >
                {file.fileName}
              </button>
            )}
          </For>
        </div>
        <div class="rounded-b-xl border-4 border-corvu-400 bg-corvu-50 text-sm dark:bg-corvu-1000 [&>astro-slot>div>pre]:max-h-[655px] [&>astro-slot]:grid">
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
