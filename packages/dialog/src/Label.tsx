import {
  createEffect,
  createMemo,
  onCleanup,
  splitProps,
  type ValidComponent,
} from 'solid-js'
import { Dynamic, type DynamicProps } from '@corvu/utils/dynamic'
import { useInternalDialogContext } from '@src/context'

export const DEFAULT_DIALOG_LABEL_ELEMENT = 'h2'

export type DialogLabelCorvuProps = {
  /**
   * The `id` of the dialog context to use.
   */
  contextId?: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type DialogLabelSharedElementProps = {}

export type DialogLabelElementProps = DialogLabelSharedElementProps & {
  id: string | undefined
  'data-corvu-dialog-label': string | null
}

export type DialogLabelProps = DialogLabelCorvuProps &
  Partial<DialogLabelSharedElementProps>

/** Label element to announce the dialog to accessibility tools.
 *
 * @data `data-corvu-dialog-label` - Present on every dialog label element.
 */
const DialogLabel = <
  T extends ValidComponent = typeof DEFAULT_DIALOG_LABEL_ELEMENT,
>(
  props: DynamicProps<T, DialogLabelProps, DialogLabelElementProps>,
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
      as={DEFAULT_DIALOG_LABEL_ELEMENT}
      // === ElementProps ===
      id={context().labelId()}
      data-corvu-dialog-label=""
      {...otherProps}
    />
  )
}

export default DialogLabel
