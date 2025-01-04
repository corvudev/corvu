import { fixToPrecision, resolveSize, splitPanels } from '@src/lib/utils'
import type { PanelInstance, ResizeStrategy } from '@src/lib/types'
import { handleResizeConstraints } from '@src/lib/cursor'
import { type Setter } from 'solid-js'

/**
 * Calculates the distributable percentage for the given desired percentage and resize actions.
 * @param desiredPercentage - The desired percentage to distribute.
 * @param initialSizes - The initial sizes of the panels.
 * @param collapsible - Whether the panels are allowed to collapse to distribute the percentage.
 * @param resizeActions - The resize actions to distribute the percentage.
 * @param resizableData - Data related to the resizable instance.
 * @returns number - The distributable percentage.
 */
const getDistributablePercentage = (props: {
  desiredPercentage: number
  initialSizes: number[]
  collapsible: boolean
  resizeActions: {
    precedingPanels: PanelInstance[]
    followingPanels: PanelInstance[]
    negate?: boolean
  }[]
  resizableData: {
    rootSize: number
  }
}) => {
  let distributablePercentage =
    props.desiredPercentage >= 0 ? Infinity : -Infinity
  let newSizes = props.initialSizes
  for (const resizeAction of props.resizeActions) {
    const desiredPercentage =
      resizeAction.negate !== true
        ? props.desiredPercentage
        : -props.desiredPercentage

    let [
      distributedPercentagePreceding,
      // eslint-disable-next-line prefer-const
      distributedSizesPreceding,
      // eslint-disable-next-line prefer-const
      collapsedPreceding,
    ] = distributePercentage({
      desiredPercentage,
      side: 'preceding',
      panels: resizeAction.precedingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: 0,
      collapsible: props.collapsible,
      rootSize: props.resizableData.rootSize,
    })
    let [
      distributedPercentageFollowing,
      // eslint-disable-next-line prefer-const
      distributedSizesFollowing,
      // eslint-disable-next-line prefer-const
      collapsedFollowing,
    ] = distributePercentage({
      desiredPercentage,
      side: 'following',
      panels: resizeAction.followingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: resizeAction.precedingPanels.length,
      collapsible: props.collapsible,
      rootSize: props.resizableData.rootSize,
    })

    if (resizeAction.negate === true) {
      distributedPercentagePreceding = -distributedPercentagePreceding
      distributedPercentageFollowing = -distributedPercentageFollowing
    }
    if (collapsedPreceding) {
      distributedPercentageFollowing = distributedPercentagePreceding
    }
    if (collapsedFollowing) {
      distributedPercentagePreceding = distributedPercentageFollowing
    }

    if (props.desiredPercentage >= 0) {
      distributablePercentage = Math.min(
        distributablePercentage,
        Math.min(
          distributedPercentagePreceding,
          distributedPercentageFollowing,
        ),
      )
    } else {
      distributablePercentage = Math.max(
        distributablePercentage,
        Math.max(
          distributedPercentagePreceding,
          distributedPercentageFollowing,
        ),
      )
    }

    newSizes = [...distributedSizesPreceding, ...distributedSizesFollowing]
  }
  return distributablePercentage
}

/**
 * Tries to distribute the desired percentage to the given panels. Doesn't actually resize the panels and is used to calculate the distributable percentage.
 * @param desiredPercentage - The desired percentage to distribute.
 * @param side - Whether the panels are preceding or following the handle.
 * @param panels - The panels to resize.
 * @param initialSizes - The initial sizes of the panels.
 * @param initialSizesStartIndex - The index of the initial sizes to start from.
 * @param collapsible - Whether the panels are allowed to collapse to distribute the percentage.
 * @param rootSize - The resizable root size in pixels.
 * @returns [number, number[], boolean] - The distributed percentage, the panel sizes after distribution, and whether a panel was collapsed.
 */
