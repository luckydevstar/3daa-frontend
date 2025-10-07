import React from 'react';
import PropTypes from 'prop-types';

import common from 'app/common';

const noop = common.util.helpers.noop;

const ValidateTestNotice = ({ onNext }) =>
  <div className="validate-test-notice has-text-centered">
    <h1>Important</h1>
    <h2>Before validating your candidate - Please read:</h2>
    <ul className="has-text-left">
      <li>
        The test must be started within 30 minutes of validating your candidate.
      </li>
      <li>
        If you try and start the test after 30 minutes you will then need to
        revalidate{' '}
      </li>
      <li>
        An email will be sent to the candidate to confirm and authorise their
        test
      </li>
      <li>Your location settings must be switched on</li>
      <li>The test must be completed within 60 minutes</li>
    </ul>
    <div className="m-t-40 m-b-20">
      <button className="button is-primary w-180" onClick={onNext}>
        Next
      </button>
    </div>
  </div>;

ValidateTestNotice.propTypes = {
  onNext: PropTypes.func
};

ValidateTestNotice.defaultProps = {
  onNext: noop
};

export default ValidateTestNotice;
