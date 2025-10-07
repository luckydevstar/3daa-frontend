import { createActions } from 'reduxsauce';

export const { Types, Creators } = createActions({
  authorActivitiesAttempt: [],
  authorActivitiesSuccess: ['activities'],
  authorActivitiesFailure: [],

  authorFilesAttempt: ['params'],
  authorFilesSuccess: ['files'],
  authorFilesFailure: ['authorFilesErrorCode'],

  authorFileUploadAttempt: ['params', 'filesParams'],
  authorFileUploadSuccess: [],
  authorFileUploadFailure: ['authorFileUploadErrorCode'],

  authorTasksAttempt: ['authorId', 'params'],
  authorTasksSuccess: ['authorTasks'],
  authorTasksFailure: ['authorTasksErrorCode'],

  authorTaskUpdateAttempt: ['authorId', 'params', 'memberId', 'taskId'],
  authorTaskUpdateSuccess: ['task'],
  authorTaskUpdateFailure: ['authorTasksErrorCode'],

  authorTaskCreateAttempt: ['authorId', 'params', 'memberId'],
  authorTaskCreateSuccess: ['task'],
  authorTaskCreateFailure: ['authorTasksErrorCode'],

  communityFriendSearchAttempt: ['params'],
  communityFriendSearchSuccess: ['potentialFriends'],
  communityFriendSearchFailure: ['errorCode'],
  communityGroupMemberSearchAttempt: ['params'],
  communityGroupMemberSearchSuccess: [
    'potentialGroupMembers',
    'potentialGroupSeats'
  ],
  communityGroupMemberSearchFailure: ['errorCode'],

  communityGroupUpdateAttempt: ['groupID', 'params'],
  communityGroupUpdateSuccess: [],
  communityGroupUpdateFailure: ['errorCodeSavingGroup'],
  communityGroupDeleteAttempt: ['groupID'],
  communityGroupDeleteSuccess: [],
  communityGroupDeleteFailure: ['errorCodeDeletingGroup'],
  communityGroupChangeFilterType: ['groupFilterType'],
  communityGroupSuccess: ['group'],
  communityUsersAttemptOldApi: ['userType', 'params'],
  communityUsersAttempt: ['userType', 'params', 'viewSeenByRole'],
  communityUsersSuccess: ['users', 'usersTotal'],
  communityUsersFailure: ['errorCode'],

  getCommunityUsersAwaitingAttempt: ['params'],
  getCommunityUsersAwaitingSuccess: ['users', 'usersTotal'],
  getCommunityUsersAwaitingFailure: ['error'],

  communityGetAllCentresAttempt: ['params', 'userRole'],
  communityGetAllCentresSuccess: ['data'],
  communityGetAllCentresFailure: ['errorCode'],

  communityPostAdminInviteAttempt: ['params'],
  communityPostCentreInviteAttempt: ['params'],
  communityPostMemberInviteAttempt: ['params'],
  communityPostInviteSuccess: null,
  communityPostInviteFailure: ['errorCode'],

  communityUpdateSortSettings: ['sortProp', 'sortOrder'],
  friendRequestAttempt: ['friendId'],
  friendRequestSuccess: [],
  friendRequestFailure: ['errorCode'],
  friendRequestsAttempt: ['friendsIds'],
  friendRequestsSuccess: [],
  friendRequestsFailure: ['errorCode'],
  manageConnectionAttempt: ['connection', 'action'],
  manageConnectionSuccess: ['connection', 'action'],
  manageConnectionFailure: ['error', 'connection', 'action'],
  searchConnectionsAttempt: ['search'],
  searchConnectionsSuccess: ['connections'],
  searchConnectionsFailure: ['error'],
  getInvitesAttempt: [],
  getInvitesSuccess: ['pending'],
  getInvitesFailure: ['error'],

  deleteMemberAttempt: ['member_id'],
  deleteMemberSuccess: [],
  deleteMemberFailure: [],

  deleteMemberFromGroupAttempt: ['groupID', 'member_id'],
  deleteMemberFromGroupSuccess: [],
  deleteMemberFromGroupFailure: [],

  suspendMemberAttempt: ['member_id'],
  suspendMemberSuccess: [],
  suspendMemberFailure: [],
  getCentreGroupAttempt: ['groupID'],
  getCentreGroupSuccess: ['groups'],
  getCentreGroupFailure: ['error'],
  assignEqaAttempt: ['member_id', 'centre_id', 'params'],
  assignEqaSuccess: [],
  assignEqaFailure: [],
  getCentreGroupDetailSuccess: ['groupDetail'],

  searchGroupMembersAttempt: ['params'],
  searchGroupMembersSuccess: ['members', 'centre_id'],
  searchGroupMembersFailure: ['errorCode'],

  communityGroupCreateAttempt: ['params'],
  communityGroupCreateSuccess: ['group'],
  communityGroupCreateFailure: ['errorCodeSavingGroup'],

  createCentreAttempt: ['params'],
  createCentreSuccess: ['centre'],
  createCentreFailure: ['errorCode'],

  communityGetGroupAttempt: ['centre_id', 'group_id'],
  communityGetGroupSuccess: ['group'],
  communityGetGroupFailure: ['errorCode'],

  clearCommunityGroupEdit: [],

  createGroupChatAttempt: ['centre_id', 'group_id'],
  createGroupChatSuccess: ['group'],
  createGroupChatFailure: [],

  searchQualificationsAttempt: ['params'],
  searchQualificationsSuccess: ['data'],
  searchQualificationsFailure: ['error'],

  selectQualification: ['qualification'],
  selectReportStatus: ['reportStatus'],
  selectAllQualifications: [],

  selectCentre: ['centre'],

  generateExportManagerReportAttempt: ['centre_id', 'params'],
  generateExportManagerReportSuccess: ['csvData', 'createdDate'],
  generateExportManagerReportFailure: ['error'],

  getAdminCentresAttempt: ['params'],
  getAdminCentresFailure: [],
  getAdminCentresSuccess: ['centres'],

  inviteCentreMemberAttempt: ['params'],
  inviteCentreMemberFailure: [],
  inviteCentreMemberSuccess: [],

  getEqaMemberAttempt: ['member_id'],
  getEqaMemberSuccess: ['member'],
  getEqaMemberFailure: []
});
