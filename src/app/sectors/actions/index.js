import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  getSectorsAttempt: null,
  getSectorsSuccess: ['sectors'],
  getSectorsFailure: ['errorCode'],

  getSectorAttempt: null,
  getSectorSuccess: ['sector'],
  getSectorFailure: ['errorCode'],

  createSectorAttempt: ['params'],
  createSectorSuccess: ['response'],
  createSectorFailure: ['errorCode'],

  updateSectorAttempt: ['params', 'id'],
  updateSectorSuccess: ['response', 'id'],
  updateSectorFailure: ['errorCode'],

  deleteSectorAttempt: ['id'],
  deleteSectorSuccess: ['id'],
  deleteSectorFailure: ['errorCode']
});
