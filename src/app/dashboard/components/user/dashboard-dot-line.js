import React from 'react';
import PropTypes from 'prop-types';

const DashboardDotLine = ({
  height,
  left,
  radius,
  strokeWidth,
  top,
  width
}) => {
  const stroke2 = strokeWidth / 2;
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
          strokeWidth={strokeWidth * 0.6}
          strokeDasharray={`0, ${stroke2 * 3}`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

DashboardDotLine.propTypes = {
  height: PropTypes.number,
  left: PropTypes.number,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number
};

DashboardDotLine.defaultProps = {
  flip: false,
  height: 200,
  left: 0,
  radius: 50,
  strokeWidth: 10,
  top: 0,
  width: 500
};

export default DashboardDotLine;
