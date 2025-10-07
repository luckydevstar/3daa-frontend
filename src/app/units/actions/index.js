import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  getUnitsAttempt: ['params'],
  getUnitsSuccess: ['response'],
  getUnitsFailure: ['errorCode'],

  getUnitAttempt: ['id'],
  getUnitSuccess: ['response'],
  getUnitFailure: ['errorCode'],

  postUnitsAttempt: ['unit'],
  postUnitsSuccess: ['response'],
  postUnitsFailure: ['errorCode'],

  putUnitsAttempt: ['unit'],
  putUnitsSuccess: ['response'],
  putUnitsFailure: ['errorCode'],

  deleteUnitsAttempt: ['id', 'params'],
  deleteUnitsSuccess: ['response', 'params'],
  deleteUnitsFailure: ['errorCode'],

  unitFilterChanged: ['newFilter']
});
