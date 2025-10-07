import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { UICheckbox } = common.components;
const { noop } = common.util.helpers;

const TestMultipleChoice = ({ answer, question, onAnswer }) =>
  <div className="multiple-choice">
    <h1>
      {question.title}
    </h1>
    <p>
      {question.text}
    </p>
    <h2>Select your answer below</h2>
    {question.answerChoices.map((q, i) =>
      <div key={`key-${i}`} className="choice" onClick={() => onAnswer(i)}>
        <div>
          {i + 1}.
        </div>
        <div className="choice-text">
          {q}
        </div>
        <UICheckbox checked={i === answer} />
      </div>
    )}
  </div>;

TestMultipleChoice.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string,
    title: PropTypes.string,
    answerChoices: PropTypes.arrayOf(PropTypes.string)
  }),
  answer: PropTypes.number,
  onAnswer: PropTypes.func
};

TestMultipleChoice.defaultProps = {
  question: {
    text: '',
    answerChoices: []
  },
  answer: -1,
  onAnswer: noop
};

export default TestMultipleChoice;
