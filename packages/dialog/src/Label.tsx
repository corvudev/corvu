import {
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { useInternalDialogContext } from '@src/context'

export type DialogLabelCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
export type DialogLabelSharedElementProps<T extends ValidComponent = 'h2'> = {}

export type DialogLabelElementProps = DialogLabelSharedElementProps & {
  id: string | undefined
  'data-corvu-dialog-label': string | null
}

export type DialogLabelProps<T extends ValidComponent = 'h2'> =
  DialogLabelCorvuProps & Partial<DialogLabelSharedElementProps<T>>

/** Label element to announce the dialog to accessibility tools.
 *
 * @data `data-corvu-dialog-label` - Present on every dialog label element.
 */
const DialogLabel = <T extends ValidComponent = 'h2'>(
  props: DynamicProps<T, DialogLabelProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as DialogLabelProps, [
    'contextId',
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
    <Dynamic<DialogLabelElementProps>
      as="h2"
      // === ElementProps ===
      id={context().labelId()}
      data-corvu-dialog-label=""
      {...otherProps}
    />
  )
}

export default DialogLabel
