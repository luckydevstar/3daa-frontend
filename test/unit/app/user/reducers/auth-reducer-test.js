import { assert } from 'chai';

import { Creators as Actions } from 'app/user/actions';
import authReducer, { INITIAL_STATE } from 'app/user/reducers/auth-reducer';

describe('Auth Reducer', () => {
  let reducer;

  beforeEach(() => {
    console.log(authReducer);
  });

  describe('Login attempt', () => {
    const mockUser = {
      email: 'test'
    };
    const newState = authReducer(INITIAL_STATE, Actions.loginAttempt(mockUser));
    const expectedState = Object.assign({}, INITIAL_STATE, {
      attemptingToLogin: true
    });

    assert.deepEqual(newState, expectedState);
  });

  describe('Login success', () => {});

  describe('Login failure', () => {
    const errorCode = 'test';
    const newState = authReducer(
      INITIAL_STATE,
      Actions.loginFailure(errorCode)
    );
    const expectedState = Object.assign({}, INITIAL_STATE, { errorCode });

    assert.deepEqual(newState, expectedState);
  });
});
