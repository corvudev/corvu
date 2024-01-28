import {
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import Polymorphic, {
  type PolymorphicAttributes,
} from '@lib/components/Polymorphic'
import type { OverrideComponentProps } from '@lib/types'
import { useInternalDialogContext } from '@primitives/dialog/context'

const DEFAULT_DIALOG_LABEL_ELEMENT = 'h2'

export type DialogLabelProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_LABEL_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /**
     * The `id` of the dialog context to use.
     */
    contextId?: string
    /** @hidden */
    'data-corvu-dialog-label'?: string | undefined
  }
>

/** Label element to announce the dialog to accessibility tools.
 *
 * @data `data-corvu-dialog-label` - Present on every dialog label element.
 */
const DialogLabel = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_LABEL_ELEMENT,
>(
  props: DialogLabelProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'contextId',
    'data-corvu-dialog-label',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  createEffect(() => {
    const _context = context()
    _context.registerLabelId()
    onCleanup(() => _context.unregisterLabelId())
  })

  return (
    <Polymorphic
      as={localProps.as ?? (DEFAULT_DIALOG_LABEL_ELEMENT as ValidComponent)}
      id={context().labelId()}
      data-corvu-dialog-label={
        localProps.hasOwnProperty('data-corvu-dialog-label')
          ? localProps['data-corvu-dialog-label']
          : ''
      }
      {...otherProps}
    />
  )
}

export default DialogLabel
