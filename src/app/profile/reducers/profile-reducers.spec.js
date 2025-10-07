/* global describe, beforeEach, it */
/* eslint no-unused-expressions: 0 */

import { expect } from 'chai';

import { Creators } from '../actions';
import reducer, { INITIAL_STATE } from 'app/profile/reducers/profile-reducers';

describe('Profile Bio Reducers', () => {
  describe('Default', () => {
    it('should return the initial state', () => {
      const sut = reducer(undefined, {});
      expect(sut).to.equal(INITIAL_STATE);
    });
  });

  describe('Profile info reducers', () => {
    let userId;

    describe('When viewing a profile', () => {
      beforeEach(() => {
        userId = 1185;
      });

      describe('getMemberAttempt action', () => {
        it('should return the state with attempting to fetch flag set', () => {
          const expected = Object.assign({}, INITIAL_STATE, {
            gettingMember: true
          }); // Arrange
          const sut = reducer(
            INITIAL_STATE,
            Creators.getMemberAttempt(userId) // Act (software under test)
          );

          expect(sut).to.eql(expected); // Assert
        });
      });

      describe('getMemberSuccess action', () => {
        let sut;
        let mockResponse;

        beforeEach(() => {
          mockResponse = {
            data: [{ id: 1, text: 'foo' }, { id: 2, text: 'bar' }]
          };
          sut = reducer(
            INITIAL_STATE,
            Creators.getMemberSuccess(mockResponse.data)
          );
        });

        it('should unset the attempting to fetch flag', () => {
          expect(sut.gettingMember).to.be.false;
        });

        it('should update profile object with data', () => {
          expect(sut.profile).to.eql(mockResponse.data);
        });
      });

      describe('getMemberFailure action', () => {
        let sut;
        let errorCode;

        beforeEach(() => {
          errorCode = 'uh oh, stuff broke :(';
          sut = reducer(INITIAL_STATE, Creators.getMemberFailure(errorCode));
        });

        it('should unset the attempting to fetch flag', () => {
          expect(sut.gettingMember).to.be.false;
        });

        it('should update the state with an error code', () => {
          expect(sut.errorCode).to.equal(errorCode);
        });
      });
    });
  });

  describe('References reducers', () => {
    let userId;

    describe('When viewing a profile', () => {
      beforeEach(() => {
        userId = 1185;
      });

      describe('getMemberReferenceAttempt action', () => {
        it('should return the state with attempting to fetch flag set', () => {
          const expected = Object.assign({}, INITIAL_STATE, {
            gettingReferences: true
          }); // Arrange
          const sut = reducer(
            INITIAL_STATE,
            Creators.getMemberReferenceAttempt(userId) // Act (software under test)
          );

          expect(sut).to.eql(expected); // Assert
        });
      });

      describe('getMemberReferenceSuccess action', () => {
        let sut;
        let mockResponse;

        beforeEach(() => {
          mockResponse = {
            data: [{ id: 1, text: 'foo' }, { id: 2, text: 'bar' }]
          };
          sut = reducer(
            INITIAL_STATE,
            Creators.getMemberReferenceSuccess(mockResponse)
          );
        });

        it('should unset the attempting to fetch flag', () => {
          expect(sut.gettingReferences).to.be.false;
        });

        it('should update references array with data', () => {
          expect(sut.references).to.eql(mockResponse.data);
        });
      });

      describe('getMemberReferenceFailure action', () => {
        let sut;
        let errorCode;

        beforeEach(() => {
          errorCode = 'uh oh, stuff broke :(';
          sut = reducer(
            INITIAL_STATE,
            Creators.getMemberReferenceFailure(errorCode)
          );
        });

        it('should unset the attempting to fetch flag', () => {
          expect(sut.gettingReferences).to.be.false;
        });

        it('should update the state with an error code', () => {
          expect(sut.errorCode).to.equal(errorCode);
        });
      });
    });
  });

  describe('Community reducers', () => {
    let memberId;

    describe('When viewing a profile', () => {
      beforeEach(() => {
        memberId = 1185;
      });

      describe('getMemberCommunityAttempt action', () => {
        it('should return the state with attempting to fetch flag set', () => {
          const sut = reducer(
            INITIAL_STATE,
            Creators.getMemberCommunityAttempt(memberId)
          );

          expect(sut.gettingCommunity).to.be.true; // Assert
        });
      });

      describe('getMemberCommunitySuccess action', () => {
        let mockResponse;

        it('should unset the attempting to fetch flag', () => {
          mockResponse = { data: { counts: { friends: null } } };
          const sut = reducer(
            INITIAL_STATE,
            Creators.getMemberCommunitySuccess(mockResponse.data)
          );
          expect(sut.gettingCommunity).to.be.false;
        });

        describe('when user has friends', () => {
          beforeEach(() => {
            mockResponse = {
              data: {
                counts: {
                  friends: 123
                },
                friends: [{ id: 1, text: 'foo' }, { id: 2, text: 'bar' }]
              }
            };
          });

          it('should update the state with total amount of friends', () => {
            const sut = reducer(
              INITIAL_STATE,
              Creators.getMemberCommunitySuccess(mockResponse.data)
            );
            expect(sut.communityTotal).to.equal(123);
          });

          it('should update community array with list of friends', () => {
            const sut = reducer(
              INITIAL_STATE,
              Creators.getMemberCommunitySuccess(mockResponse.data)
            );
            expect(sut.community).to.eql(mockResponse.data.friends);
          });
        });

        describe('when user does not have friends', () => {
          beforeEach(() => {
            /* replicates the weird api response! */
            mockResponse = {
              data: {
                counts: null
              }
            };

            it('should update the total friends state to 0', () => {
              const sut = reducer(
                INITIAL_STATE,
                Creators.getMemberCommunitySuccess(mockResponse)
              );
              expect(sut.communityTotal).to.equal(0);
            });

            it('should update community with its initial state', () => {
              const sut = reducer(
                INITIAL_STATE,
                Creators.getMemberCommunitySuccess(mockResponse)
              );
              expect(sut.community).to.equal(INITIAL_STATE.community);
            });
          });
        });
      });

      describe('getMemberCommunityFailure action', () => {
        let sut;
        let errorCode;

        beforeEach(() => {
          errorCode = 'uh oh, stuff broke :(';
          sut = reducer(
            INITIAL_STATE,
            Creators.getMemberCommunityFailure(errorCode)
          );
        });

        it('should unset the attempting to fetch flag', () => {
          expect(sut.gettingCommunity).to.be.false;
        });

        it('should update the state with an error code', () => {
          expect(sut.errorCode).to.equal(errorCode);
        });
      });
    });
  });

  describe('Media reducers', () => {
    let memberId;
    let formPayload;

    describe('When viewing a profile', () => {
      beforeEach(() => {
        memberId = 1185;
        formPayload = {
          file: 'file',
          title: 'my sick image title',
          description: 'an even better description, woo!',
          cover: true,
          public: 1
        };
      });

      describe('postMemberPhotoAttempt action', () => {
        it('should return the state with attempting to fetch flag set', () => {
          const sut = reducer(
            INITIAL_STATE,
            Creators.postMemberPhotoAttempt(memberId, formPayload)
          );

          expect(sut.postingMemberPhoto).to.be.true; // Assert
        });
      });

      describe('postMemberPhotoSuccess action', () => {
        let mockResponse;

        it('should unset the attempting to fetch flag', () => {
          mockResponse = {
            data: { data: { mediaId: 123, cloudinary_file_id: 123456 } }
          };
          const sut = reducer(
            INITIAL_STATE,
            Creators.postMemberPhotoSuccess(mockResponse)
          );
          expect(sut.postingMemberPhoto).to.be.false;
        });
      });

      describe('postMemberPhotoFailure action', () => {
        let sut;
        let errorCode;

        beforeEach(() => {
          errorCode = 'uh oh, stuff broke :(';
          sut = reducer(
            INITIAL_STATE,
            Creators.postMemberPhotoFailure(errorCode)
          );
        });

        it('should unset the attempting to fetch flag', () => {
          expect(sut.postingMemberPhoto).to.be.false;
        });

        it('should update the state with an error code', () => {
          expect(sut.errorCode).to.equal(errorCode);
        });
      });
    });
  });
});
