import type { CursorStyle } from '@primitives/resizable/lib/types'
import { fixToPrecision } from '@primitives/resizable/lib/utils'

let globalCursorStyle: CursorStyle = null
let cursorStyleElement: HTMLStyleElement | null = null
let globalResizeConstraints = 0b0000

/**
 * Constraint to cursor style mapping
 *
 * 1st bit: Exceeded horizontal min
 * 2nd bit: Exceeded horizontal max
 * 3rd bit: Exceeded vertical min
 * 4th bit: Exceeded vertical max
 */
const constraintToCursorMap: { [key: number]: string } = {
  0b0001: 'e-resize',
  0b0010: 'w-resize',
  0b0011: 'ew-resize',
  0b0100: 's-resize',
  0b1000: 'n-resize',
  0b1100: 'ns-resize',
  0b0101: 'se-resize',
  0b1001: 'ne-resize',
  0b0110: 'sw-resize',
  0b1010: 'nw-resize',
}

let cachedCursorStyle: string | null = null

const updateCursorStyle = () => {
  if (!globalCursorStyle) {
    if (cursorStyleElement) {
      cachedCursorStyle = null
      cursorStyleElement.remove()
      cursorStyleElement = null
    }
    return
  }

  let cursorStyle: string | null =
    constraintToCursorMap[globalResizeConstraints] ?? null
  if (cursorStyle === null) {
    switch (globalCursorStyle) {
      case 'horizontal':
        cursorStyle = 'col-resize'
        break
      case 'vertical':
        cursorStyle = 'row-resize'
        break
      case 'both':
        cursorStyle = 'move'
        break
    }
  }

  if (cursorStyle === cachedCursorStyle) return
  cachedCursorStyle = cursorStyle

  if (!cursorStyleElement) {
    cursorStyleElement = document.createElement('style')
    document.head.appendChild(cursorStyleElement)
  }
  cursorStyleElement.innerHTML = `*{cursor: ${cursorStyle}!important;}`
}

const reportResizeConstraints = (
  orientation: 'horizontal' | 'vertical',
  constraints: number,
) => {
  switch (orientation) {
    case 'horizontal':
      if (constraints === 0b01) {
        globalResizeConstraints |= 0b0001
        globalResizeConstraints &= ~0b0010
      } else if (constraints === 0b10) {
        globalResizeConstraints |= 0b0010
        globalResizeConstraints &= ~0b0001
      } else if (constraints === 0b11) {
        globalResizeConstraints |= 0b0011
      } else {
        globalResizeConstraints &= ~0b0011
      }
      break
    case 'vertical':
      if (constraints === 0b01) {
        globalResizeConstraints |= 0b0100
        globalResizeConstraints &= ~0b1000
      } else if (constraints === 0b10) {
        globalResizeConstraints |= 0b1000
        globalResizeConstraints &= ~0b0100
      } else if (constraints === 0b11) {
        globalResizeConstraints |= 0b1100
      } else {
        globalResizeConstraints &= ~0b1100
      }
      break
  }
  updateCursorStyle()
}

const resetResizeConstraints = () => {
  globalResizeConstraints = 0b0000
  updateCursorStyle()
}

const setGlobalCursorStyle = (cursorStyle: CursorStyle) => {
  globalCursorStyle = cursorStyle
  updateCursorStyle()
}

/* eslint-disable solid/reactivity */
const handleResizeConstraints = (props: {
  orientation: 'horizontal' | 'vertical'
  desiredPercentage: number
  distributablePercentage: number
  revertConstraints?: boolean
  betweenCollapse?: boolean
}) => {
  if (
    fixToPrecision(props.distributablePercentage) !==
    fixToPrecision(props.desiredPercentage)
  ) {
    let constraints = null
    if (props.betweenCollapse === true) {
      constraints = 0b11
    } else if (
      (props.desiredPercentage < props.distributablePercentage &&
        props.revertConstraints !== true) ||
      (props.desiredPercentage > props.distributablePercentage &&
        props.revertConstraints === true)
    ) {
      constraints = 0b01
    } else {
      constraints = 0b10
    }

    reportResizeConstraints(props.orientation, constraints)
  } else {
    reportResizeConstraints(props.orientation, 0b00)
  }
}

export { resetResizeConstraints, setGlobalCursorStyle, handleResizeConstraints }
