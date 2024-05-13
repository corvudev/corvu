import {
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import {
  Dynamic,
  type DynamicAttributes,
  type OverrideComponentProps,
} from '@corvu/utils/dynamic'
import { useInternalDialogContext } from '@src/context'

export const DEFAULT_DIALOG_DESCRIPTION_ELEMENT = 'p'

export type DialogDescriptionProps<
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
> = OverrideComponentProps<
  T,
  DynamicAttributes<T> & {
    /**
     * The `id` of the dialog context to use.
     */
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
    <Dynamic
      as={
        (localProps.as as ValidComponent | undefined) ??
        DEFAULT_DIALOG_DESCRIPTION_ELEMENT
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
