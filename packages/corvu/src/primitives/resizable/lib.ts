/* eslint-disable solid/reactivity */
import type { PanelInstance } from '@primitives/resizable/Panel'

const resizePanels = (props: {
  delta: number
  handle: Element
  panels: PanelInstance[]
  originalSizes: number[]
  resizableSize: number
}) => {
  const precedingPanels = props.panels.filter(
    (panel) =>
      props.handle.compareDocumentPosition(panel.data.element) &
      Node.DOCUMENT_POSITION_PRECEDING,
  )
  const followingPanels = props.panels.filter(
    (panel) =>
      props.handle.compareDocumentPosition(panel.data.element) &
      Node.DOCUMENT_POSITION_FOLLOWING,
  )
  const newSizes = props.originalSizes
  const distributedPrecedingSize = 0
  // This is hella interesting to implement :D
  // Big todo
  for (let i = 0; i < precedingPanels.length; i++) {
    const panel = precedingPanels[i]!
    const panelSize = panel.size() * props.resizableSize
    console.log(panelSize)
  }
}

export { resizePanels }
