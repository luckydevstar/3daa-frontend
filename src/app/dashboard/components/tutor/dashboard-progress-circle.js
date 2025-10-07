import React from 'react';
import PropTypes from 'prop-types';

const DashboardProgressCircle = ({
  diameter,
  percentage,
  showProgress,
  strokeWidth
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
      width={diameter}
      height={diameter}
    >
      <circle className="fill-white" cx={radius} cy={radius} r={radius} />
      <circle
        className="bg-grey-ring"
        cx={radius}
        cy={radius}
        r={innerRadius}
        strokeWidth={strokeWidth * 0.6}
      />
      {showProgress && (
        <g>
          {percentage >= 100 ? (
            <circle
              className="progress-line"
              cx={radius}
              cy={radius}
              r={innerRadius}
              strokeWidth={strokeWidth}
            />
          ) : (
            <path
              className="progress-line"
              d={`M${radius} ${innerPadding}
                    A ${innerRadius} ${innerRadius}
                    0 ${largeArc} 1
                    ${x} ${y}`}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )}
          <circle
            className="fill-white"
            cx={radius}
            cy={innerPadding}
            r={strokeWidth * 0.3}
          />
          <polygon
            className="fill-white"
            points={`${strokeWidth / 4},0
                    -${strokeWidth / 4},${strokeWidth * 0.3}
                    -${strokeWidth / 4},-${strokeWidth * 0.3}`}
            transform={`translate(${x}, ${y}) rotate(${percentage * 3.6})`}
          />
        </g>
      )}
    </svg>
  );
};

DashboardProgressCircle.propTypes = {
  diameter: PropTypes.number,
  percentage: PropTypes.number,
  showProgress: PropTypes.bool,
  strokeWidth: PropTypes.number
};

DashboardProgressCircle.defaultProps = {
  diameter: 209,
  percentage: 0,
  showProgress: true,
  strokeWidth: 10
};

export default DashboardProgressCircle;
