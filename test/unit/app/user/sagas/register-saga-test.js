import { assert } from 'chai';
import { call, put } from 'redux-saga/effects';

import { Creators as Actions } from 'app/user/actions';
import registerLearnerSaga from 'app/user/sagas/register-learner-saga';

import API from 'app/core/services/api';

const api = API.wla();

describe('Register Saga', () => {
  let saga, iterator;

  beforeEach(() => {
    saga = registerLearnerSaga(api);
  });

  describe('Register attempt', () => {
    const mockAction = { user: {} };

    beforeEach(() => {
      iterator = saga.registerAttempt(mockAction);
    });

    it('should call the register service', () => {
      assert.deepEqual(
        iterator.next().value,
        call(api.registerLearner, mockAction.user)
      );
    });

    describe('with success result', () => {
      it('should put a success action', () => {
        const successResponse = {
          ok: true,
          data: {
            status: 'success',
            data: {
              token: 'dsdsds'
            }
          }
        };
        iterator.next();

        assert.deepEqual(
          iterator.next(successResponse).value,
          put(Actions.registerSuccess(mockAction.user))
        );
      });
    });

    describe('with failed result', () => {
      it('should put a fail action', () => {
        const failedResponse = {
          problem: 'ERROR'
        };
        iterator.next();

        assert.deepEqual(
          iterator.next(failedResponse).value,
          put(Actions.registerFailure(failedResponse.problem))
        );
      });
    });
  });

  describe('Register success', () => {
    let mockAction;

    beforeEach(() => {
      mockAction = {
        registerData: {
          token: 'asdadas'
        }
      };
      iterator = saga.registerSuccess(mockAction);
    });

    it('should redirect to login page', () => {
      // assert.deepEqual(iterator.next().value, put(routerActions.push('/login')));
    });
  });
});
