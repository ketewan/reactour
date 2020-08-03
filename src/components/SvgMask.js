import React from 'react'
import styled from 'styled-components'
import * as hx from '../helpers'
import PropTypes from 'prop-types'

const SvgMaskWrapper = styled.div`
  opacity: ${props => !props.maskClassName && 0.7};
  color: ${props => !props.maskClassName && '#000'};
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  position: fixed;
  z-index: 1250;
  pointer-events: none;
`

export default function SvgMask({
  windowWidth,
  windowHeight,
  targetWidth,
  targetHeight,
  targetTop,
  targetLeft,
  maskSpace,
  padding,
  rounded,
  roundedStep,
  disableInteraction,
  disableInteractionClassName,
  className,
  onClick,
  highlightedBorder,
  shouldShowStep,
  additionalHoles,
} = props) {
  const disabledScreen = (
    <svg
      width={windowWidth}
      height={windowHeight}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x={0}
        y={0}
        width={windowWidth}
        height={windowHeight}
        pointerEvents="auto"
        fill="transparent"
      />
    </svg>
  )

  const paddingTop = padding ? padding[0] : maskSpace
  const paddingRight = padding ? padding[1] : maskSpace
  const paddingBottom = padding ? padding[2] : maskSpace
  const paddingLeft = padding ? padding[3] : maskSpace

  const width = hx.safe(targetWidth + paddingLeft + paddingRight)
  const height = hx.safe(targetHeight + paddingTop + paddingBottom)
  const top = hx.safe(targetTop - paddingTop)
  const left = hx.safe(targetLeft - paddingLeft)

  const roundedRadius = roundedStep ? Math.min(width / 2, height / 2) : rounded

  const pathForHoles = [
    `M 0 0 h ${windowWidth} v ${windowHeight} h ${-windowWidth} z`,
    `M ${left} ${top} v ${height} h ${width} v ${-height} z`,
  ]
    .concat(
      additionalHoles &&
        additionalHoles.map(
          hole =>
            `M ${hole.x} ${hole.y} v ${hole.height} h ${
              hole.width
            } v ${-hole.height} z`
        )
    )
    .join('\n')

  return (
    <SvgMaskWrapper maskClassName={className} onClick={onClick}>
      {!shouldShowStep ? (
        disabledScreen
      ) : (
        <>
          <svg
            width={windowWidth}
            height={windowHeight}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            <defs>
              <mask id="mask-main">
                <rect
                  x={0}
                  y={0}
                  width={windowWidth}
                  height={windowHeight}
                  fill="white"
                />
                <rect
                  x={left}
                  y={top}
                  width={width}
                  height={height}
                  fill="black"
                />
                {additionalHoles &&
                  additionalHoles.map(selector => (
                    <rect
                      key={`additional-${selector.x}-${selector.y}`}
                      x={selector.x}
                      y={selector.y}
                      width={selector.width}
                      height={selector.height}
                      fill="black"
                    />
                  ))}
                {/* top left rounded corner */}
                <rect
                  x={left - 1}
                  y={top - 1}
                  width={roundedRadius}
                  height={roundedRadius}
                  fill="white"
                />
                <circle
                  cx={left + roundedRadius}
                  cy={top + roundedRadius}
                  r={roundedRadius}
                  fill="black"
                />
                {/* top right rounded corner */}
                <rect
                  x={left + width - roundedRadius + 1}
                  y={top - 1}
                  width={roundedRadius}
                  height={roundedRadius}
                  fill="white"
                />
                <circle
                  cx={left + width - roundedRadius}
                  cy={top + roundedRadius}
                  r={roundedRadius}
                  fill="black"
                />
                {/* bottom left rounded corner */}
                <rect
                  x={left - 1}
                  y={top + height - roundedRadius + 1}
                  width={roundedRadius}
                  height={roundedRadius}
                  fill="white"
                />
                <circle
                  cx={left + roundedRadius}
                  cy={top + height - roundedRadius}
                  r={roundedRadius}
                  fill="black"
                />
                {/* bottom right rounded corner */}
                <rect
                  x={left + width - roundedRadius + 1}
                  y={top + height - roundedRadius + 1}
                  width={roundedRadius}
                  height={roundedRadius}
                  fill="white"
                />
                <circle
                  cx={left + width - roundedRadius}
                  cy={top + height - roundedRadius}
                  r={roundedRadius}
                  fill="black "
                />
              </mask>
              <clipPath id="clip-path">
                <path d={`${pathForHoles}`} />
              </clipPath>
            </defs>
            <rect
              x={0}
              y={0}
              width={windowWidth}
              height={windowHeight}
              fill="currentColor"
              mask="url(#mask-main)"
            />
            <rect
              x={0}
              y={0}
              width={windowWidth}
              height={windowHeight}
              fill="currentColor"
              clipPath="url(#clip-path)"
              clipRule="evenodd"
              pointerEvents="auto"
            />
            <rect
              x={left}
              y={top}
              width={width}
              height={height}
              pointerEvents="auto"
              fill="transparent"
              display={disableInteraction ? 'block' : 'none'}
              className={disableInteractionClassName}
            />
            {/*borders border for main selector*/}
            <rect
              x={hx.safe(left + highlightedBorder.width / 2.0)}
              y={hx.safe(top + highlightedBorder.width / 2.0)}
              width={hx.safe(width - highlightedBorder.width)}
              height={hx.safe(height - highlightedBorder.width)}
              strokeWidth={highlightedBorder.width}
              stroke={highlightedBorder.color}
              fill="none"
              rx={roundedStep ? 20000 : highlightedBorder.radius}
            />
            {/*borders for additional holes*/}
            {additionalHoles &&
              additionalHoles.map(selector => (
                <rect
                  key={`additional-${selector.x}-${selector.y}`}
                  x={hx.safe(selector.x + highlightedBorder.width / 2.0)}
                  y={hx.safe(selector.y + highlightedBorder.width / 2.0)}
                  width={hx.safe(selector.width - highlightedBorder.width)}
                  height={hx.safe(selector.height - highlightedBorder.width)}
                  strokeWidth={highlightedBorder.width}
                  fill="none"
                  stroke={highlightedBorder.color}
                />
              ))}
          </svg>
        </>
      )}
    </SvgMaskWrapper>
  )
}

SvgMask.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  windowHeight: PropTypes.number.isRequired,
  targetWidth: PropTypes.number.isRequired,
  targetHeight: PropTypes.number.isRequired,
  targetTop: PropTypes.number.isRequired,
  targetLeft: PropTypes.number.isRequired,
  maskSpace: PropTypes.number.isRequired,
  padding: PropTypes.arrayOf(PropTypes.number),
  rounded: PropTypes.number.isRequired,
  roundedStep: PropTypes.bool,
  disableInteraction: PropTypes.bool.isRequired,
  disableInteractionClassName: PropTypes.string.isRequired,
  shouldShowStep: PropTypes.bool,
  additionalHoles: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    })
  ),
  highlightedBorder: PropTypes.shape({
    color: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }),
}
