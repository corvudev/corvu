import type { PanelInstance } from '@src/lib/types'
import type { Size } from '@corvu/utils'

const resolveSize = (size: Size, rootSize: number) => {
  if (typeof size === 'number') {
    return size
  }
  if (!size.endsWith('px')) {
    throw new Error(
      `[corvu] Sizes must be a number or a string ending with 'px'. Got ${size}`,
    )
  }
  return fixToPrecision(parseFloat(size) / rootSize)
}

const splitPanels = (props: {
  panels: PanelInstance[]
  focusedElement: Element
}): [PanelInstance[], PanelInstance[]] => {
  const precedingPanels = props.panels.filter(
    (panel) =>
      props.focusedElement.compareDocumentPosition(panel.data.element) &
      Node.DOCUMENT_POSITION_PRECEDING,
  )
  const followingPanels = props.panels.filter(
    (panel) =>
      props.focusedElement.compareDocumentPosition(panel.data.element) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  )

  return [precedingPanels, followingPanels]
}

const PRECISION = 6
const fixToPrecision = (value: number) => parseFloat(value.toFixed(PRECISION))

export { resolveSize, splitPanels, fixToPrecision }
