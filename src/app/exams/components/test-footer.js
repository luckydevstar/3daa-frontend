import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import TestTimer from './test-timer';

const TestFooter = ({
  total,
  currentQuestion,
  answered,
  remainingTime,
  status,
  onFinish,
  onNext,
  onPrev,
  onToggleSidebar,
  onShowCertificate
}) =>
  <div className="test-footer">
    <div>
      <div
        className={cx('block btn', {
          disabled: currentQuestion === 0 || status > 1
        })}
        onClick={() => onPrev()}
      >
        <i className="fa fa-angle-left" />&nbsp;&nbsp;Previous
      </div>
      <div
        className={cx('block', {
          disabled: status > 1
        })}
      >
        {currentQuestion + 1}/{total}
      </div>
      <div
        className={cx('block btn', {
          disabled: currentQuestion >= total - 1 || status > 1
        })}
        onClick={() => onNext()}
      >
        {answered ? 'Next' : 'Skip'}&nbsp;&nbsp;<i className="fa fa-angle-right" />
      </div>
      {status === 1 &&
        <div className="block btn" onClick={() => onFinish()}>
          Finish
        </div>}
      {status === 2 &&
        <div className="block btn" onClick={() => onShowCertificate()}>
          Show Certificate
        </div>}
    </div>
    <div>
      <div className="block timer">
        <TestTimer seconds={remainingTime} />
      </div>
      <div className="block btn" onClick={() => onToggleSidebar()}>
        <i className="fa fa-bars" />
      </div>
    </div>
  </div>;

TestFooter.propTypes = {
  total: PropTypes.number,
  currentQuestion: PropTypes.number,
  answered: PropTypes.bool,
  remainingTime: PropTypes.number,
  status: PropTypes.number,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
  onShowCertificate: PropTypes.func.isRequired
};

TestFooter.defaultProps = {
  total: 0,
  currentQuestion: 0,
  answered: false,
  remainingTime: 120,
  status: 0
};

export default TestFooter;
