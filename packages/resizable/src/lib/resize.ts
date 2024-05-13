/* eslint-disable solid/reactivity */
import { fixToPrecision, resolveSize, splitPanels } from '@src/lib/utils'
import type { PanelInstance, ResizeStrategy } from '@src/lib/types'
import { type Setter } from 'solid-js'

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
      side: 'preceding',
      panels: resizeAction.precedingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: 0,
      desiredPercentage,
      collapsible: props.collapsible,
      rootSize: props.resizableData.rootSize,
    })
    // eslint-disable-next-line prefer-const
    let [
      distributedPercentageFollowing,
      // eslint-disable-next-line prefer-const
      distributedSizesFollowing,
      // eslint-disable-next-line prefer-const
      collapsedFollowing,
    ] = distributePercentage({
      side: 'following',
      panels: resizeAction.followingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: resizeAction.precedingPanels.length,
      desiredPercentage,
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

const distributePercentage = (props: {
  side: 'preceding' | 'following'
  panels: PanelInstance[]
  initialSizes: number[]
  initialSizesStartIndex: number
  desiredPercentage: number
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
    if (panelSize === collapsedSize) continue

    const availablePercentage = props.desiredPercentage - distributedPercentage
    if (availablePercentage === 0) break

    switch (resizeDirection) {
      case 'precedingDecreasing': {
        const minSize = resolveSize(panel.data.minSize ?? 0, props.rootSize)
        distributedSizes[i] = Math.max(minSize, panelSize + availablePercentage)
        distributedPercentage += distributedSizes[i]! - panelSize
        break
      }
      case 'followingDecreasing': {
        const minSize = resolveSize(panel.data.minSize ?? 0, props.rootSize)
        distributedSizes[i] = Math.max(minSize, panelSize - availablePercentage)
        distributedPercentage -= distributedSizes[i]! - panelSize
        break
      }
      case 'precedingIncreasing': {
        const maxSize = resolveSize(panel.data.maxSize ?? 1, props.rootSize)
        distributedSizes[i] = Math.min(maxSize, panelSize + availablePercentage)
        distributedPercentage += distributedSizes[i]! - panelSize
        break
      }
      case 'followingIncreasing': {
        const maxSize = resolveSize(panel.data.maxSize ?? 1, props.rootSize)
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
    const minSize = resolveSize(panel.data.minSize ?? 0, props.rootSize)
    distributedSizes[panelIndex] = minSize
    if (Math.abs(availablePercentage) > minSize - collapsedSize) {
      const maxSize = resolveSize(panel.data.maxSize ?? 1, props.rootSize)
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
    const minSize = resolveSize(panel.data.minSize ?? 0, props.rootSize)
    distributedSizes[panelIndex] = minSize

    if (Math.abs(availablePercentage) > minSize - collapsedSize) {
      const maxSize = resolveSize(panel.data.maxSize ?? 1, props.rootSize)
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
      side: 'preceding',
      panels: resizeAction.precedingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: 0,
      desiredPercentage: resizeAction.deltaPercentage,
      collapsible: props.collapsible,
      rootSize: props.resizableData.rootSize,
    })
    const [, distributedSizesFollowing] = distributePercentage({
      side: 'following',
      panels: resizeAction.followingPanels,
      initialSizes: newSizes,
      initialSizesStartIndex: resizeAction.precedingPanels.length,
      desiredPercentage: resizeAction.deltaPercentage,
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

const resizePanel = (props: {
  initialSizes: number[]
  deltaPercentage: number
  collapsible: boolean
  strategy: ResizeStrategy
  panels: PanelInstance[]
  panel: PanelInstance
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

export { getDistributablePercentage, resize, resizePanel }
