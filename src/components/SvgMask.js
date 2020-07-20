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
  z-index: 99999;
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
} = props) {
  const paddingTop = padding ? padding[0] : maskSpace
  const paddingRight = padding ? padding[1] : maskSpace
  const paddingBottom = padding ? padding[2] : maskSpace
  const paddingLeft = padding ? padding[3] : maskSpace

  const width = hx.safe(targetWidth + paddingLeft + paddingRight)
  const height = hx.safe(targetHeight + paddingTop + paddingBottom)
  const top = hx.safe(targetTop - paddingTop)
  const left = hx.safe(targetLeft - paddingLeft)

  const roundedRadius = roundedStep ? Math.min(width / 2, height / 2) : rounded

  return (
    <SvgMaskWrapper maskClassName={className} onClick={onClick}>
      {shouldShowStep ? (
        <svg
          width={windowWidth}
          height={windowHeight}
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <mask id="highlighted">
              <rect
                x={left}
                y={top}
                width={width}
                height={height}
                fill="white"
              />
              <rect
                x={targetLeft}
                y={targetTop}
                width={targetWidth}
                height={targetHeight}
                fill="black"
              />
            </mask>
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
              {/* top */}
              <rect x={0} y={0} width={windowWidth} height={top} />
              {/* left */}
              <rect x={0} y={top} width={left} height={height} />
              {/* right */}
              <rect
                x={targetLeft + targetWidth + paddingRight}
                y={top}
                width={hx.safe(windowWidth - targetWidth - left)}
                height={height}
              />
              {/* bottom */}
              <rect
                x={0}
                y={targetTop + targetHeight + paddingBottom}
                width={windowWidth}
                height={hx.safe(windowHeight - targetHeight - top)}
              />
            </clipPath>
            <clipPath id="clip-path-without-padding">
              {/* top */}
              <rect x={0} y={0} width={windowWidth} height={targetTop} />
              {/* left */}
              <rect x={0} y={top} width={targetLeft} height={height} />
              {/* right */}
              <rect
                x={targetLeft + targetWidth}
                y={targetTop}
                width={hx.safe(windowWidth - targetWidth - targetLeft)}
                height={height}
              />
              {/* bottom */}
              <rect
                x={0}
                y={targetTop + targetHeight}
                width={windowWidth}
                height={hx.safe(windowHeight - targetHeight - targetTop)}
              />
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
          {/*border*/}
          <rect
            x={hx.safe(left + highlightedBorder.width / 2.0)}
            y={hx.safe(top + highlightedBorder.width / 2.0)}
            width={hx.safe(width - highlightedBorder.width)}
            height={hx.safe(height - highlightedBorder.width)}
            pointerEvents="auto"
            fill="none"
            strokeWidth={highlightedBorder.width}
            stroke={highlightedBorder.color}
            rx={roundedStep ? 20000 : highlightedBorder.radius}
          />
          {/*transparent padding with disabled interaction*/}
          <rect
            x={0}
            y={0}
            width={windowWidth}
            height={windowHeight}
            fill="transparent"
            pointerEvents="auto"
            clipPath="url(#clip-path-without-padding)"
          />
        </svg>
      ) : (
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
  highlightedBorder: PropTypes.shape({
    color: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  }),
}
