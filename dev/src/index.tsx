import './index.css'
import Accordion from './accordion'
import Dialog from './dialog'
import Drawer from './drawer'
import Popover from './popover'
import { render } from 'solid-js/web'
import Resizable from './resizable'
import Tooltip from './tooltip'

function App() {
  console.log('goob')
  return (
    <div class="space-y-4 p-10">
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Resizable
      </h2>
      <Resizable />
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
