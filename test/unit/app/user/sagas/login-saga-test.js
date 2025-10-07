import { assert } from 'chai';
import { call, put } from 'redux-saga/effects';

import { Creators as Actions } from 'app/user/actions';
import loginSaga from 'app/user/sagas/login-saga';

import API from 'app/core/services/api';

const api = API.wla();

xdescribe('Login Saga', () => {
  let saga, iterator;

  beforeEach(() => {
    saga = loginSaga(api);
  });

  describe('Login attempt', () => {
    const mockAction = { user: { rememberMe: true } };

    beforeEach(() => {
      iterator = saga.loginAttempt(mockAction);
    });

    it('should call the login service', () => {
      assert.deepEqual(iterator.next().value, call(api.login, mockAction.user));
    });

    describe('with success result', () => {
      it('should put a success action', () => {
        const successResponse = {
          ok: true,
          data: {
            status: 'success',
            data: {
              token: 'abcde'
            }
          }
        };
        iterator.next();

        assert.deepEqual(
          iterator.next(successResponse).value,
          put(Actions.loginSuccess(successResponse.data.data, mockAction.user))
        );
      });
    });

    describe('with failed result', () => {
      it('should put a fail action', () => {
        const failedResponse = {
          status: 'failed',
          problem: 'ERROR',
          data: {
            data: {
              general: 'Error'
            },
            message: 'Auth Failed'
          }
        };
        iterator.next();

        assert.deepEqual(
          iterator.next(failedResponse).value,
          put(Actions.loginFailure(failedResponse.data.data.general))
        );
      });
    });
  });

  describe('Login success', () => {
    let mockAction;

    describe('without a token returned', () => {
      beforeEach(() => {
        mockAction = { loginData: { token: '' } };
        iterator = saga.loginSuccess(mockAction);
      });

      it('should throw an error', () => {
        // assert.throws(iterator.next().value, Error, "No token provided by server");
        // expect(iterator.next().value).to.be(new Error('No token provided by server'));
      });
    });

    describe('with a token returned', () => {
      beforeEach(() => {
        mockAction = { loginData: { token: 'Test token' } };
        iterator = saga.loginSuccess(mockAction);
      });

      it('should try to login with token', () => {
        assert.deepEqual(
          iterator.next().value,
          put(Actions.getUserByTokenAttempt(mockAction.loginData.token))
        );
      });
    });
  });

  describe('Login with token attempt', () => {
    let mockAction,
      successResponse = {
        ok: true,
        data: {
          status: 'success',
          data: {}
        }
      },
      failedResponse = {
        problem: 'ERROR'
      };

    describe('when no token is provided', () => {
      beforeEach(() => {
        mockAction = { token: null };
        iterator = saga.getUserByTokenAttempt(mockAction);
      });

      it('should throw an error', () => {
        // assert.throws(iterator.next().value, Error, "No token provided by server");
        // expect(iterator.next().value).to.be(new Error('No token provided by server'));
      });
    });

    describe('when a token is provided', () => {
      beforeEach(() => {
        mockAction = { token: 'test token', isNewSocialAccount: false };
        iterator = saga.getUserByTokenAttempt(mockAction);
      });

      it('should call the login with token service', () => {
        assert.deepEqual(iterator.next().value, call(api.loginWithToken));
      });

      it('and put success action if response is ok', () => {
        iterator.next();
        assert.deepEqual(
          iterator.next(successResponse).value,
          put(
            Actions.getUserByTokenSuccess(
              successResponse.data.data,
              mockAction.isNewSocialAccount,
              mockAction.token
            )
          )
        );
      });

      it('or fail if response not ok', () => {
        iterator.next();
        assert.deepEqual(
          iterator.next(failedResponse).value,
          put(Actions.getUserByTokenFailure(failedResponse.problem))
        );
      });
    });
  });
});
