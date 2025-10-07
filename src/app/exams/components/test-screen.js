import React, { Component } from 'react';
import { connect } from 'react-redux';
import common from 'app/common';

import TestHeader from './test-header';
import TestFooter from './test-footer';
import TestStartPage from './test-start-page';
import TestContent from './test-content';
import TestScore from './test-score';
import TestCertificate from './test-certificate';
import { Creators as Actions } from '../actions';

import getSkippedQuestions from '../selectors/skipped-questions';

const { UIProgressBar } = common.components;

class TestScreen extends Component {
  constructor(props) {
    super(props);

    this.beginTest = this.beginTest.bind(this);
    this.onAnswer = this.onAnswer.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onPrev = this.onPrev.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.goToQuestion = this.goToQuestion.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.finishTest = this.finishTest.bind(this);
    this.showCertificate = this.showCertificate.bind(this);

    this.state = {
      elapsed: 0
    };
  }

  UNSAFE_componentWillMount() {
    this.props.setQuestions([
      {
        type: 0,
        text: 'Spirits must be served in measures of?',
        title: 'Question 1/5',
        answerChoices: [
          '25ml or 35ml or multiples thereof',
          '25ml or multiples thereof',
          '35ml or multiples thereof',
          '1/5ths or multiples thereof'
        ]
      },
      {
        type: 0,
        text: 'What does the law state with regard to smoking in Scotland?',
        title: 'Question 2/5',
        answerChoices: [
          'Smoking cannot take place inside any public building',
          'Smoking can take place in a designated smoking room',
          'Smoking can take place after the sale of alcohol has ended',
          'Customers can smoke in any hotel bedroom'
        ]
      },
      {
        type: 0,
        text: 'Which of the following are effective hangover remedies?',
        title: 'Question 3/5',
        answerChoices: [
          'Drinking water before, during and after drinking',
          'Drinking black coffee',
          'Eating a full “greasy spoon” breakfast',
          'Take a cold shower'
        ]
      },
      {
        type: 0,
        text: 'How can underage purchasers be deterred?',
        title: 'Question 4/5',
        answerChoices: [
          'Carry out rigorous age checks',
          'Ask every young person if they are over 18',
          'Put up signs warning they will be reported to the Police',
          'Refuse admission to anyone under 18'
        ]
      },
      {
        type: 0,
        text:
          'A person who appears to be drunk requests another drink, what should you do?',
        title: 'Question 5/5',
        answerChoices: [
          'Refuse service',
          'Tell them it is their last one',
          'Serve them a half measure',
          'Offer them a cup of coffee'
        ]
      }
    ]);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onAnswer(answer) {
    this.props.saveAnswer(answer);
  }

  onNext() {
    const {
      currentQuestion,
      setCurrentQuestion,
      questions,
      status
    } = this.props;

    if (currentQuestion < questions.length - 1 && status === 1) {
      setCurrentQuestion(currentQuestion + 1);
      this.startTimer();
    }
  }

  onPrev() {
    const { currentQuestion, setCurrentQuestion, status } = this.props;

    if (currentQuestion > 0 && status === 1) {
      setCurrentQuestion(currentQuestion - 1);
      this.startTimer();
    }
  }

  beginTest() {
    this.props.setStatus(1);
    this.startTimer();
  }

  finishTest() {
    this.props.setStatus(2);
    this.setState({
      elapsed: 120
    });
  }

  goToQuestion(qid) {
    const { setCurrentQuestion, toggleSidebar } = this.props;

    toggleSidebar();
    setCurrentQuestion(qid);
    this.startTimer();
  }

  handleColorChange(type, color) {
    this.props.updateColor(type, color.hex);
  }

  startTimer() {
    this.setState({
      elapsed: 0
    });

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      const { elapsed } = this.state;
      if (elapsed >= 120) {
        clearInterval(this.timer);
      }
      this.setState({
        elapsed: elapsed + 0.1
      });
    }, 100);
  }

  showCertificate() {
    this.props.setStatus(3);
  }

  toggleSidebar() {
    this.props.toggleSidebar();
  }

  render() {
    const {
      status,
      questions,
      answers,
      currentQuestion,
      sidebarOpen,
      skippedQuestions,
      colors
    } = this.props;
    const { elapsed } = this.state;

    return (
      <div className="test-screen">
        <TestHeader
          {...{
            colors,
            colorChangable: status === 1,
            onColorChange: this.handleColorChange
          }}
        />
        {status === 0 && <TestStartPage onStart={this.beginTest} />}
        {status === 1 && (
          <TestContent
            {...{
              question: questions[currentQuestion],
              answer: answers[currentQuestion],
              sidebarOpen,
              skippedQuestions,
              colors,
              onAnswer: this.onAnswer,
              onToggleSidebar: this.toggleSidebar,
              goToQuestion: this.goToQuestion
            }}
          />
        )}
        {status === 2 && <TestScore result={78.4} />}
        {status === 3 && <TestCertificate />}
        {status > 0 && <UIProgressBar progress={(elapsed * 100) / 120} />}
        {status > 0 && (
          <TestFooter
            {...{
              total: questions.length,
              currentQuestion,
              answered: answers[currentQuestion] !== undefined,
              remainingTime: 120 - elapsed,
              status,
              onFinish: this.finishTest,
              onNext: this.onNext,
              onPrev: this.onPrev,
              onShowCertificate: this.showCertificate,
              onToggleSidebar: this.toggleSidebar
            }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ test }) => ({
  ...test,
  skippedQuestions: getSkippedQuestions(test)
});

const mapDispatchToProps = dispatch => ({
  setStatus: st => dispatch(Actions.setStatus(st)),
  saveAnswer: answer => dispatch(Actions.saveAnswer(answer)),
  setQuestions: questions => dispatch(Actions.setQuestions(questions)),
  setCurrentQuestion: qid => dispatch(Actions.setCurrentQuestion(qid)),
  toggleSidebar: () => dispatch(Actions.toggleSidebar()),
  updateColor: (type, color) => dispatch(Actions.updateColor(type, color))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestScreen);
