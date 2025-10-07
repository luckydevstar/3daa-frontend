import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TestSectorResult from './test-sector-result';

const questions = [
  {
    id: 3,
    text: '25ml or 35ml or multiples thereof.',
    answer: '1'
  },
  {
    id: 4,
    text: 'Smoking cannot take place inside any public building.',
    answer: '1'
  }
];

class TestResults extends Component {
  constructor(props) {
    super(props);

    this.checkClick = this.checkClick.bind(this);
  }

  checkClick(e) {
    if (e.target === this.contentsElement) {
      this.props.hideResults();
    }
  }

  render() {
    return (
      <div className="test-results">
        <div
          className="contents"
          ref={el => {
            this.contentsElement = el;
          }}
          onClick={this.checkClick}
        >
          <TestSectorResult
            total={40}
            correct={36}
            incorrect={2}
            questions={questions}
          />
          <TestSectorResult
            total={40}
            correct={36}
            incorrect={2}
            questions={questions}
          />
          <TestSectorResult
            total={40}
            correct={36}
            incorrect={2}
            questions={questions}
          />
          <TestSectorResult
            total={40}
            correct={36}
            incorrect={2}
            questions={questions}
          />
          <TestSectorResult
            total={40}
            correct={36}
            incorrect={2}
            questions={questions}
          />
          <TestSectorResult />
          <TestSectorResult />
          <TestSectorResult />
        </div>
      </div>
    );
  }
}

TestResults.propTypes = {
  hideResults: PropTypes.func.isRequired
};

export default TestResults;