const distributePercentage = (props: {
  desiredPercentage: number
  side: 'preceding' | 'following'
  panels: PanelInstance[]
  initialSizes: number[]
  initialSizesStartIndex: number
  collapsible: boolean
  rootSize: number
}): [number, number[], boolean] => {
  const resizeDirection = getResizeDirection({
    side: props.side,
    desiredPercentage: props.desiredPercentage,
  })
  let distributedPercentage = 0
  const distributedSizes = props.initialSizes.slice(
    props.initialSizesStartIndex,
    props.initialSizesStartIndex + props.panels.length,
  )

  for (
    let i = props.side === 'preceding' ? props.panels.length - 1 : 0;
    props.side === 'preceding' ? i >= 0 : i < props.panels.length;
    props.side === 'preceding' ? i-- : i++
  ) {
    const panel = props.panels[i]!
    const panelSize = props.initialSizes[i + props.initialSizesStartIndex]!
    const collapsedSize = resolveSize(
      panel.data.collapsedSize ?? 0,
      props.rootSize,
    )
    if (panel.data.collapsible && panelSize === collapsedSize) continue

    const availablePercentage = props.desiredPercentage - distributedPercentage
    if (availablePercentage === 0) break

    switch (resizeDirection) {
      case 'precedingDecreasing': {
        const minSize = resolveSize(panel.data.minSize, props.rootSize)
        distributedSizes[i] = Math.max(minSize, panelSize + availablePercentage)
        distributedPercentage += distributedSizes[i]! - panelSize
        break
      }
      case 'followingDecreasing': {
        const minSize = resolveSize(panel.data.minSize, props.rootSize)
        distributedSizes[i] = Math.max(minSize, panelSize - availablePercentage)
        distributedPercentage -= distributedSizes[i]! - panelSize
        break
      }
      case 'precedingIncreasing': {
        const maxSize = resolveSize(panel.data.maxSize, props.rootSize)
        distributedSizes[i] = Math.min(maxSize, panelSize + availablePercentage)
        distributedPercentage += distributedSizes[i]! - panelSize
        break
      }
      case 'followingIncreasing': {
        const maxSize = resolveSize(panel.data.maxSize, props.rootSize)
        distributedSizes[i] = Math.min(maxSize, panelSize - availablePercentage)
        distributedPercentage -= distributedSizes[i]! - panelSize
        break
      }
    }
  }

  if (!props.collapsible || distributedPercentage === props.desiredPercentage) {
    return [distributedPercentage, distributedSizes, false]
  }

  const panelIndex = props.side === 'preceding' ? props.panels.length - 1 : 0
  const panel = props.panels[panelIndex]!
  if (!panel.data.collapsible) {
    return [distributedPercentage, distributedSizes, false]
  }

  const availablePercentage = props.desiredPercentage - distributedPercentage
  let collapsed = false

  const panelSize =
    props.initialSizes[panelIndex + props.initialSizesStartIndex]!
  const collapsedSize = resolveSize(
    panel.data.collapsedSize ?? 0,
    props.rootSize,
  )
  const collapseThreshold = resolveSize(
    panel.data.collapseThreshold ?? 0,
    props.rootSize,
  )
  const isCollapsed = panelSize === collapsedSize

  if (
    resizeDirection === 'precedingDecreasing' &&
    !isCollapsed &&
    Math.abs(availablePercentage) > collapseThreshold
  ) {
    distributedPercentage -= distributedSizes[panelIndex]! - panelSize
    distributedSizes[panelIndex] = collapsedSize
    distributedPercentage += distributedSizes[panelIndex]! - panelSize
    collapsed = true
  } else if (
    resizeDirection === 'precedingIncreasing' &&
    isCollapsed &&
    Math.abs(availablePercentage) > collapseThreshold
  ) {
    const minSize = resolveSize(panel.data.minSize, props.rootSize)
    distributedSizes[panelIndex] = minSize
    if (Math.abs(availablePercentage) > minSize - collapsedSize) {
      const maxSize = resolveSize(panel.data.maxSize, props.rootSize)
      distributedSizes[panelIndex] = Math.min(
        maxSize,
        panelSize + availablePercentage,
      )
    } else {
      collapsed = true
    }
    distributedPercentage += distributedSizes[panelIndex]! - panelSize
  } else if (
    resizeDirection === 'followingDecreasing' &&
    !isCollapsed &&
    Math.abs(availablePercentage) > collapseThreshold
  ) {
    distributedPercentage += distributedSizes[panelIndex]! - panelSize
    distributedSizes[panelIndex] = collapsedSize
    distributedPercentage -= distributedSizes[panelIndex]! - panelSize
    collapsed = true
  } else if (
    resizeDirection === 'followingIncreasing' &&
    isCollapsed &&
    Math.abs(availablePercentage) > collapseThreshold
  ) {
    const minSize = resolveSize(panel.data.minSize, props.rootSize)
    distributedSizes[panelIndex] = minSize

    if (Math.abs(availablePercentage) > minSize - collapsedSize) {
      const maxSize = resolveSize(panel.data.maxSize, props.rootSize)
      distributedSizes[panelIndex] = Math.min(
        maxSize,
        panelSize - availablePercentage,
      )
    } else {
      collapsed = true
    }
    distributedPercentage -= distributedSizes[panelIndex]! - panelSize
  }

  return [distributedPercentage, distributedSizes, collapsed]
}

