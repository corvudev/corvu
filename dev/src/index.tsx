import { render } from 'solid-js/web'
import './index.css'
import Accordion from './accordion'
import Dialog from './dialog'
import Drawer from './drawer'

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
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
