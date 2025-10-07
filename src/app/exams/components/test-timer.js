import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import common from 'app/common';
import ClockIcon from 'images/icon_clock.svg';

const { formatN2 } = common.util.helpers;

const formatTime = n =>
  `${formatN2(Math.floor(n / 60))}:${formatN2(Math.floor(n % 60))}`;

const TestTimer = ({ seconds }) => (
  <div className="test-timer">
    <Isvg src={ClockIcon} />
    <div>
      <div className="time">{formatTime(seconds)}</div>
      <div className="label">Time Remaining</div>
    </div>
  </div>
);

TestTimer.propTypes = {
  seconds: PropTypes.number
};

TestTimer.defaultProps = {
  seconds: 0
};

export default TestTimer;