/**
 * Figure out the resize direction based on the desired percentage and side.
 * @param side - Whether the panels to resize are preceding or following the handle.
 * @param desiredPercentage - The desired percentage to resize.
 * @returns 'precedingIncreasing' | 'precedingDecreasing' | 'followingIncreasing' | 'followingDecreasing' - The resize direction.
 */
const getResizeDirection = (props: {
  side: 'preceding' | 'following'
  desiredPercentage: number
}) => {
  switch (props.side) {
    case 'preceding':
      return props.desiredPercentage >= 0
        ? 'precedingIncreasing'
        : 'precedingDecreasing'
    case 'following':
      return props.desiredPercentage >= 0
        ? 'followingDecreasing'
        : 'followingIncreasing'
  }
}

/**
 * Resizes panels based on given resize actions.
 * @param initialSizes - The initial sizes of the panels.
 * @param collapsible - Whether the panels are allowed to collapse to distribute the percentage.
 * @param resizeActions - The resize actions to distribute the percentage.
 * @param resizableData - Data related to the resizable instance.
 */
const resize = (props: {
  initialSizes: number[]
  collapsible: boolean
  resizeActions: {
    precedingPanels: PanelInstance[]
    followingPanels: PanelInstance[]
    deltaPercentage: number
  }[]
  resizableData: {
    rootSize: number
    orientation: 'horizontal' | 'vertical'
    setSizes: Setter<number[]>
  }
}) => {
  let newSizes = props.initialSizes
  for (const resizeAction of props.resizeActions) {
    const [, distributedSizesPreceding] = distributePercentage({
      desiredPercentage: resizeAction.deltaPercentage,
      side: 'preceding',
      panels: resizeAction.precedingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: 0,
      collapsible: props.collapsible,
      rootSize: props.resizableData.rootSize,
    })
    const [, distributedSizesFollowing] = distributePercentage({
      desiredPercentage: resizeAction.deltaPercentage,
      side: 'following',
      panels: resizeAction.followingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: resizeAction.precedingPanels.length,
      collapsible: props.collapsible,
      rootSize: props.resizableData.rootSize,
    })

    newSizes = [...distributedSizesPreceding, ...distributedSizesFollowing]
  }

  newSizes = newSizes.map(fixToPrecision)
  const totalSize = newSizes.reduce((totalSize, size) => totalSize + size, 0)
  if (totalSize !== 1) {
    const offset = totalSize - 1
    const offsetPerPanel = offset / newSizes.length
    // TODO: Recognize min and max sizes
    newSizes = newSizes.map((size) => size - offsetPerPanel)
  }

  props.resizableData.setSizes(newSizes.map(fixToPrecision))
}

/**
 * Resizes a panel by using the given strategy.
 * @param deltaPercentage - The delta percentage to resize the panel.
 * @param strategy - The resize strategy to apply.
 * @param panel - The panel to resize.
 * @param panels - The panels to resize.
 * @param initialSizes - The initial sizes of the panels.
 * @param collapsible - Whether the panels are allowed to collapse to distribute the percentage.
 * @param resizableData - Data related to the resizable instance.
 */
