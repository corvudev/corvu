import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { OverrideComponentProps } from '@lib/types'
import { useInternalDialogContext } from '@primitives/dialog/DialogContext'
import { createMemo, splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_DESCRIPTION_ELEMENT = 'p'

export type DialogDescriptionProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** The `id` of the dialog context to use. */
    contextId?: string
  }
>

/** Description element to announce the dialog to accessibility tools.
 *
 * @data `data-corvu-dialog-description` - Present on every dialog description element.
 */
const DialogDescription = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogDescriptionProps<T>,
) => {
  const [localProps, otherProps] = splitProps(props, ['as', 'contextId'])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  return (
    <Polymorphic
      as={
        localProps.as ?? (DEFAULT_DIALOG_DESCRIPTION_ELEMENT as ValidComponent)
      }
      id={context().descriptionId()}
      data-corvu-dialog-description
      {...otherProps}
    />
  )
}

export default DialogDescription
