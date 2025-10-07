import React from 'react';
import PropTypes from 'prop-types';

const UIProgressCircle = ({
  blurSize,
  diameter,
  percentage,
  showProgress,
  strokeWidth,
  innerPaddingScale
}) => {
  const radius = diameter / 2;
  const innerPadding = strokeWidth * 1.5;
  const innerRadius = radius - innerPadding;
  const angle = Math.PI * (percentage / 50 - 0.5);
  const x = radius + Math.cos(angle) * innerRadius;
  const y = radius + Math.sin(angle) * innerRadius;
  const largeArc = percentage > 50 ? 1 : 0;

  return (
    <svg
      className="dashboard-progress-circle"
      width={diameter + blurSize * 2}
      height={diameter + blurSize * 2}
    >
      <filter
        id="feOffset"
        x={-blurSize}
        y={-blurSize}
        width={diameter + blurSize * 2}
        height={diameter + blurSize * 2}
      >
        <feOffset in="SourceGraphic" />
        <feColorMatrix
          result="matrixOut"
          in="offOut"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .3 0"
        />
        <feGaussianBlur
          in="floodBlack"
          stdDeviation={blurSize / 2}
          result="blur2"
        />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <circle
        className="fill-white"
        cx={radius + blurSize}
        cy={radius + blurSize}
        r={radius}
        style={{ filter: 'url(#feOffset)' }}
      />
      <circle
        className="bg-grey-ring"
        cx={radius + blurSize}
        cy={radius + blurSize}
        r={innerRadius}
        strokeWidth={strokeWidth * 0.6}
      />
      {showProgress && (
        <g>
          {percentage >= 100 ? (
            <circle
              className="progress-line"
              cx={radius + blurSize}
              cy={radius + blurSize}
              r={innerRadius}
              strokeWidth={strokeWidth}
            />
          ) : (
            <path
              className="progress-line"
              d={`M${radius + blurSize} ${innerPadding + blurSize}
                  A ${innerRadius} ${innerRadius}
                  0 ${largeArc} 1
                  ${x + blurSize} ${y + blurSize}`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
          <circle
            className="fill-white"
            cx={radius + blurSize}
            cy={innerPadding + blurSize}
            r={strokeWidth * 0.3}
          />
          <polygon
            className="fill-white"
            points={`${strokeWidth / 4},0
                    -${strokeWidth / 4},${strokeWidth * 0.3}
                    -${strokeWidth / 4},-${strokeWidth * 0.3}`}
            transform={`translate(${x + blurSize}, ${y + blurSize})
                        rotate(${percentage * 3.6})`}
          />
        </g>
      )}
    </svg>
  );
};

UIProgressCircle.propTypes = {
  blurSize: PropTypes.number,
  diameter: PropTypes.number,
  percentage: PropTypes.number,
  showProgress: PropTypes.bool,
  strokeWidth: PropTypes.number,
  innerPaddingScale: PropTypes.number
};

UIProgressCircle.defaultProps = {
  blurSize: 0,
  diameter: 209,
  percentage: 0,
  showProgress: true,
  strokeWidth: 10,
  innerPaddingScale: 1
};

export default UIProgressCircle;
