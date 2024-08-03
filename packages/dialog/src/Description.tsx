import {
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { useInternalDialogContext } from '@src/context'

export type DialogDescriptionCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

export type DialogDescriptionSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = 'p',
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
> = {}

export type DialogDescriptionElementProps =
  DialogDescriptionSharedElementProps & {
    id: string | undefined
    'data-corvu-dialog-description': '' | null
  }

export type DialogDescriptionProps<T extends ValidComponent = 'p'> =
  DialogDescriptionCorvuProps & Partial<DialogDescriptionSharedElementProps<T>>

/** Description element to announce the dialog to accessibility tools.
 *
 * @data `data-corvu-dialog-description` - Present on every dialog description element.
 */
const DialogDescription = <T extends ValidComponent = 'p'>(
  props: DynamicProps<T, DialogDescriptionProps<T>>,
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
      as="p"
      // === ElementProps ===
      id={context().descriptionId()}
      data-corvu-dialog-description=""
      {...otherProps}
    />
  )
}

export default DialogDescription
