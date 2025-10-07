import React from 'react';
import {
  createNotification,
  NOTIFICATION_TYPE_SUCCESS,
  NOTIFICATION_TYPE_ERROR,
  NOTIFICATION_TYPE_WARNING
} from 'react-redux-notify';

const notifyOpts = { duration: 4000 };

export const notifySuccess = (message, opts = {}) =>
  createNotification({
    ...notifyOpts,
    type: NOTIFICATION_TYPE_SUCCESS,
    icon: <i className="fa fa-check" />,
    message,
    ...opts
  });

export const notifyError = (message, opts = {}) =>
  createNotification({
    ...notifyOpts,
    type: NOTIFICATION_TYPE_ERROR,
    icon: <i className="fa fa-cross" />,
    message,
    ...opts
  });

export const notifyWarn = (message, opts = {}) =>
  createNotification({
    ...notifyOpts,
    type: NOTIFICATION_TYPE_WARNING,
    icon: <i className="fa fa-exclamation" />,
    message,
    ...opts
  });

export default {
  notifySuccess,
  notifyError,
  notifyWarn
};
