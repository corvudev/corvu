import { callEventHandler, type ElementOf } from '@corvu/utils/dom'
import {
  type Component,
  createMemo,
  type JSX,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import {
  DynamicButton,
  type DynamicButtonElementProps,
  type DynamicButtonSharedElementProps,
  type DynamicProps,
} from '@corvu/utils/dynamic'
import { dataIf } from '@corvu/utils'
import { useInternalDisclosureContext } from '@src/context'

export type DisclosureTriggerCorvuProps = {
  /**
   * The `id` of the disclosure context to use.
   */
  contextId?: string
}

export type DisclosureTriggerSharedElementProps<
  T extends ValidComponent = 'button',
> = {
  onClick: JSX.EventHandlerUnion<ElementOf<T>, MouseEvent>
} & DynamicButtonSharedElementProps<T>

export type DisclosureTriggerElementProps =
  DisclosureTriggerSharedElementProps & {
    'aria-controls': string
    'aria-expanded': 'true' | 'false'
    'data-collapsed': '' | undefined
    'data-expanded': '' | undefined
    'data-corvu-disclosure-trigger': '' | null
  } & DynamicButtonElementProps

export type DisclosureTriggerProps<T extends ValidComponent = 'button'> =
  DisclosureTriggerCorvuProps & Partial<DisclosureTriggerSharedElementProps<T>>

/** Button that changes the open state of the disclosure when clicked.
 *
 * @data `data-corvu-disclosure-trigger` - Present on every disclosure trigger element.
 * @data `data-expanded` - Present when the disclosure is expanded.
 * @data `data-collapsed` - Present when the disclosure is collapsed.
 */
const DisclosureTrigger = <T extends ValidComponent = 'button'>(
  props: DynamicProps<T, DisclosureTriggerProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as DisclosureTriggerProps, [
    'contextId',
    'onClick',
  ])

  const context = createMemo(() =>
    useInternalDisclosureContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().setExpanded((expanded) => !expanded)
  }

  return (
    <DynamicButton<
      Component<
        Omit<DisclosureTriggerElementProps, keyof DynamicButtonElementProps>
      >
    >
      // === SharedElementProps ===
      onClick={onClick}
      // === ElementProps ===
      aria-controls={context().disclosureId()}
      aria-expanded={context().expanded() ? 'true' : 'false'}
      data-collapsed={dataIf(!context().expanded())}
      data-expanded={dataIf(context().expanded())}
      data-corvu-disclosure-trigger=""
      {...otherProps}
    />
  )
}

export default DisclosureTrigger
