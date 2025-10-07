import { Types } from 'app/core/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  config: {}
});

const getConfigAttempt = state => state.merge({ attemptingGetConfig: true });

const getConfigSuccess = (state, { config }) =>
  state.merge({ config, attemptingGetConfig: false });

const getConfigFailure = state => state.merge({ attemptingGetConfig: false });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Types.GET_CONFIG_ATTEMPT]: getConfigAttempt,
  [Types.GET_CONFIG_SUCCESS]: getConfigSuccess,
  [Types.GET_CONFIG_FAILURE]: getConfigFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
