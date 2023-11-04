import { some } from '@lib/utils'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { Show } from 'solid-js'
import { Portal } from 'solid-js/web'
import type { ComponentProps, FlowComponent } from 'solid-js'

const DialogPortal: FlowComponent<ComponentProps<typeof Portal>> = (props) => {
  const { open, forceMount, contentPresent, overlayPresent } =
    useDialogContext()

  return (
    <Show when={some(open, forceMount, contentPresent, overlayPresent)}>
      <Portal {...props} />
    </Show>
  )
}

export default DialogPortal
