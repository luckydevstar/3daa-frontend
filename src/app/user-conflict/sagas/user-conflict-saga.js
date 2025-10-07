import { takeEvery, put, call } from 'redux-saga/effects';
import { Types, Creators } from 'app/user-conflict/actions';

export default api => {
  function* getUserConflictListAttmept(action) {
    try {
      const resp = yield call(api.getUserConflictList, action.params || {});
      const users = resp.data.data.members;
      yield put(
        Creators.getUserConflictListSuccess(users, resp.data.data.total)
      );
    } catch (err) {
      yield put(Creators.getUserConflictListFailure(err));
    }
  }

  function* updateUserConflictEmailAttempt(action) {
    try {
      yield call(api.updateUserConflictEmail, action.params, action.member_id);
      yield put(Creators.updateUserConflictEmailSuccess());
      const resp = yield call(api.getUserConflictList);
      const users = resp.data.data.members;
      yield put(
        Creators.getUserConflictListSuccess(users, resp.data.data.total)
      );
    } catch (err) {
      yield put(Creators.updateUserConflictEmailFailure(err));
    }
  }

  function* deleteUserConflictAttempt(action) {
    try {
      yield call(api.deleteUserConlict, action.member_id);
      const resp = yield call(api.getUserConflictList);
      const users = resp.data.data.members;
      yield put(
        Creators.getUserConflictListSuccess(users, resp.data.data.total)
      );
    } catch (err) {
      yield put(Creators.deleteUserConflictFailure(err));
    }
  }

  function* startWatchers() {
    yield takeEvery(
      Types.GET_USER_CONFLICT_LIST_ATTEMPT,
      getUserConflictListAttmept
    );
    yield takeEvery(
      Types.UPDATE_USER_CONFLICT_EMAIL_ATTEMPT,
      updateUserConflictEmailAttempt
    );
    yield takeEvery(
      Types.DELETE_USER_CONFLICT_ATTEMPT,
      deleteUserConflictAttempt
    );
  }

  return {
    startWatchers,
    getUserConflictListAttmept,
    updateUserConflictEmailAttempt,
    deleteUserConflictAttempt
  };
};