const resizePanel = (props: {
  deltaPercentage: number
  strategy: ResizeStrategy
  panel: PanelInstance
  panels: PanelInstance[]
  initialSizes: number[]
  collapsible: boolean
  resizableData: {
    rootSize: number
    orientation: 'horizontal' | 'vertical'
    setSizes: Setter<number[]>
  }
}) => {
  let [precedingPanels, followingPanels] = splitPanels({
    panels: props.panels,
    focusedElement: props.panel.data.element,
  })

  const panelIndex = props.panels.indexOf(props.panel)
  if (panelIndex === 0) {
    props.strategy = 'following'
  } else if (panelIndex === props.panels.length - 1) {
    props.strategy = 'preceding'
  }

  if (props.strategy === 'both') {
    const precedingPanelsIncluding = [...precedingPanels, props.panel]
    const followingPanelsIncluding = [props.panel, ...followingPanels]
    const distributablePercentage = getDistributablePercentage({
      desiredPercentage: props.deltaPercentage / 2,
      initialSizes: props.initialSizes,
      collapsible: true,
      resizeActions: [
        {
          precedingPanels: precedingPanelsIncluding,
          followingPanels,
        },
        {
          precedingPanels,
          followingPanels: followingPanelsIncluding,
          negate: true,
        },
      ],
      resizableData: {
        rootSize: props.resizableData.rootSize,
      },
    })

    resize({
      initialSizes: props.initialSizes,
      collapsible: true,
      resizeActions: [
        {
          precedingPanels: precedingPanelsIncluding,
          followingPanels,
          deltaPercentage: distributablePercentage,
        },
        {
          precedingPanels,
          followingPanels: followingPanelsIncluding,
          deltaPercentage: -distributablePercentage,
        },
      ],
      resizableData: props.resizableData,
    })
  } else {
    precedingPanels =
      props.strategy === 'preceding'
        ? precedingPanels
        : [...precedingPanels, props.panel]
    followingPanels =
      props.strategy === 'following'
        ? followingPanels
        : [props.panel, ...followingPanels]

    if (props.strategy === 'preceding') {
      props.deltaPercentage = -props.deltaPercentage
    }

    const distributablePercentage = getDistributablePercentage({
      desiredPercentage: props.deltaPercentage,
      initialSizes: props.initialSizes,
      collapsible: props.collapsible,
      resizeActions: [
        {
          precedingPanels,
          followingPanels,
        },
      ],
      resizableData: {
        rootSize: props.resizableData.rootSize,
      },
    })

    resize({
      initialSizes: props.initialSizes,
      collapsible: true,
      resizeActions: [
        {
          precedingPanels,
          followingPanels,
          deltaPercentage: distributablePercentage,
        },
      ],
      resizableData: props.resizableData,
    })
  }
}

/**
 * Resizes panels based on the given delta percentage. Supports alt key resize mode.
 * @param deltaPercentage - The delta percentage to resize the panels.
 * #param altKey - Whether the alt key is pressed.
 * @param handle - The handle that is being dragged.
 * @param panels - The panels to resize.
 * @param initialSizes - The initial sizes of the panels.
 * @param resizableData - Data related to the resizable instance.
 */
