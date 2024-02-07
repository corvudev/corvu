import { callEventHandler, dataIf } from '@lib/utils'
import { createMemo, type JSX, splitProps, type ValidComponent } from 'solid-js'
import type { DynamicAttributes } from '@lib/components/Dynamic'
import DynamicButton from '@lib/components/DynamicButton'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalDisclosureContext } from '@primitives/disclosure/context'

export const DEFAULT_DISCLOSURE_TRIGGER_ELEMENT = 'button'

export type DisclosureTriggerProps<
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * The `id` of the disclosure context to use.
     */
    contextId?: string
    /** @hidden */
    onClick?: JSX.EventHandlerUnion<HTMLElement, MouseEvent>
    /** @hidden */
    'data-corvu-disclosure-trigger'?: string | undefined
  }
>

/** Button that changes the open state of the disclosure when clicked.
 *
 * @data `data-corvu-disclosure-trigger` - Present on every disclosure trigger element.
 * @data `data-expanded` - Present when the disclosure is expanded.
 * @data `data-collapsed` - Present when the disclosure is collapsed.
 */
const DisclosureTrigger = <
  T extends ValidComponent = typeof DEFAULT_DISCLOSURE_TRIGGER_ELEMENT,
>(
  props: DisclosureTriggerProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'contextId',
    'onClick',
    'data-corvu-disclosure-trigger',
  ])

  const context = createMemo(() =>
    useInternalDisclosureContext(localProps.contextId),
  )

  const onClick: JSX.EventHandlerUnion<HTMLElement, MouseEvent> = (e) => {
    !callEventHandler(localProps.onClick, e) &&
      context().setExpanded((expanded) => !expanded)
  }

  return (
    <DynamicButton
      as={
        localProps.as ?? (DEFAULT_DISCLOSURE_TRIGGER_ELEMENT as ValidComponent)
      }
      onClick={onClick}
      aria-expanded={context().expanded() ? 'true' : 'false'}
      aria-controls={context().disclosureId()}
      data-expanded={dataIf(context().expanded())}
      data-collapsed={dataIf(!context().expanded())}
      data-corvu-disclosure-trigger={
        localProps.hasOwnProperty('data-corvu-disclosure-trigger')
          ? localProps['data-corvu-disclosure-trigger']
          : ''
      }
      {...otherProps}
    />
  )
}

export default DisclosureTrigger
