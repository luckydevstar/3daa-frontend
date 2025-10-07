import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import IconCheck from 'images/icon_check.svg';
import IconWrong from 'images/icon_wrong.svg';
import IconSkip from 'images/icon_skip.svg';

class TestSectorResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      visible: false
    };

    this.nextQuestion = this.nextQuestion.bind(this);
    this.prevQuestion = this.prevQuestion.bind(this);
  }

  nextQuestion() {
    const { questions } = this.props;
    const { current } = this.state;

    if (current < questions.length - 1) {
      this.setState({
        current: current + 1
      });
    }
  }

  prevQuestion() {
    const { current } = this.state;

    if (current > 0) {
      this.setState({
        current: current - 1
      });
    }
  }

  render() {
    const { total, correct, incorrect, title, sector, questions } = this.props;

    const { current, visible } = this.state;

    return (
      <div className="test-sector-result">
        <div
          className="summary"
          onClick={() => this.setState({ visible: !visible })}
        >
          <div className="info">
            <h3>
              Sector {sector} | {title}
            </h3>
            <div>
              <span className="m-r-10">Questions</span>
              <span className="total m-r-10">
                {total}
              </span>
              <span className="m-r-30">Answered</span>
              <img className="m-r-10" alt="" src={IconCheck} />
              <span className="m-r-30">
                {correct}
              </span>
              <img className="m-r-10" alt="" src={IconWrong} />
              <span className="m-r-30">
                {incorrect}
              </span>
              <img className="m-r-10" alt="" src={IconSkip} />
              <span>
                {total - correct - incorrect}
              </span>
            </div>
          </div>
          <div className="ibtn">
            {visible
              ? <i className="fa fa-angle-up" />
              : <i className="fa fa-angle-down" />}
          </div>
        </div>
        {questions.length > 0 &&
          visible &&
          <div className="questions">
            <div className="question">
              <div>
                <div className="ibtn" onClick={this.prevQuestion}>
                  <i className="fa fa-angle-left" />
                </div>
              </div>
              <div className="text">
                <p className="m-r-10">
                  {questions[current].id}.
                </p>
                <p>
                  {questions[current].text}
                </p>
              </div>
              <div>
                <div className="ibtn" onClick={this.nextQuestion}>
                  <i className="fa fa-angle-right" />
                </div>
              </div>
            </div>
            <div className="answer">
              You answered: {questions[current].answer}
            </div>
          </div>}
      </div>
    );
  }
}

TestSectorResult.propTypes = {
  total: PropTypes.number,
  correct: PropTypes.number,
  incorrect: PropTypes.number,
  title: PropTypes.string,
  sector: PropTypes.number,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      qid: PropTypes.number,
      question: PropTypes.string,
      answer: PropTypes.string
    })
  )
};

TestSectorResult.defaultProps = {
  total: 0,
  correct: 0,
  incorrect: 0,
  title: 'Example Title goes here',
  sector: 1,
  questions: []
};

export default TestSectorResult;
