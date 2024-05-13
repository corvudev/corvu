import { Show, type VoidComponent } from 'solid-js'
import {
  SidebarSimpleBold,
  SidebarSimpleFill,
} from '@examples/primitives/resizable/icons'
import clsx from 'clsx'
import Resizable from '@corvu/resizable'

const ResizableWrapper = (props: object) => {
  const context = Resizable.useContext()
  const isCollapsed = () => context.sizes()[0] === 0

  return (
    <>
      <button
        onClick={() =>
          isCollapsed() ? context.expand(0) : context.collapse(0)
        }
        class="rounded-lg bg-corvu-100 p-1 transition-all duration-100 hover:bg-corvu-200 active:translate-y-0.5"
      >
        <Show
          when={isCollapsed()}
          fallback={
            <>
              <SidebarSimpleBold size="20" />
              <span class="sr-only">Collapse</span>
            </>
          }
        >
          <>
            <SidebarSimpleFill size="20" />
            <span class="sr-only">Expand</span>
          </>
        </Show>
      </button>
      <div class="mt-2 h-[calc(100%-36px)]" {...props} />
    </>
  )
}

const ResizableHoistingExample: VoidComponent = () => {
  return (
    <div class="size-full p-4">
      <Resizable as={ResizableWrapper}>
        {(props) => (
          <>
            <Resizable.Panel
              initialSize={0.3}
              minSize={0.2}
              collapsible
              class="flex justify-center overflow-hidden rounded-lg bg-corvu-200"
            >
              <p class="mt-2 font-bold">Sidepanel</p>
            </Resizable.Panel>
            <Resizable.Handle
              aria-label="Resize Handle"
              class={clsx('group basis-3 px-[3px]', {
                hidden: props.sizes[0] === 0,
              })}
            >
              <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
            </Resizable.Handle>
            <Resizable.Panel
              initialSize={0.7}
              minSize={0.5}
              class="rounded-lg bg-corvu-100"
            />
          </>
        )}
      </Resizable>
    </div>
  )
}

export default ResizableHoistingExample