const deltaResize = (props: {
  deltaPercentage: number
  altKey: boolean
  handle: HTMLElement
  panels: PanelInstance[]
  initialSizes: number[]
  resizableData: {
    rootSize: number
    handleCursorStyle: boolean
    orientation: 'horizontal' | 'vertical'
    setSizes: Setter<number[]>
  }
}) => {
  if (props.altKey && props.panels.length > 2) {
    let panelIndex =
      props.panels.filter(
        (panel) =>
          !!(
            props.handle.compareDocumentPosition(panel.data.element) &
            Node.DOCUMENT_POSITION_PRECEDING
          ),
      ).length - 1
    const isPrecedingHandle = panelIndex === 0
    if (isPrecedingHandle) {
      panelIndex++
      props.deltaPercentage = -props.deltaPercentage
    }

    const panel = props.panels[panelIndex]!
    const panelSize = props.initialSizes[panelIndex]!
    const minDelta =
      resolveSize(panel.data.minSize, props.resizableData.rootSize) - panelSize
    const maxDelta =
      resolveSize(panel.data.maxSize, props.resizableData.rootSize) - panelSize
    const cappedDeltaPercentage =
      Math.max(minDelta, Math.min(props.deltaPercentage * 2, maxDelta)) / 2

    const [precedingPanels, followingPanels] = splitPanels({
      panels: props.panels,
      focusedElement: panel.data.element,
    })
    const precedingPanelsIncluding = [...precedingPanels, panel]
    const followingPanelsIncluding = [panel, ...followingPanels]
    const distributablePercentage = getDistributablePercentage({
      desiredPercentage: cappedDeltaPercentage,
      initialSizes: props.initialSizes,
      collapsible: false,
      resizeActions: [
        {
          precedingPanels: precedingPanelsIncluding,
          followingPanels: followingPanels,
        },
        {
          precedingPanels: precedingPanels,
          followingPanels: followingPanelsIncluding,
          negate: true,
        },
      ],
      resizableData: {
        rootSize: props.resizableData.rootSize,
      },
    })

    if (props.resizableData.handleCursorStyle === true) {
      handleResizeConstraints({
        orientation: props.resizableData.orientation,
        desiredPercentage: props.deltaPercentage,
        distributablePercentage,
        revertConstraints: isPrecedingHandle,
      })
    }

    resize({
      initialSizes: props.initialSizes,
      collapsible: false,
      resizeActions: [
        {
          precedingPanels: precedingPanelsIncluding,
          followingPanels,
          deltaPercentage: distributablePercentage,
        },
        {
          precedingPanels,
          followingPanels: followingPanelsIncluding,
          deltaPercentage: -distributablePercentage,
        },
      ],
      resizableData: props.resizableData,
    })
  } else {
    const [precedingPanels, followingPanels] = splitPanels({
      panels: props.panels,
      focusedElement: props.handle,
    })

    const distributablePercentage = getDistributablePercentage({
      desiredPercentage: props.deltaPercentage,
      initialSizes: props.initialSizes,
      collapsible: true,
      resizeActions: [
        {
          precedingPanels,
          followingPanels,
        },
      ],
      resizableData: {
        rootSize: props.resizableData.rootSize,
      },
    })

    resize({
      initialSizes: props.initialSizes,
      collapsible: true,
      resizeActions: [
        {
          precedingPanels,
          followingPanels,
          deltaPercentage: distributablePercentage,
        },
      ],
      resizableData: props.resizableData,
    })

    if (props.resizableData.handleCursorStyle) {
      const fixedDesiredPercentage = fixToPrecision(props.deltaPercentage)
      const fixedDistributablePercentage = fixToPrecision(
        distributablePercentage,
      )

      let betweenCollapse = false
      const precedingPanel = precedingPanels[precedingPanels.length - 1]!
      if (precedingPanel.data.collapsible) {
        const precedingCollapsedSize = resolveSize(
          precedingPanel.data.collapsedSize ?? 0,
          props.resizableData.rootSize,
        )
        if (
          (precedingPanel.size() === precedingCollapsedSize &&
            fixedDesiredPercentage > fixedDistributablePercentage) ||
          (precedingPanel.size() !== precedingCollapsedSize &&
            fixedDesiredPercentage < fixedDistributablePercentage)
        ) {
          betweenCollapse = true
        }
      }
      const followingPanel = followingPanels[0]!
      if (followingPanel.data.collapsible) {
        const followingCollapsedSize = resolveSize(
          followingPanel.data.collapsedSize ?? 0,
          props.resizableData.rootSize,
        )
        if (
          (followingPanel.size() === followingCollapsedSize &&
            fixedDesiredPercentage < fixedDistributablePercentage) ||
          (followingPanel.size() !== followingCollapsedSize &&
            fixedDesiredPercentage > fixedDistributablePercentage)
        ) {
          betweenCollapse = true
        }
      }

      handleResizeConstraints({
        orientation: props.resizableData.orientation,
        desiredPercentage: props.deltaPercentage,
        distributablePercentage,
        betweenCollapse,
      })
    }
  }
}

export { resizePanel, deltaResize }
