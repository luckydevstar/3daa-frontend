import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

import Type from '../actions';

export const INITIAL_STATE = Immutable({});

const example = (state, action) => state.merge({});

// map our types to our handlers
const ACTION_HANDLERS = {
  [Type.EXAMPLE_ACTION]: example
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
