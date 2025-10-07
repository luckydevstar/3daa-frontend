import Type from './type';

// Init actions
const attemptRealtimeConnection = (user, token) => ({
  type: Type.REALTIME_CONNECTION_ATTEMPT,
  user,
  token
});
const realtimeConnectionOnline = () => ({
  type: Type.REALTIME_CONNECTION_ONLINE
});
const realtimeConnectionOffline = () => ({
  type: Type.REALTIME_CONNECTION_OFFLINE
});

const initiatePusher = token => ({
  type: Type.INITIATE_PUSHER,
  token: { token }
});
/**
 Makes available all the action creators we've created.
 */
export default {
  attemptRealtimeConnection,
  realtimeConnectionOnline,
  realtimeConnectionOffline,
  initiatePusher,
};
