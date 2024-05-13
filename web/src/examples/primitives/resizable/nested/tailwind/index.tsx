import Resizable from '@corvu/resizable'
import type { VoidComponent } from 'solid-js'

const ResizableNestedExample: VoidComponent = () => {
  return (
    <div class="size-full p-4">
      <Resizable class="size-full">
        <Resizable.Panel
          initialSize={0.3}
          minSize={0.2}
          class="rounded-lg bg-corvu-100"
        />
        <Resizable.Handle
          aria-label="Resize Handle"
          class="group basis-3 px-[3px]"
        >
          <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
        </Resizable.Handle>
        <Resizable.Panel initialSize={0.4} minSize={0.2}>
          <Resizable orientation="vertical" class="size-full">
            <Resizable.Panel
              initialSize={0.5}
              minSize={0.2}
              class="rounded-lg bg-corvu-100"
            />
            <Resizable.Handle
              aria-label="Resize Handle"
              class="group basis-3 py-[3px]"
            >
              <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
            </Resizable.Handle>
            <Resizable.Panel initialSize={0.5} minSize={0.2}>
              <Resizable class="size-full">
                <Resizable.Panel
                  initialSize={0.5}
                  minSize={0.3}
                  class="rounded-lg bg-corvu-100"
                />
                <Resizable.Handle
                  aria-label="Resize Handle"
                  class="group basis-3 px-[3px]"
                >
                  <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
                </Resizable.Handle>
                <Resizable.Panel
                  aria-label="Resize Handle"
                  initialSize={0.5}
                  minSize={0.2}
                  class="rounded-lg bg-corvu-100"
                />
              </Resizable>
            </Resizable.Panel>
          </Resizable>
        </Resizable.Panel>
        <Resizable.Handle
          aria-label="Resize Handle"
          class="group basis-3 px-[3px]"
        >
          <div class="size-full rounded transition-colors corvu-group-active:bg-corvu-300 corvu-group-dragging:bg-corvu-100" />
        </Resizable.Handle>
        <Resizable.Panel
          initialSize={0.3}
          minSize={0.2}
          class="rounded-lg bg-corvu-100"
        />
      </Resizable>
    </div>
  )
}

export default ResizableNestedExample
