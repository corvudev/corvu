import { Show, type VoidComponent } from 'solid-js'
import clsx from 'clsx'
import OtpField from '@corvu/otp-field'

const OtpFieldExample: VoidComponent = () => {
  return (
    <div class="wrapper">
      <OtpField maxLength={6}>
        <OtpField.Input aria-label="Verification Code" />
        <div class="slot_wrapper">
          <Slot index={0} />
          <Slot index={1} />
          <Slot index={2} />
        </div>
        <div class="separator">-</div>
        <div class="slot_wrapper">
          <Slot index={3} />
          <Slot index={4} />
          <Slot index={5} />
        </div>
      </OtpField>
    </div>
  )
}

const Slot = (props: { index: number }) => {
  const context = OtpField.useContext()
  const char = () => context.value()[props.index]
  const showFakeCaret = () =>
    context.value().length === props.index && context.isInserting()

  return (
    <div
      class={clsx('slot', {
        active_slot: context.activeSlots().includes(props.index),
      })}
    >
      {char()}
      <Show when={showFakeCaret()}>
        <div class="fake_caret_wrapper">
          <div class="fake_caret" />
        </div>
      </Show>
    </div>
  )
}

export default OtpFieldExample
