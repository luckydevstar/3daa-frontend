/* global define, it, describe, FormData */
import { expect } from 'chai';
import { Types, Creators } from 'app/workbooks/actions';

describe('WORKBOOKS: REDUCERS', () => {
  describe('Save workbook', () => {
    describe(': Attempt', () => {
      it('should create a saveWorkbookAttempt action', () => {
        const formData = new FormData();
        const workbook = {};
        const workbookId = 1;
        const unitId = 2;

        const expected = {
          type: Types.SAVE_WORKBOOK_ATTEMPT,
          formData,
          workbook,
          unitId,
          workbookId
        };

        expect(
          Creators.saveWorkbookAttempt(formData, workbook, unitId, workbookId)
        ).to.eql(expected);
      });
    });

    describe(': Success', () => {
      it('should create a saveWorkbookSuccess action', () => {
        const workbook = {
          title: 'Some title'
        };
        const expectedAction = {
          type: Types.SAVE_WORKBOOK_SUCCESS,
          workbook
        };
        expect(Creators.saveWorkbookSuccess(workbook)).to.eql(expectedAction);
      });
    });

    describe(': Failure', () => {
      it('should create a saveWorkbookFailure action', () => {
        const errorCode = null;
        const expectedAction = {
          type: Types.SAVE_WORKBOOK_FAILURE,
          errorCode
        };
        expect(Creators.saveWorkbookFailure(errorCode)).to.eql(expectedAction);
      });
    });
  });

  describe('Get workbooks', () => {
    describe(': Attempt', () => {
      it('should create a getWorkbookMemberAttempt action', () => {
        const member_id = 1;
        const workbook_id = 1;
        const unit_id = 94;
        const expected = {
          type: Types.GET_WORKBOOK_MEMBER_ATTEMPT,
          member_id,
          unit_id,
          workbook_id
        };
        expect(
          Creators.getWorkbookMemberAttempt(member_id, unit_id, workbook_id)
        ).to.eql(expected);
      });
    });
    describe(': Success', () => {
      it('should create a getWorkbookSuccess action', () => {
        const workbook = {
          test: 'test'
        };
        const expected = {
          type: Types.GET_WORKBOOK_SUCCESS,
          workbook
        };
        expect(Creators.getWorkbookSuccess(workbook)).to.eql(expected);
      });
    });

    describe(': Failure', () => {
      it('should create a getWorkbookFailure action', () => {
        const errorCode = null;

        const expectedAction = {
          type: Types.GET_WORKBOOK_FAILURE,
          errorCode
        };

        expect(Creators.getWorkbookFailure(errorCode)).to.eql(expectedAction);
      });
    });
  });

  describe('Get workbooks', () => {
    describe(':Attempt', () => {
      it('should create a getWorkbooksAttempt action', () => {
        const user = {};
        const expected = {
          type: Types.GET_WORKBOOKS_ATTEMPT,
          user
        };
        expect(Creators.getWorkbooksAttempt(user)).to.eql(expected);
      });
    });
    describe(': Success', () => {
      it('should create a getWorkbooksSuccess action', () => {
        const workbooks = {
          test: {
            itemArray: []
          }
        };
        const expected = {
          type: Types.GET_WORKBOOKS_SUCCESS,
          workbooks
        };

        expect(Creators.getWorkbooksSuccess(workbooks)).to.eql(expected);
      });
    });
    describe(': Failure', () => {
      it('should create a getWorkbooksFailure action', () => {
        const errorCode = null;
        const expectedAction = {
          type: Types.GET_WORKBOOKS_FAILURE,
          errorCode
        };
        expect(Creators.getWorkbooksFailure(errorCode)).to.eql(expectedAction);
      });
    });
  });

  describe('Get Mock workbooks', () => {
    describe(': Attempt', () => {
      it('should create a getMockWorkbooksAttempt action', () => {
        const expected = {
          type: Types.GET_MOCK_WORKBOOKS_ATTEMPT
        };
        expect(Creators.getMockWorkbooksAttempt()).to.eql(expected);
      });
    });
  });

  describe(': Success', () => {
    it('should create a getMockWorkbooksSuccess action', () => {
      const workbooks = {
        test: {
          itemArray: []
        }
      };
      const expected = {
        type: Types.GET_MOCK_WORKBOOKS_SUCCESS,
        workbooks
      };
      expect(Creators.getMockWorkbooksSuccess(workbooks)).to.eql(expected);
    });
  });
  describe(': Failure', () => {
    it('should create a getMockWorkbooksFailure action', () => {
      const errorCode = null;

      const expectedAction = {
        type: Types.GET_MOCK_WORKBOOKS_FAILURE,
        errorCode
      };
      expect(Creators.getMockWorkbooksFailure(errorCode)).to.eql(
        expectedAction
      );
    });
  });

  describe('Set the current moderator of a workbook', () => {
    describe(': Attempt', () => {
      it('should create a setWorkbookCurrentModeratorAttempt action', () => {
        const unit_id = 2;
        const workbook_id = 1;
        const current_moderator = false;

        const expected = {
          type: Types.SET_WORKBOOK_CURRENT_MODERATOR_ATTEMPT,
          unit_id,
          workbook_id,
          current_moderator
        };
        expect(
          Creators.setWorkbookCurrentModeratorAttempt(
            unit_id,
            workbook_id,
            current_moderator
          )
        ).to.eql(expected);
      });
    });
    describe(': Success', () => {
      it('should create a setWorkbookCurrentModeratorSuccess action', () => {
        const current_moderator = false;
        const expected = {
          type: Types.SET_WORKBOOK_CURRENT_MODERATOR_SUCCESS,
          current_moderator
        };
        expect(
          Creators.setWorkbookCurrentModeratorSuccess(current_moderator)
        ).to.eql(expected);
      });
    });
    describe(': Failure', () => {
      it('should create a setWorkbookCurrentModeratorFailure action', () => {
        const errorCode = null;

        const expectedAction = {
          type: Types.SET_WORKBOOK_CURRENT_MODERATOR_FAILURE,
          errorCode
        };

        expect(Creators.setWorkbookCurrentModeratorFailure(errorCode)).to.eql(
          expectedAction
        );
      });
    });
  });

  describe('Clear the current moderator of a workbook', () => {
    describe(':Attempt', () => {
      it('should create a clearWorkbookCurrentModeratorAttempt action', () => {
        const unit_id = 2;
        const workbook_id = 14;

        const expected = {
          type: Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_ATTEMPT,
          unit_id,
          workbook_id
        };
        expect(
          Creators.clearWorkbookCurrentModeratorAttempt(unit_id, workbook_id)
        ).to.eql(expected);
      });
    });
    describe(': Success', () => {
      it('should create a clearWorkbookCurrentModeratorSuccess action', () => {
        const expected = {
          type: Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_SUCCESS
        };
        expect(Creators.clearWorkbookCurrentModeratorSuccess()).to.eql(
          expected
        );
      });
    });
    describe(': Failure', () => {
      it('should create a clearWorkbookCurrentModeratorFailure', () => {
        const errorCode = null;
        const expected = {
          type: Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_FAILURE,
          errorCode
        };
        expect(Creators.clearWorkbookCurrentModeratorFailure(errorCode)).to.eql(
          expected
        );
      });
    });
  });

  describe('Retrieve a workbook activity of a workbook', () => {
    describe(': Attempt', () => {
      it('should create a getWorkbookActivityAttempt action', () => {
        const unit_id = 3;
        const workbook_id = 10;
        const activity_code = 2;
        const expected = {
          type: Types.GET_WORKBOOK_ACTIVITY_ATTEMPT,
          unit_id,
          workbook_id,
          activity_code
        };
        expect(
          Creators.getWorkbookActivityAttempt(
            unit_id,
            workbook_id,
            activity_code
          )
        ).to.eql(expected);
      });
    });
    describe(': Success', () => {
      it('should create a getWorkbookActivitySuccess action', () => {
        const data = 'activity text';
        const expected = {
          type: Types.GET_WORKBOOK_ACTIVITY_SUCCESS,
          data
        };
        expect(Creators.getWorkbookActivitySuccess(data)).to.eql(expected);
      });
    });
    describe(': Failure', () => {
      it('should create a getWorkbookActivityFailure action', () => {
        const errorCode = null;
        const expected = {
          type: Types.GET_WORKBOOK_ACTIVITY_FAILURE,
          errorCode
        };

        expect(Creators.getWorkbookActivityFailure(errorCode)).to.eql(expected);
      });
    });
  });

  describe('Clear the current workbook activity data from the store', () => {
    describe(': Reset learner activity', () => {
      it('should create a resetWorkbookActivity action', () => {
        const expected = {
          type: Types.RESET_WORKBOOK_ACTIVITY
        };
        expect(Creators.resetWorkbookActivity()).to.eql(expected);
      });
    });
  });

  describe('UI related information updates to workbook', () => {
    describe(': Clear title', () => {
      it('should create a clearWorkbook action', () => {
        const expected = {
          type: Types.CLEAR_WORKBOOK
        };
        expect(Creators.clearWorkbook()).to.eql(expected);
      });
    });
    describe(': Update title', () => {
      it('should create a updateWorkbookTitle action', () => {
        const title = 'title';
        const expected = {
          type: Types.UPDATE_WORKBOOK_TITLE,
          title
        };
        expect(Creators.updateWorkbookTitle(title)).to.eql(expected);
      });
    });
    describe(': Reset state', () => {
      it('should create a resetWorkbookState action', () => {
        const expected = {
          type: Types.RESET_WORKBOOK_STATE
        };
        expect(Creators.resetWorkbookState()).to.eql(expected);
      });
    });
  });
});
