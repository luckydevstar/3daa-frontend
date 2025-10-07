/* eslint-disable no-constant-condition */
import { eventChannel } from 'redux-saga';
import { takeLatest, put, call, take, select } from 'redux-saga/effects';
import superagent from 'superagent';
import { pipe, head, is, toPairs, fromPairs, prop, assoc } from 'ramda';
import common from 'app/common';
import { Creators, Types } from 'app/workbooks/actions';
import { Creators as QualificationCreators } from 'app/qualifications/actions';
import { Creators as UICreators } from 'app/core/actions';
import { Roles } from 'app/core/config/constants';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse, extractUserRole },
  notify: { notifyError, notifySuccess }
} = common.util;

const { CentreLearner } = Roles;

const CLOUDINARY_UPLOAD_PRESET = 'h6qfgchu';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dep/upload';

const uploadEmitter = file =>
  eventChannel(emit => {
    superagent
      .post(CLOUDINARY_UPLOAD_URL)
      .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      .field('folder', 'test')
      .field('file', file)
      .on('progress', ({ percent }) => emit(Math.floor(percent)))
      .end((err, res) => {
        emit(res);
      });

    return () => {}; // Must return a function (unsubscribe)
  });

export default api => {
  function* saveWorkbookAttempt({ formData, workbook, unitId, workbookId }) {
    try {
      const resp = yield call(
        api.saveWorkbook,
        formData,
        workbook,
        unitId,
        workbookId
      );
      yield checkResponse(resp);
      yield put(Creators.saveWorkbookSuccess(workbook));
      yield put(
        notifySuccess(yield translate('workbook_saved'), {
          duration: 1000,
          canDimiss: true
        })
      );
      yield put(
        QualificationCreators.recordLastSavedState({
          ...workbook,
          workbook_id: parseInt('' + workbookId)
        })
      );
    } catch (err) {
      yield put(Creators.saveWorkbookFailure());
      yield put(
        notifyError(yield translate('workbook_save_failed'), {
          duration: 1000,
          canDimiss: true
        })
      );
    }
  }

  function* getWorkbooksAttempt() {
    try {
      // get the list from the local mock API
      const response = yield call(api.getMockWorkbooks);
      yield put(Creators.getWorkbooksSuccess(response.data.workbooks));
    } catch (err) {
      // static mock workbook list
      // yield put(Creators.getWorkbooksSuccess(WorkbooksMock.workbookList));
    }
  }

  function* getMockWorkbooksAttempt() {
    try {
      // get the list from the local mock API
      const resp = yield call(api.getMockWorkbooks);
      const {
        data: { workbooks }
      } = yield checkResponse(resp);
      yield put(Creators.getMockWorkbooksSuccess(workbooks));
    } catch (err) {
      yield put(Creators.getMockWorkbooksFailure(err));
    }
  }

  function* getWorkbookActivityMemberAttempt({ member_id, activity_id }) {
    try {
      const resp = yield call(
        api.getWorkbookActivityMember,
        member_id,
        activity_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.getWorkbookActivitySuccess(data));
    } catch (err) {
      yield put(Creators.getWorkbookActivityFailure(err));
    }
  }

  function* getWorkbookActivityAttempt({
    unit_id,
    workbook_id,
    activity_code,
    activity_id,
    member_id: learnerID
  }) {
    try {
      // Learners should only hit `getWorkbookActivityMemberAttempt`
      const {
        profile: { user }
      } = yield select();
      const isLearner = extractUserRole(user) === CentreLearner;

      if (isLearner || learnerID) {
        // Use the supplied member_id or get it from the user object
        const member_id = learnerID || user.member_id;

        // Now switch to activity_id instead of activity_code
        yield getWorkbookActivityMemberAttempt({ member_id, activity_id });
        return;
      }

      const resp = yield call(
        api.getWorkbookActivity,
        unit_id,
        workbook_id,
        activity_code
      );
      const { data } = yield checkResponse(resp);
      yield put(Creators.getWorkbookActivitySuccess(data));
    } catch (err) {
      yield put(Creators.getWorkbookActivityFailure(err));
    }
  }

  function* getWorkbookAttempt({ unit_id, workbook_id }) {
    try {
      // send the workbook to the mock API
      const resp = yield call(api.getWorkbook, unit_id, workbook_id);
      console.log(resp);
      const {
        data: { workbook, activities }
      } = yield checkResponse(resp);
      yield put(Creators.getWorkbookSuccess({ ...workbook, activities }));
    } catch (err) {
      yield put(Creators.getWorkbookFailure(err));
    }
  }

  function* getWorkbookMemberAttempt({ member_id, unit_id, workbook_id }) {
    try {
      const {
        profile: { user }
      } = yield select();
      const isLearner = extractUserRole(user) === CentreLearner;

      console.log(member_id, unit_id, workbook_id);

      if (!isLearner && !member_id) {
        yield getWorkbookAttempt({ unit_id, workbook_id });
        return;
      }

      // Use the supplied member_id or get it from the user object
      const learner_id = member_id || user.member_id;

      const resp = yield call(api.getWorkbookMember, learner_id, workbook_id);
      const {
        data: { workbook, activities }
      } = yield checkResponse(resp);
      yield put(Creators.getWorkbookMemberSuccess({ ...workbook, activities }));
    } catch (err) {
      yield put(Creators.getWorkbookMemberFailure(err));
    }
  }

  //  Current moderator
  function* setWorkbookCurrentModeratorAttempt({
    unit_id,
    workbook_id,
    current_moderator
  }) {
    try {
      const resp = yield call(
        api.setWorkbookCurrentModerator,
        unit_id,
        workbook_id,
        { current_moderator }
      );
      const {
        data: { current_moderator: moderator }
      } = yield checkResponse(resp);
      yield put(Creators.setWorkbookCurrentModeratorSuccess(moderator));
    } catch (err) {
      yield put(Creators.setWorkbookCurrentModeratorFailure());
    }
  }

  function* clearWorkbookCurrentModeratorAttempt({ unit_id, workbook_id }) {
    try {
      const resp = yield call(
        api.clearWorkbookCurrentModerator,
        unit_id,
        workbook_id
      );
      yield checkResponse(resp);
      yield put(Creators.clearWorkbookCurrentModeratorSuccess());
    } catch (err) {
      yield put(Creators.clearWorkbookCurrentModeratorFailure());
    }
  }

  function* uploadFileChannel(chan) {
    while (true) {
      const data = yield take(chan);
      if (is(Number, data)) {
        yield put(UICreators.cloudinaryProgress(data));
      } else {
        chan.close();
        return prop('public_id', data.body);
      }
    }
  }

  function* uploadFile(file) {
    yield put(UICreators.cloudinaryProgress(1));
    const chan = yield call(uploadEmitter, file);
    return yield uploadFileChannel(chan);
  }

  function* submitWorkbookDecision({ member_id, activity_id, status }) {
    try {
      const url = status
        ? api.workbookActivityApprove
        : api.workbookActivityReject;
      const resp = yield call(url, activity_id, member_id);
      yield checkResponse(resp);
      yield put(Creators.submitWorkbookDecisionSuccess(status, activity_id));
      yield put(
        notifySuccess(
          yield translate(status ? 'activity_approved' : 'activity_rejected')
        )
      );
    } catch (err) {
      yield put(Creators.submitWorkbookDecisionFailure(err));
      yield put(
        notifySuccess(
          yield translate(
            status ? 'activity_approve_failed' : 'activity_reject_failed'
          )
        )
      );
    }
  }

  function* submitWorkbookActivity({
    member_id,
    workbook_id,
    activity_id,
    evidence,
    save
  }) {
    try {
      const evidenceArr = toPairs(evidence);

      const saveData = yield evidenceArr.map(([key, value]) => {
        if (is(Array, value) && is(File, head(value))) {
          const files = value.map(file => call(uploadFile, file));
          return [key, files];
        }
        return [key, value];
      });
      console.log(saveData);
      console.log(member_id, workbook_id, activity_id);
      const resp = yield call(
        api.submitWorkbookActivityMapped,
        member_id,
        workbook_id,
        activity_id,
        {
          evidence: pipe(fromPairs, JSON.stringify)(saveData),
          submitted: save ? 0 : 1
        }
      );
      console.log(resp);
      const { data } = yield checkResponse(resp);
      yield put(
        Creators.submitWorkbookActivitySuccess(assoc('save', save, data))
      );
      yield put(
        notifySuccess(
          yield translate(save ? 'activity_saved' : 'activity_submitted')
        )
      );
      if (evidence.file) yield put(UICreators.cloudinaryProgress(0));
    } catch (err) {
      yield put(Creators.submitWorkbookActivityFailure(err));
      if (evidence.file) yield put(UICreators.cloudinaryProgress(0));
      yield put(notifyError(yield translate(err)));
    }
  }

  function* startWatchers() {
    yield takeLatest(Types.GET_WORKBOOKS_ATTEMPT, getWorkbooksAttempt);
    yield takeLatest(
      Types.GET_WORKBOOK_MEMBER_ATTEMPT,
      getWorkbookMemberAttempt
    );
    yield takeLatest(
      Types.GET_WORKBOOK_ACTIVITY_ATTEMPT,
      getWorkbookActivityAttempt
    );
    yield takeLatest(
      Types.GET_WORKBOOK_ACTIVITY_MEMBER_ATTEMPT,
      getWorkbookActivityMemberAttempt
    );

    yield takeLatest(Types.GET_MOCK_WORKBOOKS_ATTEMPT, getMockWorkbooksAttempt);
    yield takeLatest(Types.SAVE_WORKBOOK_ATTEMPT, saveWorkbookAttempt);
    yield takeLatest(
      Types.SET_WORKBOOK_CURRENT_MODERATOR_ATTEMPT,
      setWorkbookCurrentModeratorAttempt
    );

    yield takeLatest(
      Types.CLEAR_WORKBOOK_CURRENT_MODERATOR_ATTEMPT,
      clearWorkbookCurrentModeratorAttempt
    );

    yield takeLatest(
      Types.SUBMIT_WORKBOOK_ACTIVITY_ATTEMPT,
      submitWorkbookActivity
    );
    yield takeLatest(Types.SUBMIT_WORKBOOK_DECISION, submitWorkbookDecision);
  }

  return {
    startWatchers,
    getWorkbooksAttempt,
    getWorkbookMemberAttempt,
    getWorkbookActivityAttempt,
    getMockWorkbooksAttempt,
    saveWorkbookAttempt,
    setWorkbookCurrentModeratorAttempt,
    clearWorkbookCurrentModeratorAttempt
  };
};
