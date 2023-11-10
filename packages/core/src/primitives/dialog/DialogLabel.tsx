import Polymorphic, { PolymorphicAttributes } from '@lib/components/Polymorphic'
import { useDialogContext } from '@primitives/dialog/DialogContext'
import { splitProps } from 'solid-js'
import type { OverrideComponentProps } from '@lib/types'
import type { ValidComponent } from 'solid-js'

const DEFAULT_DIALOG_LABEL_ELEMENT = 'h2'

export type DialogLabelProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_LABEL_ELEMENT,
> = OverrideComponentProps<T, PolymorphicAttributes<T>>

const DialogLabel = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_LABEL_ELEMENT,
>(
  props: DialogLabelProps<T>,
) => {
  const { labelId } = useDialogContext()

  const [localProps, otherProps] = splitProps(props, ['as'])

  return (
    <Polymorphic
      as={localProps.as ?? (DEFAULT_DIALOG_LABEL_ELEMENT as ValidComponent)}
      id={labelId()}
      data-corvu-dialog-label
      {...otherProps}
    />
  )
}

export default DialogLabel
