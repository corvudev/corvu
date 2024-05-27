import { Show, type VoidComponent } from 'solid-js'
import clsx from 'clsx'
import OtpField from '@corvu/otp-field'

const OtpFieldExample: VoidComponent = () => {
  return (
    <div class="flex size-full items-center justify-center">
      <OtpField maxLength={6} class="flex">
        <OtpField.Input aria-label="Verification Code" />
        <div class="flex items-center space-x-2">
          <Slot index={0} />
          <Slot index={1} />
          <Slot index={2} />
        </div>
        <div class="flex size-10 items-center justify-center font-bold">-</div>
        <div class="flex items-center space-x-2">
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
      class={clsx(
        'flex size-10 items-center justify-center rounded-md bg-corvu-100 font-mono text-sm font-bold transition-all',
        {
          'ring-corvu-text ring-2': context.activeSlots().includes(props.index),
        },
      )}
    >
      {char()}
      <Show when={showFakeCaret()}>
        <div class="pointer-events-none flex items-center justify-center">
          <div class="h-4 w-px animate-caret-blink bg-corvu-text duration-1000" />
        </div>
      </Show>
    </div>
  )
}

export default OtpFieldExample
