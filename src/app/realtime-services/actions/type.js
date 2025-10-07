// A list of all actions in the system.
import { createTypes } from 'reduxsauce';

export default createTypes(
  `
  REALTIME_CONNECTION_ATTEMPT
  REALTIME_CONNECTION_ONLINE
  REALTIME_CONNECTION_OFFLINE
  INITIATE_PUSHER
`
);
