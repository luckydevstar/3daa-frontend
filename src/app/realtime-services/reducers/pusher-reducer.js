import Type from '../actions/type';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';

export const INITIAL_STATE = Immutable({
  online: false
});

const realtimeConnectionOnline = state =>
  state.merge({
    online: true
  });

const realtimeConnectionOffline = state =>
  state.merge({
    online: false
  });

const ACTION_HANDLERS = {
  [Type.REALTIME_CONNECTION_ONLINE]: realtimeConnectionOnline,
  [Type.REALTIME_CONNECTION_OFFLINE]: realtimeConnectionOffline
};

export default createReducer(INITIAL_STATE, ACTION_HANDLERS);
