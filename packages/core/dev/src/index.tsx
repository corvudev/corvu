import { render } from 'solid-js/web'
import './index.css'
import Dialog from './dialog'

function App() {
  return (
    <div class="p-10">
      <h2 class="mb-4 border-b-2 border-purple-400 pb-2 text-4xl font-extrabold">
        Dialog
      </h2>
      <Dialog />
    </div>
  )
}

render(() => <App />, document.getElementById('root')!)
