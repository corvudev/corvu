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
import { callEventHandler } from '@corvu/utils/dom'
import { dataIf } from '@corvu/utils'
import { useInternalDisclosureContext } from '@src/context'

export const DEFAULT_DISCLOSURE_TRIGGER_ELEMENT = 'button'

export type DisclosureTriggerCorvuProps = {
  /**
   * The `id` of the disclosure context to use.
   */
  contextId?: string
}

export type DisclosureTriggerSharedElementProps = {
  onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
} & DynamicButtonSharedElementProps

export type DisclosureTriggerElementProps =
  DisclosureTriggerSharedElementProps & {
    'aria-controls': string
    'aria-expanded': 'true' | 'false'
    'data-collapsed': '' | undefined
    'data-expanded': '' | undefined
    'data-corvu-disclosure-trigger': '' | null
  } & DynamicButtonElementProps

export type DisclosureTriggerProps = DisclosureTriggerCorvuProps &
  Partial<DisclosureTriggerSharedElementProps>

/** Button that changes the open state of the disclosure when clicked.
 *
 * @data `data-corvu-disclosure-trigger` - Present on every disclosure trigger element.
 * @data `data-expanded` - Present when the disclosure is expanded.
 * @data `data-collapsed` - Present when the disclosure is collapsed.
 */
const DisclosureTrigger = <
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
>(
  props: DynamicProps<T, DisclosureTriggerProps, DisclosureTriggerElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DisclosureTriggerProps, [
    'contextId',
    'onClick',
  ])

  const context = createMemo(() =>
    useInternalDisclosureContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().setExpanded((expanded) => !expanded)
  }

  return (
    <DynamicButton<
      Component<
        Omit<DisclosureTriggerElementProps, keyof DynamicButtonElementProps>
      >
    >
      as={DEFAULT_DISCLOSURE_TRIGGER_ELEMENT}
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
