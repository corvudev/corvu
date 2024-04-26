import LogoDark from '@assets/logo_dark.svg'
import LogoLight from '@assets/logo_light.svg'
import { Resizable } from 'corvu/resizable'
import type { VoidComponent } from 'solid-js'

const ResizableAltKeyExample: VoidComponent = () => {
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
        <Resizable.Panel
          initialSize={0.4}
          minSize={0.2}
          class="flex flex-col items-center justify-center space-y-2 overflow-hidden rounded-lg bg-corvu-100 px-4"
        >
          <img
            src={LogoDark.src}
            alt="Corvu logo dark"
            class="h-16 dark:hidden"
          />
          <img
            src={LogoLight.src}
            alt="Corvu logo light"
            class="hidden h-16 dark:block"
          />
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

export default ResizableAltKeyExample
