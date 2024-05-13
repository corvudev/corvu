import {
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { useInternalDialogContext } from '@src/context'

export const DEFAULT_DIALOG_DESCRIPTION_ELEMENT = 'p'

export type DialogDescriptionCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type DialogDescriptionSharedElementProps = {}

export type DialogDescriptionElementProps =
  DialogDescriptionSharedElementProps & {
    id: string | undefined
    'data-corvu-dialog-description': '' | null
  }

export type DialogDescriptionProps = DialogDescriptionCorvuProps &
  Partial<DialogDescriptionSharedElementProps>

/** Description element to announce the dialog to accessibility tools.
 *
 * @data `data-corvu-dialog-description` - Present on every dialog description element.
 */
const DialogDescription = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_DESCRIPTION_ELEMENT,
>(
  props: DynamicProps<T, DialogDescriptionProps, DialogDescriptionElementProps>,
) => {
  const [localProps, otherProps] = splitProps(props as DialogDescriptionProps, [
    'contextId',
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
    <Dynamic<DialogDescriptionElementProps>
      as={DEFAULT_DIALOG_DESCRIPTION_ELEMENT}
      // === ElementProps ===
      id={context().descriptionId()}
      data-corvu-dialog-description=""
      {...otherProps}
    />
  )
}

export default DialogDescription
