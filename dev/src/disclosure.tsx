import Disclosure, { DynamicProps, TriggerProps } from '@corvu/disclosure'
import { Component } from 'solid-js'

const Test = () => {
  return (
    <Disclosure>
      <Disclosure.Trigger
        as={(props: { 'aria-random': string }) => <button {...props} />}
        aria-random="random"
      />
      <Disclosure.Content>Content</Disclosure.Content>
    </Disclosure>
  )
}

const Test2 = () => {
  return (
    <Disclosure>
      <Disclosure.Trigger<Component<{ 'aria-random': string }>>
        as={(props) => <button {...props} />}
        aria-random="random"
      />
      <CustomDisclosureTrigger test="test" />
    </Disclosure>
  )
}

const CustomDisclosureTrigger = (
  props: DynamicProps<
    'button',
    TriggerProps & {
      test: string
    }
  >,
) => {
  return <Disclosure.Trigger {...props} />
}

export { Test, Test2 }
