import Dialog from 'corvu/dialog'
import type { VoidComponent } from 'solid-js'
import './index.css'

const DialogExample: VoidComponent = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Label>Survey about SolidJS</Dialog.Label>
          <Dialog.Description>
            Tell us what you like about Solid the most!
          </Dialog.Description>
          <textarea />
          <div class="button_wrapper">
            <Dialog.Close class="cancel_button">Cancel</Dialog.Close>
            <Dialog.Close class="submit_button">Submit</Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default DialogExample
