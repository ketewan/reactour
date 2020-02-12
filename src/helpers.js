export function getNodeRect(node, relativeCoords) {
  const dx = relativeCoords ? relativeCoords.x : 0
  const dy = relativeCoords ? relativeCoords.y : 0

  const {
    top,
    right,
    bottom,
    left,
    width,
    height,
  } = node.getBoundingClientRect()
  return {
    top: top + dy,
    right: right + dx,
    bottom: bottom + dy,
    left: left + dx,
    width,
    height,
  }
}

export function inView({ top, right, bottom, left, w, h, threshold = 0 }) {
  return (
    top >= 0 + threshold &&
    left >= 0 + threshold &&
    bottom <= h - threshold &&
    right <= w - threshold
  )
}

export function isBody(node) {
  return (
    node === document.querySelector('body') ||
    node === document.querySelector('html')
  )
}

export const isHoriz = pos => /(left|right)/.test(pos)
export const isOutsideX = (val, windowWidth) => val > windowWidth
export const isOutsideY = (val, windowHeight) => val > windowHeight
export const safe = sum => (sum < 0 ? 0 : sum)

export function bestPositionOf(positions) {
  return Object.keys(positions)
    .map(p => ({
      position: p,
      value: positions[p],
    }))
    .sort((a, b) => b.value - a.value)
    .map(p => p.position)
}

export function getWindow() {
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  const h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  )
  return { w, h }
}

export function getDocument(documentRootSelector) {
  const root =
    documentRootSelector && window.document.querySelector(documentRootSelector)

  if (root) {
    const { top, left } = getNodeRect(root)
    return {
      document: root.contentDocument || root.contentWindow.document,
      relativeCoords: { x: left, y: top },
    }
  } else {
    return { document: window.document, relativeCoords: { x: 0, y: 0 } }
  }
}
