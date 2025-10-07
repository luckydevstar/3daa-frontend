import { Types as Type } from 'app/user/actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  attemptingSettingsUpdate: false,
  settingsUpdateSuccess: false,
  settingsUpdateFailure: false
});

/**
 * Update settings
 */

const updateSettingsAttempt = (state, action) =>
  state.merge({
    attemptingSettingsUpdate: true,
    settingsUpdateSuccess: false,
    settingsUpdateFailure: false
  });
const updateSettingsSuccess = (state, action) =>
  state.merge({
    attemptingSettingsUpdate: false,
    settingsUpdateSuccess: true,
    settingsUpdateFailure: false
  });
const updateSettingsFailure = (state, action) =>
  state.merge({
    attemptingSettingsUpdate: false,
    settingsUpdateSuccess: false,
    settingsUpdateFailure: true
  });

// map our types to our handlers
const ACTION_HANDLERS = {
  [Type.UPDATE_SETTINGS_ATTEMPT]: updateSettingsAttempt,
  [Type.UPDATE_SETTINGS_SUCCESS]: updateSettingsSuccess,
  [Type.UPDATE_SETTINGS_FAILURE]: updateSettingsFailure
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
