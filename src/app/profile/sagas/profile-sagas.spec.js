/* global describe, beforeEach, it */
import { expect } from 'chai';
import { call, put } from 'redux-saga/effects';

import profileSagas from 'app/profile/sagas/profile-sagas';
import { Creators as profileActions } from '../actions';
import { convertToFormData } from 'app/common/util/helpers';
import API from 'app/core/services/api';

const api = API.wla();

describe('Profile Sagas', () => {
  const saga = profileSagas(api);

  describe('Community (friends) sagas', () => {
    describe('when attempting to get friends', () => {
      let iterator;
      let mockAction;

      beforeEach(() => {
        mockAction = { id: 1185 };
        iterator = saga.getMemberCommunityAttempt(mockAction);
      });

      it('should call the community API endpoint', () => {
        expect(iterator.next().value).to.eql(
          call(api.getMemberCommunity, mockAction.id)
        );
      });

      describe('and API response is okay', () => {
        it('should dispatch a success action', () => {
          const successResponse = {
            ok: true,
            // problem: 'uh oh',
            data: {
              status: 'success',
              data: null
            }
          };

          const { data } = successResponse.data;

          iterator.next(); /* Call */
          iterator.next(successResponse); /* checkResponse */

          const expected = put(
            profileActions.getMemberCommunitySuccess(data, true)
          ); /* expected getMemberCommunitySuccess PUT */
          expect(iterator.next(successResponse.data, true).value).to.eql(
            expected
          ); /* actual getMemberCommunitySuccess PUT */
        });
      });

      describe('and API response fails', () => {
        it('should dispatch a failure action', () => {
          const failResponse = 'uh oh';

          iterator.next(); /* Call */
          iterator.next(failResponse); /* checkResponse */

          const expected = put(
            profileActions.getMemberCommunityFailure(failResponse, true)
          );
          expect(iterator.throw(failResponse).value).to.eql(expected);
        });
      });
    });
  });

  describe('Media sagas', () => {
    describe('when attempting to post member photo', () => {
      let iterator;
      let mockAction;

      beforeEach(() => {
        mockAction = {
          data: {
            member_id: 1185,
            payload: {
              title: 'form titile field',
              description: 'form desc field',
              file: [1, 2],
              public: 1
            }
          }
        };
        iterator = saga.postMemberPhotoAttempt(mockAction);
      });

      it('should call the member API endpoint', () => {
        expect(iterator.next().value).to.eql(
          call(api.postMemberPhoto, {
            member_id: mockAction.data.member_id,
            payload: convertToFormData(mockAction.data.payload)
          })
        );
      });

      describe('and API response is okay', () => {
        it('should dispatch a success action', () => {
          const successResponse = {
            ok: true,
            data: {
              status: 'success',
              data: null
            }
          };

          iterator.next();
          iterator.next(successResponse.data);

          const expected = put(
            profileActions.postMemberPhotoSuccess(successResponse.data)
          );
          expect(iterator.next(successResponse).value).to.eql(expected);
        });
      });

      describe('and API response fails', () => {
        it('should dispatch a failure action', () => {
          const failResponse = 'god dammit, php broke again :(';
          iterator.next();

          const expected = put(
            profileActions.postMemberPhotoFailure(failResponse)
          );
          expect(iterator.throw(failResponse).value).to.eql(expected);
        });
      });
    });
  });
});
