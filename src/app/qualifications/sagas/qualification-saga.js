import React from 'react';
import refactorUnitsData from 'app/units/util/refactor-unit-data';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import { compose, prop, head, path } from 'ramda';
import { Types, Creators as Actions } from '../actions';
import common from 'app/common';
import { translate } from 'app/intl';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifyError, notifySuccess },
  sagaSelectors: { getUserCentres, getActiveSector }
} = common.util;

export default api => {
  function* getCentreID() {
    const centres = yield select(getUserCentres);
    const id = compose(prop('centre_id'), head)(centres);
    return id;
  }

  function* getQualificationTypesAttempt() {
    try {
      const resp = yield call(api.getQualificationTypes);
      const data = yield checkResponse(resp);
      yield put(Actions.getQualificationTypesSuccess(data));
    } catch (err) {
      yield put(Actions.getQualificationTypesFailure(err));
    }
  }

  function* getQualificationTypesSuccess(action) {
    console.log('getQualificationTypesSuccess', action.response);
  }

  function* getQualificationTypesFailure(action) {
    console.log('getMemberBioFailure', action);
  }

  function* createQualificationAttempt(action) {
    try {
      const resp = yield call(
        api.postQualification,
        convertToFormData(action.payload),
        action.id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.createQualificationSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Actions.createQualificationFailure(err));
    }
  }

  function* createQualificationSuccess() {
    yield put(
      notifySuccess(yield translate('qualification_added'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* createQualificationFailure() {
    yield put(
      notifyError(yield translate('qualification_added'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* updateQualificationAttempt(action) {
    try {
      const resp = yield call(
        api.updateQualification,
        convertToFormData(action.payload),
        action.id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.updateQualificationSuccess(data));
    } catch (err) {
      yield put(Actions.updateQualificationFailure(err));
    }
  }

  function* updateQualificationSuccess() {
    yield put(
      notifySuccess(yield translate('qualification_added'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* updateQualificationFailure() {
    yield put(
      notifyError(yield translate('qualification_updated'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getQualificationAttempt(action) {
    try {
      const resp = yield call(
        api.getInActiveLearningQualification,
        action.qualification_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.getQualificationSuccess(data));
    } catch (err) {
      yield put(
        Actions.getQualificationFailure(
          yield translate('qualification_get_failed')
        )
      );
    }
  }

  function* getQualificationFailure({ errorCode }) {
    yield put(
      notifyError(yield translate(errorCode), {
        duration: 30000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getAllQualificationsAttempt() {
    const sector = yield select(getActiveSector);
    try {
      const resp = yield call(api.getAllQualifications, sector.sector_id);
      const {
        data: { qualifications }
      } = yield checkResponse(resp);
      yield put(Actions.getAllQualificationsSuccess(qualifications));
    } catch (err) {
      yield put(
        Actions.getAllQualificationsFailure(
          yield translate('qualification_get_failed')
        )
      );
    }
  }

  function* getAllQualificationsFailure({ errorCode }) {
    yield put(
      notifyError(yield translate(errorCode), {
        duration: 30000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getMemberQualificationsAttempt({ member_id }) {
    const sector = yield select(getActiveSector);
    try {
      const resp = yield call(
        api.getMemberQualifications,
        member_id,
        sector.sector_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.getMemberQualificationsSuccess(data));
    } catch ({ message, stack }) {
      yield put(Actions.getMemberQualificationsFailure(message));
    }
  }

  function* getCentreQualificationsAttempt({ centre_id }) {
    const sector = yield select(getActiveSector);
    try {
      const resp = yield call(
        api.getCentreQualifications,
        centre_id,
        sector.sector_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.getCentreQualificationsSuccess(data));
    } catch ({ message, stack }) {
      yield put(Actions.getCentreQualificationsFailure(message));
    }
  }

  function* getCentreQualificationAttempt({ centre_id, qualification_id }) {
    try {
      const resp = yield call(
        api.getCentreQualification,
        centre_id,
        qualification_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.getCentreQualificationSuccess(data));
    } catch ({ message, stack }) {
      yield put(
        Actions.getCentreQualificationFailure(
          yield translate('qualification_get_failed')
        )
      );
    }
  }

  function* getCentreQualificationFailure({ errorCode }) {
    yield put(
      notifyError(yield translate(errorCode), {
        duration: 30000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postQualificationMappingAttempt({
    centre_id,
    qualification_id,
    params
  }) {
    try {
      const resp = yield call(
        api.postQualificationMapping,
        centre_id,
        qualification_id,
        params
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.postQualificationMappingSuccess(data));
    } catch ({ message, stack }) {
      yield put(Actions.postQualificationMappingFailure(message));
    }
  }

  function* postQualificationMappingSuccess() {
    yield put(
      notifySuccess(yield translate('mapping_saved'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* postQualificationMappingFailure() {
    yield put(
      notifyError(yield translate('qualification_map_failed'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postQualificationToGroupsMappingAttempt({
    centre_id,
    qualification_id,
    groups
  }) {
    try {
      const resp = yield call(
        api.postCentreQualification,
        centre_id,
        qualification_id,
        { groups }
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.postQualificationToGroupsMappingSuccess(data));
    } catch ({ message, stack }) {
      yield put(Actions.postQualificationToGroupsMappingFailure(message));
    }
  }

  function* postQualificationToGroupsMappingSuccess() {
    yield put(
      notifySuccess(yield translate('group_assign_success'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* postQualificationToGroupsMappingFailure() {
    yield put(
      notifyError(yield translate('group_assign_failed'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* postQualificationPathwayAttempt({
    centre_id,
    qualification_id,
    payload
  }) {
    try {
      const resp = yield call(
        api.postQualificationPathway,
        centre_id,
        qualification_id,
        payload
      );
      console.log(resp);
      const { data } = yield checkResponse(resp);
      yield put(Actions.postQualificationPathwaySuccess(data));
    } catch ({ message, stack }) {
      yield put(Actions.postQualificationPathwayFailure(message));
    }
  }

  function* postQualificationPathwaySuccess() {
    yield put(
      notifySuccess(yield translate('pathway_created'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* postQualificationPathwayFailure() {
    yield put(
      notifyError(yield translate('pathway_create_failed'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* deleteQualificationAttempt({ qualification_id }) {
    try {
      // const resp = yield call(
      //   api.deleteQualification,
      //   qualification_id,
      //   yield getCentreID()
      // );
      const resp = yield call(api.deleteQualification, qualification_id);
      yield checkResponse(resp);
      yield put(Actions.deleteQualificationSuccess(qualification_id));
    } catch ({ message, stack }) {
      console.log(message, stack);
      yield put(Actions.deleteQualificationFailure(message));
    }

    // try {
    //   const resp = yield call(
    //     api.postQualification,
    //     convertToFormData(action.payload),
    //     action.id
    //   );
    //   const data = yield checkResponse(resp);
    //   yield put(Actions.createQualificationSuccess(data));
    // } catch (err) {
    //   console.log(err);
    //   yield put(Actions.createQualificationFailure(err));
    // }
  }

  function* deleteQualificationSuccess() {
    yield put(
      notifySuccess(yield translate('pathway_deleted'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* deleteQualificationFailure() {
    yield put(
      notifyError(yield translate('pathway_delete_failed'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* addQualificationStoreAttempt(action) {
    try {
      const resp = yield call(
        api.addQualificationToStore,
        convertToFormData(action.payload),
        action.qualification_id
      );
      const data = yield checkResponse(resp);
      yield put(Actions.addQualificationStoreSuccess(data));
    } catch (err) {
      yield put(Actions.addQualificationStoreFailure(err));
    }
  }

  function* addQualificationStoreSuccess() {
    yield put(
      notifySuccess(yield translate('qualification_added_in_store'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* addQualificationStoreFailure(err) {
    yield put(
      notifyError(yield translate('qualification_add_failed_in_store'), {
        duration: 1000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getQualificationStoreAttempt({ alification_id }) {
    try {
      const resp = yield call(
        api.getQualificationStore,

        qualification_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.getQualificationStoreSuccess(data));
    } catch ({ message, stack }) {
      yield put(
        Actions.getQualificationStoreFailure(
          yield translate('qualification_store_get_failed')
        )
      );
    }
  }

  function* getQualificationStoreFailure({ errorCode }) {
    yield put(
      notifyError(yield translate(errorCode), {
        duration: 30000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getLearningUnitsAttempt(action) {
    try {
      const params = action.params || null;
      const resp = yield call(api.getUnits, params);
      const data = yield checkResponse(resp);
      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.getLearningUnitsSuccess(data));
    } catch (err) {
      yield put(Actions.getLearningUnitsFailure(err));
    }
  }

  function* getLearningUnitsFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
  }

  function* getLearningUnitAttempt(action) {
    try {
      const resp = yield call(
        api.getLearningUnit,
        action.qualification_id,
        action.unit_id
      );
      const data = yield checkResponse(resp);
      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.getLearningUnitSuccess(data));
    } catch (err) {
      yield put(Actions.getLearningUnitFailure(err));
    }
  }

  function* getLearningUnitFailure(action) {
    const { errorCode } = action;
    console.log(errorCode);
  }

  function* createLearningUnitAttempt(action) {
    try {
      const resp = yield call(
        api.createLearningUnit,
        convertToFormData(action.unit)
      );
      const data = yield checkResponse(resp);
      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.createLearningUnitSuccess(data));
    } catch (err) {
      yield put(Actions.createLearningUnitFailure(err));
    }
  }

  function* createLearningUnitSuccess() {
    yield put(
      notifySuccess(yield translate('unit_created'), {
        duration: 1000,
        canDimiss: true
      })
    );
    // yield getQualificationUnitsAttempt({
    //   params: { limit: 20, offset: 0, sort: 'unit_id', order: 'desc' }
    // });
  }

  function* createLearningUnitFailure(action) {
    const { errorCode } = action;
    // TODO api error?
    yield put(notifyError(errorCode));
  }

  function* updateLearningUnitAttempt(action) {
    try {
      const resp = yield call(
        api.updateLearningUnit,
        convertToFormData(action.unit),
        action.id
      );
      const data = yield checkResponse(resp);
      data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.updateLearningUnitSuccess(data));
    } catch (err) {
      yield put(Actions.updateLearningUnitFailure(err));
    }
  }

  function* updateLearningUnitSuccess() {
    yield put(
      notifySuccess(yield translate('unit_created'), {
        duration: 1000,
        canDimiss: true
      })
    );
    // yield getQualificationUnitsAttempt({
    //   params: { limit: 20, offset: 0, sort: 'unit_id', order: 'desc' }
    // });
  }

  function* updateLearningUnitFailure(action) {
    const { errorCode } = action;
    console.log('Failure: ', errorCode);
    // TODO api error?
    yield put(
      notifyError(yield translate('unit_created_failed'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  function* deleteLearningUnitAttempt(action) {
    try {
      const resp = yield call(api.deleteLearningUnit, action.id);
      // const data = yield checkResponse(resp);
      // data.data.units = refactorUnitsData(data.data.units);
      yield put(Actions.deleteLearningUnitSuccess(action.id));
    } catch (err) {
      yield put(Actions.deleteLearningUnitFailure(err));
    }
  }

  function* deleteLearningUnitSuccess() {
    yield put(
      notifySuccess(yield translate('unit_deleted'), {
        duration: 1000,
        canDimiss: true
      })
    );
    // yield getQualificationUnitsAttempt({
    //   params: { limit: 20, offset: 0, sort: 'unit_id', order: 'desc' }
    // });
  }

  function* deleteLearningUnitFailure(action) {
    const { errorCode } = action;
    console.log('Failure: ', errorCode);
    // TODO api error?
    yield put(
      notifyError(yield translate('unit_deleted_failed'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  function* changeLearningUnitStatusAttempt(action) {
    try {
      const resp = yield call(
        api.changeLearningUnitStatus,
        action.status,
        action.id
      );
      yield put(
        Actions.changeLearningUnitStatusSuccess(action.status, action.id)
      );
    } catch (err) {
      yield put(Actions.changeLearningUnitStatusFailure(err));
    }
  }

  function* changeLearningUnitStatusSuccess() {
    yield put(
      notifySuccess(yield translate('unit_updated'), {
        duration: 1000,
        canDimiss: true
      })
    );
    // yield getQualificationUnitsAttempt({
    //   params: { limit: 20, offset: 0, sort: 'unit_id', order: 'desc' }
    // });
  }

  function* changeLearningUnitStatusFailure(action) {
    const { errorCode } = action;
    console.log('Failure: ', errorCode);
    // TODO api error?
    yield put(
      notifyError(yield translate('unit_updated_failed'), {
        duration: 1000,
        canDimiss: true
      })
    );
  }

  function* createWorkbookAttempt(action) {
    try {
      const qualificationId = yield select(state =>
        path(
          [
            'qualifications',
            'currentQualification',
            'qualification',
            'qualification_id'
          ],
          state
        )
      );
      const resp = yield call(
        api.createWorkbook,
        action.formData,
        action.unit_id
      );
      const { data } = yield checkResponse(resp);

      yield put(Actions.createWorkbookSuccess(data));
      if (qualificationId) {
        yield put(Actions.getQualificationAttempt(qualificationId));
      }
      yield put(
        notifySuccess(yield translate('workbook_created'), {
          duration: 2000,
          canDimiss: true
        })
      );
    } catch (err) {
      yield put(Actions.createWorkbookFailure(err));
    }
  }

  function* createWorkbookFailure({ error }) {
    yield put(
      notifyError(error, {
        duration: 10000,
        canDimiss: true,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  function* getWorkbookAttempt(action) {
    try {
      // send the workbook to the mock API
      const response = yield call(
        api.getWorkbook,
        action.unit_id,
        action.workbook_id
      );
      response.data.data.workbook.activities = response.data.data.activities;
      yield put(Actions.getWorkbookSuccess(response.data.data.workbook));
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Get activity types
   */
  function* getActivityTypesAttempt() {
    try {
      const resp = yield call(api.getActivityTypes);
      const {
        data: { activity_types }
      } = yield checkResponse(resp);

      yield put(Actions.getActivityTypesSuccess(activity_types));
    } catch (err) {
      yield put(Actions.getActivityTypesFailure(err));
    }
  }

  function* getActivityTypesSuccess() {
    console.log('Activity type retreival successful');
  }

  function* getActivityTypesFailure() {
    yield put(
      notifyError(yield translate('activity_types_load_failed'), {
        canDimiss: true
      })
    );
  }

  // WORKBOOK media

  function* postWorkbookMediaAttempt(action) {
    try {
      const resp = yield call(
        api.postWorkbookMedia,
        convertToFormData(action.payload)
      );
      yield checkResponse(resp);
      yield put(Actions.postWorkbookMediaSuccess(resp));
    } catch (err) {
      yield put(Actions.postWorkbookMediaFailure(err));
    }
  }

  function* postWorkbookMediaFailure(action) {
    console.error('Failure', action);
  }

  function* deleteWorkbookMediaAttempt(action) {
    try {
      const resp = yield call(api.deleteWorkbookMedia, action.media_id);
      yield checkResponse(resp);
      yield put(Actions.deleteWorkbookMediaSuccess(resp));
    } catch (err) {
      yield put(Actions.deleteWorkbookMediaFailure(err));
    }
  }

  function* deleteWorkbookMediaFailure(action) {
    console.error('Failure', action);
  }

  function* getWorkbookMediaAttempt(action) {
    try {
      const resp = yield call(api.getWorkbookMedia, action.params);
      yield checkResponse(resp);
      yield put(Actions.getWorkbookMediaSuccess(resp));
    } catch (err) {
      yield put(Actions.getWorkbookMediaFailure(err));
    }
  }

  function* getWorkbookMediaFailure(action) {
    console.error('Failure', action);
  }

  /**
   * Get activity
   */
  function* getActivityAttempt(action) {
    try {
      const resp = yield call(api.getActivity, action.activityId);
      const {
        data: { activity }
      } = yield checkResponse(resp);
      yield put(Actions.getActivitySuccess(activity));
    } catch (err) {
      yield put(Actions.getActivityFailure(err));
    }
  }

  function* getActivityFailure(action) {
    console.error('Failure', action);
  }

  /**
   * Update activity
   */
  function* updateActivityAttempt(action) {
    console.log('Update activity attempt');
    try {
      const resp = yield call(
        api.updateActivity,
        action.formData,
        action.activity_id
      );
      const { data } = yield checkResponse(resp);
      yield put(Actions.updateActivitySuccess(data));
    } catch (err) {
      yield put(Actions.updateActivityFailure(err));
    }
  }

  function* updateActivitySuccess() {
    console.log('Update activity success');
  }

  function* updateActivityFailure() {
    console.log('Update activity failure');
  }

  /**
   * Create activity
   */
  function* createActivityAttempt(action) {
    try {
      const resp = yield call(api.createActivity, action.formData);
      const { data } = yield checkResponse(resp);
      yield put(Actions.createActivitySuccess(data));
    } catch (err) {
      yield put(Actions.createActivityFailure(err));
    }
  }

  function* createActivitySuccess(action) {
    console.log('Activity created!', action);
  }

  function* createActivityFailure(action) {
    console.log('Create activity failure', action);
  }

  function* getLearingHoursAttempt(action) {
    try {
      const { groupId, memberId, type } = action.params;
      let resp;
      if (type) {
        let apiUrl;
        if (type === 0) apiUrl = api.getGroupLoginThisWeekHours;
        else if (type === 1) apiUrl = api.getGroupPopularHours;
        else if (type === 2) apiUrl = api.getGroupLearningHours;

        if (groupId) {
          resp = yield call(apiUrl, yield getCentreID(), groupId);
        }
      } else {
        if (groupId) {
          resp = yield call(
            api.getGroupLearningHours,
            yield getCentreID(),
            groupId
          );
        } else if (memberId) {
          resp = yield call(api.getLearnerLearningHours, memberId);
        } else {
          resp = yield call(api.getLearningHours, yield getCentreID());
        }
      }

      const { data } = yield checkResponse(resp);
      yield put(Actions.getLearingHoursSuccess(data));
    } catch (err) {
      yield put(Actions.getLearingHoursFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(
      Types.GET_QUALIFICATION_TYPES_ATTEMPT,
      getQualificationTypesAttempt
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_TYPES_SUCCESS,
      getQualificationTypesSuccess
    );
    yield takeEvery(
      Types.GET_QUALIFICATION_TYPES_FAILURE,
      getQualificationTypesFailure
    );

    yield takeEvery(Types.GET_QUALIFICATION_ATTEMPT, getQualificationAttempt);
    yield takeEvery(Types.GET_QUALIFICATION_FAILURE, getQualificationFailure);

    yield takeEvery(
      Types.GET_ALL_QUALIFICATIONS_ATTEMPT,
      getAllQualificationsAttempt
    );
    yield takeEvery(
      Types.GET_ALL_QUALIFICATIONS_FAILURE,
      getAllQualificationsFailure
    );

    yield takeEvery(
      Types.GET_MEMBER_QUALIFICATIONS_ATTEMPT,
      getMemberQualificationsAttempt
    );

    yield takeEvery(
      Types.CREATE_QUALIFICATION_ATTEMPT,
      createQualificationAttempt
    );
    yield takeEvery(
      Types.CREATE_QUALIFICATION_SUCCESS,
      createQualificationSuccess
    );
    yield takeEvery(
      Types.CREATE_QUALIFICATION_FAILURE,
      createQualificationFailure
    );

    yield takeEvery(
      Types.UPDATE_QUALIFICATION_ATTEMPT,
      updateQualificationAttempt
    );
    yield takeEvery(
      Types.UPDATE_QUALIFICATION_SUCCESS,
      updateQualificationSuccess
    );
    yield takeEvery(
      Types.UPDATE_QUALIFICATION_FAILURE,
      updateQualificationFailure
    );

    yield takeEvery(
      Types.GET_CENTRE_QUALIFICATIONS_ATTEMPT,
      getCentreQualificationsAttempt
    );

    yield takeEvery(
      Types.GET_CENTRE_QUALIFICATION_ATTEMPT,
      getCentreQualificationAttempt
    );

    yield takeEvery(
      Types.GET_CENTRE_QUALIFICATION_FAILURE,
      getCentreQualificationFailure
    );

    yield takeEvery(
      Types.POST_QUALIFICATION_MAPPING_ATTEMPT,
      postQualificationMappingAttempt
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_MAPPING_SUCCESS,
      postQualificationMappingSuccess
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_MAPPING_FAILURE,
      postQualificationMappingFailure
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_TO_GROUPS_MAPPING_ATTEMPT,
      postQualificationToGroupsMappingAttempt
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_TO_GROUPS_MAPPING_SUCCESS,
      postQualificationToGroupsMappingSuccess
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_TO_GROUPS_MAPPING_FAILURE,
      postQualificationToGroupsMappingFailure
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_PATHWAY_ATTEMPT,
      postQualificationPathwayAttempt
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_PATHWAY_SUCCESS,
      postQualificationPathwaySuccess
    );
    yield takeEvery(
      Types.POST_QUALIFICATION_PATHWAY_FAILURE,
      postQualificationPathwayFailure
    );

    yield takeEvery(
      Types.DELETE_QUALIFICATION_ATTEMPT,
      deleteQualificationAttempt
    );
    yield takeEvery(
      Types.DELETE_QUALIFICATION_SUCCESS,
      deleteQualificationSuccess
    );
    yield takeEvery(
      Types.DELETE_QUALIFICATION_FAILURE,
      deleteQualificationFailure
    );

    yield takeEvery(
      Types.ADD_QUALIFICATION_STORE_ATTEMPT,
      addQualificationStoreAttempt
    );
    yield takeEvery(
      Types.ADD_QUALIFICATION_STORE_SUCCESS,
      addQualificationStoreSuccess
    );
    yield takeEvery(
      Types.ADD_QUALIFICATION_STORE_FAILURE,
      addQualificationStoreFailure
    );

    // Learning Unit
    yield takeEvery(Types.GET_LEARNING_UNITS_ATTEMPT, getLearningUnitsAttempt);
    yield takeEvery(Types.GET_LEARNING_UNITS_FAILURE, getLearningUnitsFailure);

    yield takeEvery(Types.GET_LEARNING_UNIT_ATTEMPT, getLearningUnitAttempt);
    yield takeEvery(Types.GET_LEARNING_UNIT_FAILURE, getLearningUnitFailure);

    yield takeEvery(
      Types.CREATE_LEARNING_UNIT_ATTEMPT,
      createLearningUnitAttempt
    );
    yield takeEvery(
      Types.CREATE_LEARNING_UNIT_SUCCESS,
      createLearningUnitSuccess
    );
    yield takeEvery(
      Types.CREATE_LEARNING_UNIT_FAILURE,
      createLearningUnitFailure
    );

    yield takeEvery(
      Types.UPDATE_LEARNING_UNIT_ATTEMPT,
      updateLearningUnitAttempt
    );
    yield takeEvery(
      Types.UPDATE_LEARNING_UNIT_SUCCESS,
      updateLearningUnitSuccess
    );
    yield takeEvery(
      Types.UPDATE_LEARNING_UNIT_FAILURE,
      updateLearningUnitFailure
    );

    yield takeEvery(
      Types.DELETE_LEARNING_UNIT_ATTEMPT,
      deleteLearningUnitAttempt
    );
    yield takeEvery(
      Types.DELETE_LEARNING_UNIT_SUCCESS,
      deleteLearningUnitSuccess
    );
    yield takeEvery(
      Types.DELETE_LEARNING_UNIT_FAILURE,
      deleteLearningUnitFailure
    );

    yield takeEvery(
      Types.CHANGE_LEARNING_UNIT_STATUS_ATTEMPT,
      changeLearningUnitStatusAttempt
    );

    yield takeEvery(
      Types.CHANGE_LEARNING_UNIT_STATUS_SUCCESS,
      changeLearningUnitStatusSuccess
    );

    yield takeEvery(
      Types.CHANGE_LEARNING_UNIT_STATUS_FAILURE,
      changeLearningUnitStatusFailure
    );

    yield takeEvery(Types.GET_ACTIVITY_ATTEMPT, getActivityAttempt);
    yield takeEvery(Types.GET_ACTIVITY_FAILURE, getActivityFailure);

    yield takeEvery(Types.UPDATE_ACTIVITY_ATTEMPT, updateActivityAttempt);
    yield takeEvery(Types.UPDATE_ACTIVITY_SUCCESS, updateActivitySuccess);
    yield takeEvery(Types.UPDATE_ACTIVITY_FAILURE, updateActivityFailure);

    yield takeEvery(Types.CREATE_ACTIVITY_ATTEMPT, createActivityAttempt);
    yield takeEvery(Types.CREATE_ACTIVITY_SUCCESS, createActivitySuccess);
    yield takeEvery(Types.CREATE_ACTIVITY_FAILURE, createActivityFailure);

    yield takeEvery(Types.CREATE_WORKBOOK_ATTEMPT, createWorkbookAttempt);
    yield takeEvery(Types.CREATE_WORKBOOK_FAILURE, createWorkbookFailure);

    yield takeEvery(Types.GET_WORKBOOK_ATTEMPT, getWorkbookAttempt);

    yield takeEvery(Types.GET_ACTIVITY_TYPES_ATTEMPT, getActivityTypesAttempt);
    yield takeEvery(Types.GET_ACTIVITY_TYPES_SUCCESS, getActivityTypesSuccess);
    yield takeEvery(Types.GET_ACTIVITY_TYPES_FAILURE, getActivityTypesFailure);

    yield takeEvery(Types.GET_WORKBOOK_MEDIA_ATTEMPT, getWorkbookMediaAttempt);
    yield takeEvery(Types.GET_WORKBOOK_MEDIA_FAILURE, getWorkbookMediaFailure);

    yield takeEvery(
      Types.POST_WORKBOOK_MEDIA_ATTEMPT,
      postWorkbookMediaAttempt
    );
    yield takeEvery(
      Types.POST_WORKBOOK_MEDIA_FAILURE,
      postWorkbookMediaFailure
    );

    yield takeEvery(
      Types.DELETE_WORKBOOK_MEDIA_ATTEMPT,
      deleteWorkbookMediaAttempt
    );
    yield takeEvery(
      Types.DELETE_WORKBOOK_MEDIA_FAILURE,
      deleteWorkbookMediaFailure
    );
    yield takeEvery(Types.GET_LEARING_HOURS_ATTEMPT, getLearingHoursAttempt);
  }

  return {
    startWatchers,

    getQualificationTypesAttempt,
    getQualificationAttempt,
    getQualificationFailure,

    getAllQualificationsAttempt,
    getAllQualificationsFailure,

    createQualificationAttempt,
    createQualificationSuccess,
    createQualificationFailure,

    updateQualificationAttempt,
    updateQualificationSuccess,
    updateQualificationFailure,

    getMemberQualificationsAttempt,

    getCentreQualificationsAttempt,
    getCentreQualificationAttempt,

    postQualificationMappingAttempt,
    postQualificationMappingSuccess,
    postQualificationMappingFailure,

    postQualificationToGroupsMappingAttempt,
    postQualificationToGroupsMappingSuccess,
    postQualificationToGroupsMappingFailure,

    postQualificationPathwayAttempt,
    postQualificationPathwaySuccess,
    postQualificationPathwayFailure,

    deleteQualificationAttempt,
    deleteQualificationSuccess,
    deleteQualificationFailure,

    addQualificationStoreAttempt,
    addQualificationStoreSuccess,
    addQualificationStoreFailure,

    getLearningUnitsAttempt,
    getLearningUnitsFailure,

    getLearningUnitAttempt,
    getLearningUnitFailure,

    createLearningUnitAttempt,
    createLearningUnitSuccess,
    createLearningUnitFailure,

    updateLearningUnitAttempt,
    updateLearningUnitSuccess,
    updateLearningUnitFailure,

    deleteLearningUnitAttempt,
    deleteLearningUnitSuccess,
    deleteLearningUnitFailure,

    changeLearningUnitStatusAttempt,
    changeLearningUnitStatusSuccess,
    changeLearningUnitStatusFailure,

    getActivityAttempt,
    getActivityFailure,

    updateActivityAttempt,
    updateActivitySuccess,
    updateActivityFailure,

    createActivityAttempt,
    createActivitySuccess,
    createActivityFailure,

    createWorkbookAttempt,
    createWorkbookFailure,

    getWorkbookAttempt,

    getActivityTypesAttempt,
    getActivityTypesSuccess,
    getActivityTypesFailure,

    getWorkbookMediaAttempt,
    getWorkbookMediaFailure,

    postWorkbookMediaAttempt,
    postWorkbookMediaFailure,
    deleteWorkbookMediaAttempt,
    deleteWorkbookMediaFailure,

    getLearingHoursAttempt
  };
};
