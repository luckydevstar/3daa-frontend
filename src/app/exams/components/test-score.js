import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { UIProgressCircle } = common.components;

const TestScore = ({ result }) =>
  <div className="test-score">
    <div className="inner">
      <span>Result</span>
      <h1>Your Score</h1>
      <UIProgressCircle percentage={result} blurSize={20} />
      <div className="score">
        <span className="value">
          {Math.floor(result)}
        </span>
        <span className="percent">%</span>
        <span className="label">Correct</span>
      </div>
    </div>
  </div>;

TestScore.propTypes = {
  result: PropTypes.number
};

TestScore.defaultProps = {
  result: 0
};

export default TestScore;
