import './index.css'
import Accordion from './accordion'
import Dialog from './dialog'
import Drawer from './drawer'
import Popover from './popover'
import { render } from 'solid-js/web'
import Tooltip from './tooltip'

function App() {
  return (
    <div class="space-y-4 p-10">
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Dialog
      </h2>
      <Dialog />
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Drawer
      </h2>
      <Drawer />
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Accordion
      </h2>
      <Accordion />
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Popover
      </h2>
      <Popover />
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Tooltip
      </h2>
      <Tooltip />
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
