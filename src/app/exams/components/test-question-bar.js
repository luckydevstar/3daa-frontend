import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import IconSkip from 'images/icon_skip.svg';

const TestQuestionBar = ({ title, qid, goBack }) => (
  <div className="test-question-bar">
    <div className="left">
      <h3>
        Question {qid + 1} | {title}
      </h3>
      <div>
        <span>
          Skipped&nbsp;&nbsp;
          <Isvg src={IconSkip} />
        </span>
      </div>
    </div>
    <div>
      <a className="is-primary back" onClick={() => goBack(qid)}>
        Go Back&nbsp;&nbsp;
        <i className="fa fa-angle-right" />
      </a>
    </div>
  </div>
);

TestQuestionBar.propTypes = {
  title: PropTypes.string,
  qid: PropTypes.number,
  goBack: PropTypes.func.isRequired
};

TestQuestionBar.defaultProps = {
  title: '',
  qid: -1
};

export default TestQuestionBar;
