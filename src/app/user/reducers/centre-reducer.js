import { Types as Type } from 'app/user/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  attemptingCentreQualificationsGet: false,
  centreUpdateSuccess: false,
  centreUpdateFailure: false,
  seats: null,
  profile: null,
  qualifications: null
});

/**
 * Update centre
 */

const updateCentreAttempt = (state, action) =>
  state.merge({
    attemptingCentreUpdate: true,
    centreUpdateSuccess: false,
    errorCode: false
  });

const updateCentreSuccess = (state, action) => {
  return state.merge({
    attemptingCentreUpdate: false,
    centreUpdateSuccess: true,
    centreUpdateFailure: false,
    profile: action.data
  });
};

const updateCentreFailure = (state, action) =>
  state.merge({
    attemptingCentreUpdate: false,
    centreUpdateSuccess: false,
    centreUpdateFailure: action.error
  });

/**
 * Get centre user seats
 */
const getCentreSeatsAttempt = (state, action) =>
  state.merge({
    attemptingCentreUpdate: true,
    seats: null,
    errorCode: false
  });

const getCentreSeatsSuccess = (state, action) =>
  state.merge({
    attemptingCentreUpdate: false,
    seats: action.seats,
    errorCode: false
  });

const getCentreSeatsFailure = (state, action) => state.merge({ seats: [] });

/**
 * Get centre profile
 */
const getCentreProfileAttempt = (state, action) =>
  state.merge({ profile: null });

const getCentreProfileSuccess = (state, action) =>
  state.merge({ profile: action.profile });

const getCentreProfileFailure = (state, action) => state.merge({ profile: {} });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Type.UPDATE_CENTRE_ATTEMPT]: updateCentreAttempt,
  [Type.UPDATE_CENTRE_SUCCESS]: updateCentreSuccess,
  [Type.UPDATE_CENTRE_FAILURE]: updateCentreFailure,
  [Type.GET_CENTRE_SEATS_ATTEMPT]: getCentreSeatsAttempt,
  [Type.GET_CENTRE_SEATS_SUCCESS]: getCentreSeatsSuccess,
  [Type.GET_CENTRE_SEATS_FAILURE]: getCentreSeatsFailure,
  [Type.GET_CENTRE_PROFILE_ATTEMPT]: getCentreProfileAttempt,
  [Type.GET_CENTRE_PROFILE_SUCCESS]: getCentreProfileSuccess,
  [Type.GET_CENTRE_PROFILE_FAILURE]: getCentreProfileFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
