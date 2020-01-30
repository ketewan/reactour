import React from 'react'
import styled from 'styled-components'
import * as hx from '../helpers'
import PropTypes from 'prop-types'

const POINTER_WIDTH = 10,
  POINTER_HEIGHT = 20

const PointerWrapper = styled.div`
  left: 0;
  top: 0;
  color: #272181;
  height: ${POINTER_HEIGHT}px;
  width: ${POINTER_WIDTH * 2}px;
  position: fixed;
  z-index: 99999;
  transition: transform 0.3s;
  transform: ${props =>
    `translate(${props.x}px,${props.y}px)
    rotate(${props.rotationDegree}deg)`};
`

const Pointer = ({
  targetBottom,
  targetRight,
  targetTop,
  targetLeft,
  helperDimensions,
} = props) => {
  if (!helperDimensions.width || !helperDimensions.height) return null

  const targetDimensions = {
    top: targetTop,
    bottom: targetBottom,
    left: targetLeft,
    right: targetRight,
  }

  const centerX = (targetLeft + targetRight) / 2
  const centerY = (targetTop + targetBottom) / 2

  let x, y, rotationDegree

  if (
    hx.isLeftWard(targetDimensions, helperDimensions) &&
    hx.isBetween(centerY, targetTop, targetBottom)
  ) {
    x = helperDimensions.left - POINTER_WIDTH * 2
    y = centerY - POINTER_HEIGHT / 2
    rotationDegree = 0
  } else if (
    hx.isLeftWard(helperDimensions, targetDimensions) &&
    hx.isBetween(centerY, targetTop, targetBottom)
  ) {
    x = helperDimensions.right
    y = centerY - POINTER_HEIGHT / 2
    rotationDegree = 180
  } else if (
    hx.isAbove(helperDimensions, targetDimensions) &&
    hx.isBetween(centerX, targetLeft, targetRight)
  ) {
    x = centerX - POINTER_HEIGHT / 2
    y = helperDimensions.bottom
    rotationDegree = 270
  } else {
    x = centerX - POINTER_HEIGHT / 2
    y = helperDimensions.top - POINTER_WIDTH * 2
    rotationDegree = 90
  }

  x = hx.safe(x)
  y = hx.safe(y)

  return (
    <PointerWrapper
      x={Math.round(x)}
      y={Math.round(y)}
      rotationDegree={rotationDegree}
    >
      <svg
        width={POINTER_WIDTH * 2}
        height={POINTER_HEIGHT}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          fill="currentColor"
          points={`${POINTER_WIDTH * 2},0 
          ${POINTER_WIDTH},${POINTER_HEIGHT / 2} 
          ${POINTER_WIDTH * 2},${POINTER_HEIGHT}`}
        />
      </svg>
    </PointerWrapper>
  )
}

Pointer.propTypes = {
  targetTop: PropTypes.number.isRequired,
  targetLeft: PropTypes.number.isRequired,
  targetRight: PropTypes.number.isRequired,
  targetBottom: PropTypes.number.isRequired,
  helperDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
  }),
}

PointerWrapper.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  rotationDegree: PropTypes.number,
}

export default Pointer
