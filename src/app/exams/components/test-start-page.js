import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const noop = common.util.helpers.noop;

const TestStartPage = ({ onStart }) =>
  <div className="test-start-page">
    <div className="bg-overlay" />
    <h1>
      Lets Begin Your<br />Scottish Certificate for Personal<br />Licence
      Holders
    </h1>
    <button className="button is-primary is-outlined" onClick={() => onStart()}>
      Start Now
    </button>
    <a className="back-link">I need a quick refresh - take me back</a>
  </div>;

TestStartPage.propTypes = {
  onStart: PropTypes.func
};

TestStartPage.defaultProps = {
  onStart: noop
};

export default TestStartPage;
