import React from 'react';
import PropTypes from 'prop-types';

const DashboardProgressLineLeft = ({
  height,
  left,
  percentage,
  radius,
  strokeWidth,
  top,
  width
}) => {
  let progressD;
  let x;
  let y;

  const stroke2 = strokeWidth / 2;
  const arc = (Math.PI * radius) / 2;
  const length = arc + width - radius - stroke2;
  const cp = radius + stroke2;

  const showProgress = percentage >= 0;

  if (showProgress) {
    const progress = percentage >= 50 ? length : (length * percentage) / 50;

    if (progress > arc) {
      x = cp + progress - arc;
      y = stroke2;

      progressD = `M${stroke2} ${height}
                  A${radius} ${radius} 0 0 1 ${cp} ${stroke2}
                  L${x} ${y}`;
    } else {
      const angle = progress / radius;
      x = cp - radius * Math.cos(angle);
      y = cp - radius * Math.sin(angle);

      progressD = `M${stroke2} ${height}
                    A${radius} ${radius} 0 0 1 ${x} ${y}`;
    }
  }

  return (
    <div
      className="dashboard-progress-bar"
      style={{
        left,
        top
      }}
    >
      <svg width={width} height={height}>
        <path
          className="bg-path"
          d={`M${stroke2} ${height}
              A${radius} ${radius} 0 0 1 ${radius + stroke2} ${stroke2}
              L${width} ${stroke2}`}
          strokeWidth={strokeWidth}
        />
        {showProgress && (
          <path
            className="progress-path"
            d={progressD}
            strokeWidth={strokeWidth * 0.4}
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};

DashboardProgressLineLeft.propTypes = {
  height: PropTypes.number,
  left: PropTypes.number,
  percentage: PropTypes.number,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number
};

DashboardProgressLineLeft.defaultProps = {
  flip: false,
  height: 200,
  left: 0,
  percentage: 0,
  radius: 50,
  strokeWidth: 10,
  top: 0,
  width: 500
};

export default DashboardProgressLineLeft;
