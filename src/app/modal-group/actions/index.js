import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  searchForGroupMembersAttempt: ['searchTerm', 'userType', 'qualificationId'],
  searchForGroupMembersSuccess: ['members'],
  searchForGroupMembersFailure: [],
  saveGroupAttempt: ['payload'],
  saveGroupSuccess: [],
  saveGroupFailure: [],
  getGroupQualificationsAttempt: [],
  getGroupQualificationsSuccess: ['qualifications'],
  getGroupQualificationsFailure: [],
  setShowSelected: ['flag'],
  setCloseModal: ['flag'],
  resetGroupModalSearch: []
});
