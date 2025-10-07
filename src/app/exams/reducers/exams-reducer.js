import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { Types } from '../actions';

export const INITIAL_STATE = Immutable({
  status: 0, // 0: not started, 1: started
  questions: [],
  answers: {},
  currentQuestion: 0,
  sidebarOpen: false,
  colors: {
    background: 'white',
    text: '#7a7a7a'
  }
});

const setStatus = (state, { st }) =>
  state.merge({
    status: st
  });

const setQuestions = (state, { questions }) =>
  state.merge({
    questions
  });

const saveAnswer = (state, { answer }) =>
  state.merge({
    answers: {
      ...state.answers,
      [state.currentQuestion]: answer
    }
  });

const setCurrentQuestion = (state, { qid }) =>
  state.merge({
    currentQuestion: qid
  });

const toggleSidebar = state =>
  state.merge({
    sidebarOpen: !state.sidebarOpen
  });

const updateColor = (state, { cType, color }) =>
  state.merge({
    colors: {
      ...state.colors,
      [cType]: color
    }
  });

const ACTION_HANDLERS = {
  [Types.SET_STATUS]: setStatus,
  [Types.SET_QUESTIONS]: setQuestions,
  [Types.SAVE_ANSWER]: saveAnswer,
  [Types.SET_CURRENT_QUESTION]: setCurrentQuestion,
  [Types.TOGGLE_SIDEBAR]: toggleSidebar,
  [Types.UPDATE_COLOR]: updateColor
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
