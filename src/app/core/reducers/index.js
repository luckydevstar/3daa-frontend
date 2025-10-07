import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { routerReducer as routing } from 'react-router-redux';
import notifications from 'react-redux-notify';
import Immutable from 'seamless-immutable';
import persisted from 'app/core/reducers/persisted-reducer';
import ui from 'app/core/reducers/ui-reducer';
import config from 'app/core/reducers/config-reducer';
import user from 'app/user';
import video from 'app/video';
import job from 'app/jobs';
import workbooks from 'app/workbooks';
import units from 'app/units';
// import workbooksBuilder from 'app/workbooks-builder';
import community from 'app/community';
import profile from 'app/profile';
import libraries from 'app/libraries';
import messaging from 'app/messaging';
import qualifications from 'app/qualifications';
import { Types } from 'app/core/actions';
import realtimeServices from 'app/realtime-services';
import interactions from 'app/notifications';
// Version 2
import bookstand from 'app/bookstand1';
import modalGroup from 'app/modal-group';
import exams from 'app/exams';
import customer from 'app/customer';
import dashboard from 'app/dashboard';
import news from 'app/news';
import sectors from 'app/sectors';
import store from 'app/store';
import assessment from 'app/assessment';
import finance from 'app/finance';
import pairing from 'app/pairing-wheel';
import userConflict from 'app/user-conflict';

// Root reducer
const appReducer = combineReducers({
  persisted,
  ui,
  config,
  form,
  routing,
  notifications,
  ...libraries.reducers,
  ...messaging.reducers,
  ...community.reducers,
  ...user.reducers,
  ...video.reducers,
  ...job.reducers,
  ...profile.reducers,
  ...workbooks.reducers,
  ...units.reducers,
  // ...workbooksBuilder.reducers,

  ...interactions.reducers,
  ...realtimeServices.reducers,
  // Version 2
  ...bookstand.reducers,
  ...modalGroup.reducers,
  ...exams.reducers,
  ...customer.reducers,
  ...dashboard.reducers,
  ...store.reducers,
  ...news.reducers,
  ...qualifications.reducers,
  ...sectors.reducers,
  ...assessment.reducers,
  ...finance.reducers,
  ...pairing.reducers,
  ...userConflict.reducers
});

// Root reducer that resets the entire state for logout
export default (state, action) => {
  if (action.type === Types.APP_LOGOUT) {
    const {
      routing: routingState,
      persisted: { lang }
    } = state;
    state = {
      routing: routingState,
      persisted: Immutable({ lang })
    };
  }
  return appReducer(state, action);
};

// OR put reducer keys that you DO want stored to persistence here (overrides blacklist)
export const persistentStoreWhitelist = ['persisted'];
