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

export function getHighlightedRect(node, step, rootDocument, relativeCoords) {
  if (!step.highlightedSelectors) {
    return getNodeRect(node, relativeCoords)
  }

  let attrs = getNodeRect(node, relativeCoords)

  for (const selector of step.highlightedSelectors) {
    const element = rootDocument.querySelector(selector)

    if (
      !element ||
      element.style.display === 'none' ||
      element.style.visibility === 'hidden'
    ) {
      continue
    }

    const rect = getNodeRect(element, relativeCoords)

    if (rect.top < attrs.top) {
      attrs.top = rect.top
    }

    if (rect.right > attrs.right) {
      attrs.right = rect.right
    }

    if (rect.bottom > attrs.bottom) {
      attrs.bottom = rect.bottom
    }

    if (rect.left < attrs.left) {
      attrs.left = rect.left
    }
  }

  attrs.width = attrs.right - attrs.left
  attrs.height = attrs.bottom - attrs.top

  return attrs
}

export function inView({ top, right, bottom, left, w, h, threshold = 0 }) {
  return (
    top >= 0 + threshold &&
    left >= 0 + threshold &&
    bottom <= h - threshold &&
    right <= w - threshold
  )
}

export function isBody(node, rootDocument = window.document) {
  return (
    node === rootDocument.querySelector('body') ||
    node === rootDocument.querySelector('html')
  )
}

export const isHoriz = pos => /(left|right)/.test(pos)
export const isOutsideX = (val, windowWidth) => val > windowWidth
export const isOutsideY = (val, windowHeight) => val > windowHeight
export const safe = sum => (sum < 0 ? 0 : sum)

export const isAbove = (one, another) => one.bottom < another.top // b - a > eps
export const isLeftWard = (one, another) => one.right < another.left

export const isBetween = (between, a, b) => {
  if (a > b) {
    const tmp = a
    a = b
    b = tmp
  }
  return between >= a && between <= b
}

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

  let document
  const relativeCoords = { x: 0, y: 0 }

  if (root) {
    document = root.contentDocument || root.contentWindow.document
    const { top, left } = getNodeRect(root)
    relativeCoords.x = left
    relativeCoords.y = top
  } else {
    document = window.document
  }

  return { document, relativeCoords }
}
