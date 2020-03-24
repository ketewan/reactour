import React from 'react'
import * as hx from '../helpers'

export const pointer = ({
  targetBottom,
  targetRight,
  targetTop,
  targetLeft,
  helperDimensions,
  arrowSize = 10,
}) => {
  if (!helperDimensions.width || !helperDimensions.height) return null

  const targetDimensions = {
    top: targetTop,
    bottom: targetBottom,
    left: targetLeft,
    right: targetRight,
  }

  const centerX = (targetLeft + targetRight) / 2
  const centerY = (targetTop + targetBottom) / 2

  let arrowPos
  let x, y

  if (
    hx.isLeftWard(targetDimensions, helperDimensions) &&
    hx.isBetween(centerY, targetTop, targetBottom)
  ) {
    x = arrowSize * -2
    y = centerY - arrowSize - helperDimensions.top
    arrowPos = 'right'
  } else if (
    hx.isLeftWard(helperDimensions, targetDimensions) &&
    hx.isBetween(centerY, targetTop, targetBottom)
  ) {
    x = helperDimensions.width
    y = centerY - arrowSize - helperDimensions.top
    arrowPos = 'left'
  } else if (
    hx.isAbove(helperDimensions, targetDimensions) &&
    hx.isBetween(centerX, targetLeft, targetRight)
  ) {
    x = centerX - arrowSize - helperDimensions.left
    y = helperDimensions.height
    arrowPos = 'top'
  } else {
    x = centerX - arrowSize - helperDimensions.left
    y = arrowSize * -2
    arrowPos = 'bottom'
  }

  return `
        &::before 
        {
          content: "";
          position: absolute;
          top: ${Math.round(y)}px;
          left: ${Math.round(x)}px;
          border-style: solid;
          border-width: 10px;
          border-color: ${arrowPos === 'top' ? '#272181' : 'transparent'}
            ${arrowPos === 'right' ? '#272181' : 'transparent'}
            ${arrowPos === 'bottom' ? '#272181' : 'transparent'}
            ${arrowPos === 'left' ? '#272181' : 'transparent'};
          display: block;
          width: 0;
        };
      `
}
