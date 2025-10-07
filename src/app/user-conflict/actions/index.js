import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  getUserConflictListAttempt: ['params'],
  getUserConflictListSuccess: ['users', 'usersTotal'],
  getUserConflictListFailure: ['error'],

  updateUserConflictEmailAttempt: ['params', 'member_id'],
  updateUserConflictEmailSuccess: [],
  updateUserConflictEmailFailure: ['error'],

  deleteUserConflictAttempt: ['member_id'],
  deleteUserConflictSuccess: [],
  deleteUserConflictFailure: ['error'],

  closeUserConclictUpdateEmailModal: []
});
