/* global __DEV__, document, __TEST__, window */
import { setPusherClient } from 'react-pusher';
import Pusher from 'pusher-js';
import ENDPOINT from '../config/endpoints';
import config from 'brand/config';

let baseURL = ENDPOINT.API_URL_PROD;

// Define base URL
if (__DEV__) {
  baseURL = ENDPOINT.API_URL_DEV;
} else if (__TEST__) {
  baseURL = ENDPOINT.API_URL_TEST;
} else if (__STAGING__) {
  baseURL = ENDPOINT.API_URL_STAGING;
}

const pusherFactory = token => {
  setPusherClient(
    new Pusher(config.PUSHER_APP_ID, {
      cluster: 'eu',
      encrypted: true,
      authEndpoint: `${baseURL}/chat/subscribe`,
      auth: {
        headers: {
          'X-Auth': token
        }
      }
    })
  );
};

export default pusherFactory;
