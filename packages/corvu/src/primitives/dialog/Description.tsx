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

export const DEFAULT_DIALOG_DESCRIPTION_ELEMENT = 'p'

export type DialogDescriptionProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
> = OverrideComponentProps<
  T,
  PolymorphicAttributes<T> & {
    /** The `id` of the dialog context to use. */
    contextId?: string
    /** @hidden */
    'data-corvu-dialog-description'?: string | undefined
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
  const [localProps, otherProps] = splitProps(props, [
    'as',
    'contextId',
    'data-corvu-dialog-description',
  ])

  const context = createMemo(() =>
    useInternalDialogContext(localProps.contextId),
  )

  createEffect(() => {
    const _context = context()
    _context.registerDescriptionId()
    onCleanup(() => _context.unregisterDescriptionId())
  })

  return (
    <Polymorphic
      as={
        localProps.as ?? (DEFAULT_DIALOG_DESCRIPTION_ELEMENT as ValidComponent)
      }
      id={context().descriptionId()}
      data-corvu-dialog-description={
        localProps.hasOwnProperty('data-corvu-dialog-description')
          ? localProps['data-corvu-dialog-description']
          : ''
      }
      {...otherProps}
    />
  )
}

export default DialogDescription
