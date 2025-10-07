import { createSelector } from 'reselect';

const getQuestions = state => state.questions;
const getAnswers = state => state.answers;
const getCurrentQuestion = state => state.currentQuestion;

const getSkippedQuestions = createSelector(
  [getQuestions, getAnswers, getCurrentQuestion],
  (questions, answers, currentQuestion) => {
    const results = [];
    for (let i = 0; i < currentQuestion; i++) {
      if (answers[i] === undefined) {
        results.push({
          title: questions[i].title,
          qid: i
        });
      }
    }
    return results;
  }
);

export default getSkippedQuestions;
