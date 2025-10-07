import React from 'react';
import PropTypes from 'prop-types';

const DashboardProgressLineRight = ({
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
  const cx = width - radius - stroke2;
  const cy = radius + stroke2;

  const showProgress = percentage >= 50;

  if (showProgress) {
    const progress =
      percentage >= 100 ? length : (length * (percentage - 50)) / 50;
    if (progress > length - arc) {
      const angle = (length - progress) / radius;
      x = cx + radius * Math.cos(angle);
      y = cy - radius * Math.sin(angle);

      progressD = `M0 ${stroke2}
                  L${cx} ${stroke2}
                  A${radius} ${radius} 0 0 1 ${x} ${y}`;
    } else {
      x = progress;
      y = stroke2;

      progressD = `M0 ${stroke2}L${x} ${y}`;
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
          d={`M0 ${stroke2}
              L${cx} ${stroke2}
              A${radius} ${radius} 0 0 1 ${width - stroke2} ${height}`}
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

DashboardProgressLineRight.propTypes = {
  height: PropTypes.number,
  left: PropTypes.number,
  percentage: PropTypes.number,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number
};

DashboardProgressLineRight.defaultProps = {
  flip: false,
  height: 200,
  left: 0,
  percentage: 10,
  radius: 50,
  strokeWidth: 10,
  top: 0,
  width: 500
};

export default DashboardProgressLineRight;
