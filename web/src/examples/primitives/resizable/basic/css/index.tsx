import Resizable from '@corvu/resizable'
import type { VoidComponent } from 'solid-js'

const ResizableExample: VoidComponent = () => {
  return (
    <div class="wrapper">
      <Resizable>
        <Resizable.Panel initialSize={0.3} minSize={0.2} class="panel" />
        <Resizable.Handle aria-label="Resize Handle">
          <div class="inner_handle" />
        </Resizable.Handle>
        <Resizable.Panel initialSize={0.7} minSize={0.2}>
          <Resizable orientation="vertical">
            <Resizable.Panel initialSize={0.5} minSize={0.2} class="panel" />
            <Resizable.Handle aria-label="Resize Handle">
              <div class="inner_handle" />
            </Resizable.Handle>
            <Resizable.Panel initialSize={0.5} minSize={0.2} class="panel" />
          </Resizable>
        </Resizable.Panel>
      </Resizable>
    </div>
  )
}

export default ResizableExample
