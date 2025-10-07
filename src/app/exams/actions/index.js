import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  setStatus: ['st'],
  setQuestions: ['questions'],
  saveAnswer: ['answer'],
  setCurrentQuestion: ['qid'],
  updateColor: ['cType', 'color'],
  toggleSidebar: null
});
