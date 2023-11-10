import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { OverrideComponentProps } from '@lib/types'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { splitProps } from 'solid-js'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_DESCRIPTION_ELEMENT = 'p'

export type DialogDescriptionProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
> = OverrideComponentProps<T, PolymorphicAttributes<T>>

const DialogDescription = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DialogDescriptionProps<T>,
) => {
  const { descriptionId } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as'])

  return (
    <Polymorphic
      as={
        localProps.as ?? (DEFAULT_DIALOG_DESCRIPTION_ELEMENT as ValidComponent)
      }
      id={descriptionId()}
      data-corvu-dialog-description
      {...otherProps}
    />
  )
}

export default DialogDescription
