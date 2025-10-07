import { all } from 'redux-saga/effects';
import API from '../services/api';
import appSaga from './app-saga';

// Modules
import user from 'app/user';
import qualifications from 'app/qualifications';
import video from 'app/video';
import jobs from 'app/jobs';
import workbooks from 'app/workbooks';
import units from 'app/units';
import profile from 'app/profile';
import community from 'app/community';
import customer from 'app/customer';
// import workbooksBuilder from 'app/workbooks-builder';
import libraries from 'app/libraries';
import chats from 'app/messaging';
import notifications from 'app/notifications';
// Version 2
import bookstand from 'app/bookstand1';
import modalGroup from 'app/modal-group';
import news from 'app/news';
import sectors from 'app/sectors';
import store from 'app/store';
import assessment from 'app/assessment';
import dashboard from 'app/dashboard';
import finance from 'app/finance';
import pairing from 'app/pairing-wheel';
import userConflict from 'app/user-conflict';

const api = API.wla();

// start the daemons
export default function* root() {
  yield all([
    appSaga(api).startWatchers(),
    user.sagas.loginSaga(api).startWatchers(),
    user.sagas.registerLearnerSaga(api).startWatchers(),
    user.sagas.registerEducatorSaga(api).startWatchers(),
    user.sagas.registerOtherSaga(api).startWatchers(),
    user.sagas.validateSaga(api).startWatchers(),
    user.sagas.profileSaga(api).startWatchers(),
    user.sagas.centreSaga(api).startWatchers(),
    user.sagas.passwordSaga(api).startWatchers(),
    user.sagas.settingsSaga(api).startWatchers(),

    video.sagas.videoSaga(api).startWatchers(),
    video.sagas.videoCategoriesSaga(api).startWatchers(),
    jobs.sagas.jobsSaga(api).startWatchers(),
    workbooks.sagas.workbooksSaga(api).startWatchers(),
    units.sagas.unitsSaga(api).startWatchers(),
    profile.sagas.profileSagas(api).startWatchers(),
    // workbooksBuilder.sagas.workbooksBuilderSaga(api).startWatchers(),
    libraries.sagas.librarySagas(api).startWatchers(),
    chats.sagas.chatSagas(api).startWatchers(),
    community.sagas.communitySaga(api).startWatchers(),
    customer.sagas.customerSaga(api).startWatchers(),
    notifications.sagas.notificationSagas(api).startWatchers(),
    // Version 2
    bookstand.sagas.bookstandSaga(api).startWatchers(),
    modalGroup.sagas.modalGroupSaga(api).startWatchers(),

    qualifications.sagas.qualificationSaga(api).startWatchers(),
    qualifications.sagas.qualificationUnitsSaga(api).startWatchers(),
    qualifications.sagas.qualificationMediaSaga(api).startWatchers(),

    news.sagas.newsSaga(api).startWatchers(),
    sectors.sagas.sectorsSaga(api).startWatchers(),
    store.sagas.storeSaga(api).startWatchers(),
    assessment.sagas.assessmentSaga(api).startWatchers(),
    dashboard.sagas.dashboardSaga(api).startWatchers(),
    finance.sagas.financeSaga(api).startWatchers(),
    pairing.sagas.pairingSaga(api).startWatchers(),
    userConflict.sagas.userConflictSaga(api).startWatchers()
  ]);
}
