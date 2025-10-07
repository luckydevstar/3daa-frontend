import React from 'react';
import { Link } from 'react-router';

import TesterInfo from './tester-info';

const TestStartModal = () =>
  <div className="test-start-modal p-40">
    <TesterInfo />
    <div className="m-t-40 has-text-centered">
      <Link className="button is-primary" to={'/test/start'}>
        Start Test
      </Link>
    </div>
  </div>;

export default TestStartModal;
