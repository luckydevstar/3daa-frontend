import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import TestSidebar from './test-sidebar';
import TestQuestionBar from './test-question-bar';
import TestMultipleChoice from './test-multiple-choice';

const TestContent = ({
  question,
  answer,
  sidebarOpen,
  skippedQuestions,
  colors,
  onAnswer,
  onToggleSidebar,
  goToQuestion
}) => {
  const style = {
    backgroundColor: colors.background,
    color: colors.text
  };

  return (
    <div
      className={cx('test-content', {
        'sidebar-open': sidebarOpen
      })}
      style={style}
    >
      <div className="scrollable">
        <div className="test-container">
          {question.type === 0 &&
            <TestMultipleChoice
              {...{
                question,
                answer,
                onAnswer
              }}
            />}
        </div>
      </div>
      <TestSidebar
        {...{
          sidebarOpen,
          onToggleSidebar
        }}
      >
        {skippedQuestions.map((q, i) =>
          <TestQuestionBar key={i} {...q} goBack={goToQuestion} />
        )}
      </TestSidebar>
    </div>
  );
};

TestContent.propTypes = {
  question: PropTypes.object.isRequired,
  answer: PropTypes.any,
  sidebarOpen: PropTypes.bool,
  skippedQuestions: PropTypes.arrayOf(PropTypes.object),
  colors: PropTypes.shape({
    background: PropTypes.string,
    text: PropTypes.string
  }),
  onAnswer: PropTypes.func.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
  goToQuestion: PropTypes.func.isRequired
};

TestContent.defaultProps = {
  answer: null,
  sidebarOpen: false,
  skippedQuestions: [],
  colors: {
    background: 'white',
    text: 'black'
  }
};

export default TestContent;
