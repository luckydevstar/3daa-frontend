import React from 'react';
import PropTypes from 'prop-types';

const UIProgressBar = ({ progress }) =>
  <div className="ui-progress-bar">
    <div style={{ width: `${progress}%` }} />
  </div>;

UIProgressBar.propTypes = {
  progress: PropTypes.number
};

UIProgressBar.defaultProps = {
  progress: 50
};

export default UIProgressBar;
