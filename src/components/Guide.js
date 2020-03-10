import styled from 'styled-components'
import * as hx from '../helpers'
import Pointer from './Pointer'
import React from 'react'

const GuideBody = styled.div`
  --reactour-accent: ${props => props.accentColor};
  ${props =>
    props.defaultStyles
      ? `
  max-width: 331px;
  min-width: 150px;
  padding-right: 40px;
  border-radius: ${props.rounded}px;
  background-color: #fff;
  padding: 24px 30px;
  box-shadow: 0 0.5em 3em rgba(0, 0, 0, 0.3);
  color: inherit;
  `
      : ''}
  position: fixed;
  transition: transform 0.3s;
  top: 0;
  left: 0;
  z-index: 1000000;
  transform: ${props => `translate(${props.left}px, ${props.top}px)`};
`

const Guide = React.forwardRef((props, ref) => {
  const {
    targetTop,
    targetRight,
    targetBottom,
    targetLeft,
    windowWidth,
    windowHeight,
    helperWidth,
    helperHeight,
    helperPosition,
    maskSpace,
    padding,
    helperPadding,
    shouldShowStep,
    shouldShowSvgMask,
  } = props

  const paddingTop = padding ? padding[0] : maskSpace
  const paddingRight = padding ? padding[1] : maskSpace
  const paddingBottom = padding ? padding[2] : maskSpace
  const paddingLeft = padding ? padding[3] : maskSpace

  const available = {
    left: targetLeft,
    right: windowWidth - targetRight,
    top: targetTop,
    bottom: windowHeight - targetBottom,
  }

  const couldPositionAt = position => {
    return (
      available[position] >
      (hx.isHoriz(position)
        ? helperWidth + helperPadding * 2
        : helperHeight + helperPadding * 2)
    )
  }

  const autoPosition = coords => {
    const positionsOrder = hx.bestPositionOf(available)
    for (let j = 0; j < positionsOrder.length; j++) {
      if (couldPositionAt(positionsOrder[j])) {
        return coords[positionsOrder[j]]
      }
    }
    return coords.center
  }

  const pos = helperPosition => {
    // in case position was stated in step
    if (Array.isArray(helperPosition)) {
      const isOutX = hx.isOutsideX(helperPosition[0], windowWidth)
      const isOutY = hx.isOutsideY(helperPosition[1], windowHeight)
      const warn = (axis, num) => {
        console.warn(`${axis}:${num} is outside window, falling back to center`)
      }
      if (isOutX) warn('x', helperPosition[0])
      if (isOutY) warn('y', helperPosition[1])
      return [
        isOutX ? windowWidth / 2 - helperWidth / 2 : helperPosition[0],
        isOutY ? windowHeight / 2 - helperHeight / 2 : helperPosition[1],
      ]
    }

    const centerX = targetLeft / 2 + targetRight / 2
    const leftCenterX = centerX - helperWidth / 2
    const rightCenterX = centerX + helperWidth / 2
    const centerY = targetTop / 2 + targetBottom / 2
    const topCenterY = centerY - helperHeight / 2
    const bottomCenterY = centerY + helperHeight / 2

    const hX =
      leftCenterX < 0 ||
      hx.isOutsideX(rightCenterX, windowWidth - helperPadding)
        ? hx.isOutsideX(targetLeft - paddingLeft + helperWidth, windowWidth)
          ? hx.isOutsideX(targetRight + paddingRight, windowWidth)
            ? targetRight - helperWidth
            : targetRight + paddingRight - helperWidth
          : targetLeft - paddingLeft
        : leftCenterX

    const x = hX > paddingLeft ? hX : paddingLeft

    const hY =
      topCenterY < 0 ||
      hx.isOutsideY(bottomCenterY, windowHeight - helperPadding)
        ? hx.isOutsideY(targetTop - paddingTop + helperHeight, windowHeight)
          ? hx.isOutsideY(targetBottom + paddingBottom, windowHeight)
            ? targetBottom - helperHeight
            : targetBottom + paddingBottom - helperHeight
          : targetTop - paddingTop
        : topCenterY

    const y = hY > paddingTop ? hY : paddingTop

    const coords = {
      top: [x, hx.safe(targetTop - helperHeight - paddingTop - helperPadding)],
      right: [targetRight + paddingRight + helperPadding, y],
      bottom: [x, targetBottom + paddingBottom + helperPadding],
      left: [
        hx.safe(targetLeft - helperWidth - paddingLeft - helperPadding),
        y,
      ],
      center: [
        windowWidth / 2 - helperWidth / 2,
        windowHeight / 2 - helperHeight / 2,
      ],
    }
    if (helperPosition === 'center' || couldPositionAt(helperPosition)) {
      return coords[helperPosition]
    }
    return autoPosition(coords)
  }

  const p = pos(helperPosition)

  const left = Math.round(p[0])
  const top = Math.round(p[1])

  const helperDimensions = {
    left,
    top,
    bottom: top + helperHeight,
    right: left + helperWidth,
    width: helperWidth,
    height: helperHeight,
  }

  return (
    shouldShowStep && (
      <>
        <GuideBody {...props} left={left} top={top} ref={ref} />
        {!helperPosition && shouldShowSvgMask && (
          <Pointer
            helperDimensions={helperDimensions}
            targetTop={targetTop}
            targetBottom={targetBottom}
            targetRight={targetRight}
            targetLeft={targetLeft}
          />
        )}
      </>
    )
  )
})

export default Guide
