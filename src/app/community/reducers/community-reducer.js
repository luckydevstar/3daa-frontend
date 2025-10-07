import { Types } from '../actions';
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import * as lodash from 'lodash';
import { prop, head } from 'ramda';

export const INITIAL_STATE = Immutable({
  users: null,
  potentialFriends: null,
  potentialGroupMembers: [],
  potentialGroupSeats: [],
  searchingGroupMembers: false,
  savingGroup: false,
  group: null,
  groupToEdit: null,
  groupToEditAttempting: false,
  groupFilterType: 'members',
  errorCode: null,
  errorCodeCentres: null,
  errorCodeInvite: null,
  errorCodeRequest: null,
  errorSavingGroup: null,
  deletingMember: null,
  deletingMemberFromGroup: null,
  gettingUsers: false,

  getAllCentres: false,
  centres: [],

  centresSearch: [],
  centresSearchLoading: false,

  inviteCentreMemberLoading: false,
  inviteCentreMemberSuccess: false,

  assigningEQA: false,
  assignEQAStatus: true,
  attemptingInvite: false,
  sendingRequest: false,
  friendRequests: [],
  centreGroups: [],
  centreGroupDetails: [],
  groupUsers: [],

  attemptionAuthorTasks: false,
  communityAuthorTasks: [],
  authorTasksErrorCode: null,
  attemptingAuthorFileUpload: false,
  attemptingAuthorFiles: false,
  authorFiles: [],
  activities: [],
  attemptingActivities: false,
  attemptingAwaitingUsersGet: false,
  attemptingGroupUsers: false,
  attemptingCreateGroup: false,
  attemptingCreateGroupChat: false,

  eqaMemberLoading: false,
  eqaMember: null,

  sorting: {
    config: {
      approved: {
        name: 'approved',
        sortOrder: null,
        active: false,
        sortable: true
      },
      completed: {
        name: 'completed',
        sortOrder: null,
        active: false,
        sortable: true
      },
      screen_name: {
        name: 'profile_name',
        sortOrder: null,
        active: false,
        sortable: true
      },
      sector: {
        name: 'Sector',
        sortOrder: null,
        active: false,
        sortable: true
      },
      qualification: {
        name: 'qualification',
        sortOrder: null,
        active: false,
        sortable: true
      },
      preferences: {
        name: 'preferences',
        sortOrder: null,
        active: false,
        sortable: true
      },
      learners: {
        name: 'learners',
        sortOrder: null,
        active: false,
        sortable: true
      },
      groups: {
        name: 'groups',
        sortOrder: null,
        active: false,
        sortable: true
      },
      progress_percentage: {
        name: 'progress',
        sortOrder: null,
        active: false,
        sortable: true
      },
      actions: {
        name: 'actions',
        sortable: false
      },
      status: {
        name: 'status',
        sortOrder: null,
        active: false,
        sortable: true
      }
    },
    activeProp: null
  }
});

// Community users
const getCommunityUsersAttempt = (state, { params }) =>
  state.merge({
    errorCode: null,
    attemptingUsersGet: true,
    usersTotal: null,
    // Dont clear the group if there exists an ID in the params,
    // it's an internal group action
    ...((!params || !params.groupID) && { group: null })
  });

const getCommunityUsersSuccess = (state, { users, usersTotal }) =>
  state.merge({
    errorCode: null,
    attemptingUsersGet: false,
    users,
    usersTotal
  });

const getCommunityUsersFailure = (state, { errorCode }) =>
  state.merge({
    attemptingUsersGet: false,
    errorCode,
    users: [],
    usersTotal: 0
  });

const communityUpdateSortSettings = (state, { sortProp, sortOrder }) => {
  const { sorting } = state;

  const newSorting = sorting.asMutable({ deep: true });

  const { config } = newSorting;

  const propConfig = config[sortProp];

  const resetActive = obj => {
    Object.keys(obj).forEach(key => {
      const el = obj[key];
      if (el.active === true) {
        el.active = false;
        el.sortOrder = null;
      }
    });
  };

  resetActive(config);

  propConfig.sortOrder = sortOrder;
  propConfig.active = true;

  newSorting.activeProp = sortProp;

  return state.merge({
    sorting: newSorting
  });
};

const getCommunityGroupSuccess = (state, { group }) =>
  state.merge({
    group
  });

// Get All Centres
const getAllCentresAttempt = state =>
  state.merge({ getAllCentres: true, centres: [], errorCodeCentres: null });
const getAllCentresSuccess = (state, action) => {
  const centres = lodash.get(action, 'data.data', []); // if user is Admin it is an array of centres, if user is Centre it's a Centre data
  return state.merge({
    getAllCentres: false,
    centres: centres.centres || centres
  });
};
const getAllCentresFailure = (state, { errorCode }) =>
  state.merge({ attemptingInvite: false, errorCodeCentres: errorCode });

// Community registration invites
const postCommunityAdminInviteAttempt = state =>
  state.merge({ attemptingInvite: true, errorCodeInvite: null });
const postCommunityCentreInviteAttempt = state =>
  state.merge({ attemptingInvite: true, errorCodeInvite: null });
const postCommunityMemberInviteAttempt = state =>
  state.merge({ attemptingInvite: true, errorCodeInvite: null });

const postCommunityInviteSuccess = state =>
  state.merge({ attemptingInvite: false });

const postCommunityInviteFailure = (state, { errorCode }) =>
  state.merge({ attemptingInvite: false, errorCodeInvite: errorCode });

// Potential group member search
const getCommunityGroupMemberSearchAttempt = state =>
  state.merge({ searchingGroupMembers: true });

const getCommunityGroupMemberSearchSuccess = (
  state,
  { potentialGroupMembers, potentialGroupSeats }
) =>
  state.merge({
    potentialGroupMembers,
    potentialGroupSeats,
    searchingGroupMembers: false
  });

const getCommunityGroupMemberSearchFailure = state =>
  state.merge({
    potentialGroupMembers: [],
    searchingGroupMembers: false
  });

// Group saving/updating
const saveCommunityGroupAttempt = state =>
  state.merge({ savingGroup: true, errorCodeSavingGroup: null });

const saveCommunityGroupSuccess = state =>
  state.merge({
    savingGroup: false
  });

const saveCommunityGroupFailure = (state, { errorCodeSavingGroup }) =>
  state.merge({
    savingGroup: false,
    errorCodeSavingGroup
  });

// Group deletion
const deleteCommunityGroupAttempt = state =>
  state.merge({ deletingGroup: true, errorCodeDeletingGroup: null });

const deleteCommunityGroupSuccess = state =>
  state.merge({
    deletingGroup: false
  });

const deleteCommunityGroupFailure = (state, { errorCodeDeletingGroup }) =>
  state.merge({
    deletingGroup: false,
    errorCodeDeletingGroup
  });

// Community friend invites
const getCommunityFriendSearchAttempt = state =>
  state.merge({ potentialFriends: null });

const getCommunityFriendSearchSuccess = (state, { potentialFriends }) =>
  state.merge({
    potentialFriends
  });

const getCommunityFriendSearchFailure = state =>
  state.merge({
    potentialFriends: []
  });

// Community friend request
const friendRequestAttempt = state =>
  state.merge({ sendingRequest: true, errorCodeRequest: null });

const friendRequestSuccess = state =>
  state.merge({
    sendingRequest: false,
    errorCodeRequest: null
  });

const friendRequestFailure = (state, { errorCodeRequest }) =>
  state.merge({
    sendingRequest: false,
    errorCodeRequest
  });

// Community friend requestS
const friendRequestsAttempt = state =>
  state.merge({ sendingRequest: true, errorCodeRequest: null });

const friendRequestsSuccess = state =>
  state.merge({
    sendingRequest: false,
    errorCodeRequest: null
  });

const friendRequestsFailure = (state, { errorCodeRequest }) =>
  state.merge({
    sendingRequest: false,
    errorCodeRequest
  });

const getInvitesAttempt = state =>
  state.merge({
    gettingInvites: true
  });

const getInvitesSuccess = (state, { pending }) =>
  state.merge({
    friendRequests: pending,
    gettingInvites: false
  });

const deleteMemberAttempt = state =>
  state.merge({
    deletingMember: true
  });

const deleteMemberSuccess = state =>
  state.merge({
    deletingMember: null
  });

const deleteMemberFailure = state =>
  state.merge({
    deletingMember: false
  });

const deleteMemberFromGroupAttempt = state =>
  state.merge({
    deletingMemberFromGroup: true
  });

const deleteMemberFromGroupSuccess = state =>
  state.merge({
    deletingMemberFromGroup: null
  });

const deleteMemberFromGroupFailure = state =>
  state.merge({
    deletingMemberFromGroup: false
  });

const suspendMemberAttempt = state =>
  state.merge({
    suspendingMember: true
  });

const suspendMemberSuccess = state =>
  state.merge({
    suspendingMember: null
  });

const suspendMemberFailure = state =>
  state.merge({
    suspendingMember: false
  });

const assignEqaAttempt = state =>
  state.merge({
    assigningEQA: true
  });

const assignEqaSuccess = state =>
  state.merge({
    assigningEQA: false,
    assignEQAStatus: true
  });

const assignEqaFailure = state =>
  state.merge({
    assigningEQA: false,
    assignEQAStatus: false
  });

const changeGroupFilterType = (state, { groupFilterType }) =>
  state.merge({
    groupFilterType
  });

const getCentreGroupAttempt = state => state.merge({});

const getCentreGroupSuccess = (state, { groups }) =>
  state.merge({
    centreGroups: groups,
    centreGroupDetails: [] // Init
  });

const getCentreGroupFailure = state => state.merge({});

const getCentreGroupDetailSuccess = (state, { groupDetail }) => {
  let centreGroupDetails = state.centreGroupDetails.concat(groupDetail);
  return state.merge({
    centreGroupDetails
  });
};

const getAuthorTasksAttempt = state => {
  return state.merge({
    attemptionAuthorTasks: true,
    communityAuthorTasks: [],
    authorTasksErrorCode: null
  });
};

const getAuthorTasksSuccess = (state, { authorTasks }) => {
  return state.merge({
    attemptionAuthorTasks: false,
    communityAuthorTasks: authorTasks
  });
};

const getAuthorTasksFailure = (state, { authorTasksErrorCode }) => {
  return state.merge({
    attemptionAuthorTasks: false,
    authorTasksErrorCode
  });
};

const createAuthorTaskAttempt = state => {
  return state.merge({
    attemptionAuthorTasks: true,
    authorTasksErrorCode: null
  });
};

const createAuthorTaskSuccess = state => {
  return state.merge({
    attemptionAuthorTasks: false,
    authorTasksErrorCode: null
  });
};

const createAuthorTaskFailure = (state, { authorTasksErrorCode }) => {
  return state.merge({
    attemptionAuthorTasks: false,
    authorTasksErrorCode
  });
};

const updateAuthorTaskAttempt = state => {
  return state.merge({
    attemptionAuthorTasks: true,
    authorTasksErrorCode: null
  });
};

const updateAuthorTaskSuccess = state => {
  return state.merge({
    attemptionAuthorTasks: false,
    authorTasksErrorCode: null
  });
};

const updateAuthorTaskFailure = (state, { authorTasksErrorCode }) => {
  return state.merge({
    attemptionAuthorTasks: false,
    authorTasksErrorCode
  });
};

const uploadAuthorFileAttempt = state =>
  state.merge({ attemptingAuthorFileUpload: true });

const uploadAuthorFileSuccess = state =>
  state.merge({ attemptingAuthorFileUpload: false });

const uploadAuthorFileFailure = state =>
  state.merge({ attemptingAuthorFileUpload: false });

const getAuthorFilesAttempt = state => {
  return state.merge({
    attemptingAuthorFiles: true
  });
};

const getAuthorFilesSuccess = (state, { files }) => {
  return state.merge({
    attemptingAuthorFiles: false,
    authorFiles: files
  });
};

const getAuthorFilesFailure = state => {
  return state.merge({
    attemptingAuthorFiles: false
  });
};

const getAuthorActivitiesAttempt = state =>
  state.merge({
    attemptingActivities: true
  });

const getAuthorActivitiesSuccess = (state, { activities }) =>
  state.merge({
    attemptingActivities: false,
    activities
  });

const getAuthorActivitiesFailure = state =>
  state.merge({
    attemptingActivities: false
  });

const getCommunityUsersAwaitingAttempt = state =>
  state.merge({
    errorCode: null,
    usersTotal: null,
    attemptingUsersGet: true,
    attemptingAwaitingUsersGet: true
  });

const getCommunityUsersAwaitingSuccess = (state, { users, usersTotal }) =>
  state.merge({
    errorCode: null,
    attemptingUsersGet: false,
    attemptingAwaitingUsersGet: false,
    users,
    usersTotal
  });

const getCommunityUsersAwaitingFailure = (state, { err }) =>
  state.merge({
    attemptingUsersGet: false,
    attemptingAwaitingUsersGet: false,
    errorCode: err,
    users: [],
    usersTotal: 0
  });

const searchGroupMembersAttempt = state =>
  state.merge({
    attemptingGroupUsers: true
  });

const searchGroupMembersSuccess = (state, { members, centre_id }) =>
  state.merge({
    attemptingGroupUsers: false,
    groupUsers: members
  });

const searchGroupMembersFailure = state =>
  state.merge({
    attemptingGroupUsers: false
  });

const communityGroupCreateAttempt = state =>
  state.merge({
    attemptingCreateGroup: true
  });

const communityGroupCreateSuccess = (state, { group }) =>
  state.merge({
    attemptingCreateGroup: false,
    users: [...state.users, group]
  });

const communityGroupCreateFailure = state =>
  state.merge({
    attemptingCreateGroup: false
  });

const createCentreAttempt = state =>
  state.merge({
    attemptingInvite: true
  });

const createCentreSuccess = (state, { centre }) =>
  state.merge({
    attemptingInvite: false,
    users: [centre, ...state.users]
  });

const createCentreFailure = state =>
  state.merge({
    attemptingInvite: false
  });

const communityGetGroupAttempt = state =>
  state.merge({
    groupToEdit: null,
    groupToEditAttempting: true
  });

const communityGetGroupSuccess = (state, { group }) =>
  state.merge({
    groupToEdit: group,
    groupToEditAttempting: false
  });

const communityGetGroupFailure = state =>
  state.merge({
    groupToEditAttempting: false
  });

const clearCommunityGroupEdit = state =>
  state.merge({
    groupToEdit: null,
    groupToEditAttempting: null
  });

const createGroupChatAttempt = state =>
  state.merge({
    attemptingCreateGroupChat: true
  });

const createGroupChatSuccess = state =>
  state.merge({
    attemptingCreateGroupChat: false
  });

const createGroupChatFailure = state =>
  state.merge({
    attemptingCreateGroupChat: false
  });

const getAdminCentresAttempt = state =>
  state.merge({
    centresSearchLoading: true
  });

const getAdminCentresFailure = state =>
  state.merge({
    centresSearchLoading: false
  });

const getAdminCentresSuccess = (state, { centres }) =>
  state.merge({
    centresSearchLoading: false,
    centresSearch: centres
  });

const inviteCentreMemberAttempt = state =>
  state.merge({
    inviteCentreMemberLoading: true
  });

const inviteCentreMemberSuccess = state =>
  state.merge({
    inviteCentreMemberLoading: false,
    inviteCentreMemberSuccess: true
  });

const inviteCentreMemberFailure = state =>
  state.merge({
    inviteCentreMemberLoading: false,
    inviteCentreMemberSuccess: false
  });

const getEqaMemberAttempt = state =>
  state.merge({
    eqaMemberLoading: true
  });

const getEqaMemberSuccess = (state, { member }) =>
  state.merge({
    eqaMemberLoading: false,
    eqaMember: member
  });

const getEqaMemberFailure = state =>
  state.merge({
    eqaMemberLoading: false,
    eqaMember: null
  });

export default createReducer(INITIAL_STATE, {
  [Types.AUTHOR_ACTIVITIES_ATTEMPT]: getAuthorActivitiesAttempt,
  [Types.AUTHOR_ACTIVITIES_SUCCESS]: getAuthorActivitiesSuccess,
  [Types.AUTHOR_ACTIVITIES_FAILURE]: getAuthorActivitiesFailure,

  [Types.AUTHOR_FILES_ATTEMPT]: getAuthorFilesAttempt,
  [Types.AUTHOR_FILES_SUCCESS]: getAuthorFilesSuccess,
  [Types.AUTHOR_FILES_FAILURE]: getAuthorFilesFailure,

  [Types.AUTHOR_FILE_UPLOAD_ATTEMPT]: uploadAuthorFileAttempt,
  [Types.AUTHOR_FILE_UPLOAD_SUCCESS]: uploadAuthorFileSuccess,
  [Types.AUTHOR_FILE_UPLOAD_FAILURE]: uploadAuthorFileFailure,

  [Types.AUTHOR_TASKS_ATTEMPT]: getAuthorTasksAttempt,
  [Types.AUTHOR_TASKS_SUCCESS]: getAuthorTasksSuccess,
  [Types.AUTHOR_TASKS_FAILURE]: getAuthorTasksFailure,

  [Types.AUTHOR_TASK_UPDATE_ATTEMPT]: updateAuthorTaskAttempt,
  [Types.AUTHOR_TASK_UPDATE_SUCCESS]: updateAuthorTaskSuccess,
  [Types.AUTHOR_TASK_UPDATE_FAILURE]: updateAuthorTaskFailure,

  [Types.AUTHOR_TASK_CREATE_ATTEMPT]: createAuthorTaskAttempt,
  [Types.AUTHOR_TASK_CREATE_SUCCESS]: createAuthorTaskSuccess,
  [Types.AUTHOR_TASK_CREATE_FAILURE]: createAuthorTaskFailure,

  [Types.COMMUNITY_USERS_ATTEMPT]: getCommunityUsersAttempt,
  [Types.COMMUNITY_USERS_ATTEMPT_OLD_API]: getCommunityUsersAttempt,
  [Types.COMMUNITY_USERS_SUCCESS]: getCommunityUsersSuccess,
  [Types.COMMUNITY_USERS_FAILURE]: getCommunityUsersFailure,
  [Types.COMMUNITY_GROUP_SUCCESS]: getCommunityGroupSuccess,
  [Types.COMMUNITY_GROUP_CHANGE_FILTER_TYPE]: changeGroupFilterType,

  [Types.COMMUNITY_GET_ALL_CENTRES_ATTEMPT]: getAllCentresAttempt,
  [Types.COMMUNITY_GET_ALL_CENTRES_SUCCESS]: getAllCentresSuccess,
  [Types.COMMUNITY_GET_ALL_CENTRES_FAILURE]: getAllCentresFailure,

  [Types.COMMUNITY_POST_ADMIN_INVITE_ATTEMPT]: postCommunityAdminInviteAttempt,
  [Types.COMMUNITY_POST_CENTRE_INVITE_ATTEMPT]: postCommunityCentreInviteAttempt,
  [Types.COMMUNITY_POST_MEMBER_INVITE_ATTEMPT]: postCommunityMemberInviteAttempt,
  [Types.COMMUNITY_POST_INVITE_SUCCESS]: postCommunityInviteSuccess,
  [Types.COMMUNITY_POST_INVITE_FAILURE]: postCommunityInviteFailure,

  [Types.COMMUNITY_UPDATE_SORT_SETTINGS]: communityUpdateSortSettings,

  [Types.COMMUNITY_FRIEND_SEARCH_ATTEMPT]: getCommunityFriendSearchAttempt,
  [Types.COMMUNITY_FRIEND_SEARCH_SUCCESS]: getCommunityFriendSearchSuccess,
  [Types.COMMUNITY_FRIEND_SEARCH_FAILURE]: getCommunityFriendSearchFailure,
  [Types.COMMUNITY_GROUP_MEMBER_SEARCH_ATTEMPT]: getCommunityGroupMemberSearchAttempt,
  [Types.COMMUNITY_GROUP_MEMBER_SEARCH_SUCCESS]: getCommunityGroupMemberSearchSuccess,
  [Types.COMMUNITY_GROUP_MEMBER_SEARCH_FAILURE]: getCommunityGroupMemberSearchFailure,
  [Types.COMMUNITY_GROUP_CREATE_ATTEMPT]: saveCommunityGroupAttempt,
  [Types.COMMUNITY_GROUP_CREATE_SUCCESS]: saveCommunityGroupSuccess,
  [Types.COMMUNITY_GROUP_CREATE_FAILURE]: saveCommunityGroupFailure,
  [Types.COMMUNITY_GROUP_UPDATE_ATTEMPT]: saveCommunityGroupAttempt,
  [Types.COMMUNITY_GROUP_UPDATE_SUCCESS]: saveCommunityGroupSuccess,
  [Types.COMMUNITY_GROUP_UPDATE_FAILURE]: saveCommunityGroupFailure,
  [Types.COMMUNITY_GROUP_DELETE_ATTEMPT]: deleteCommunityGroupAttempt,
  [Types.COMMUNITY_GROUP_DELETE_SUCCESS]: deleteCommunityGroupSuccess,
  [Types.COMMUNITY_GROUP_DELETE_FAILURE]: deleteCommunityGroupFailure,
  [Types.FRIEND_REQUEST_ATTEMPT]: friendRequestAttempt,
  [Types.FRIEND_REQUEST_SUCCESS]: friendRequestSuccess,
  [Types.FRIEND_REQUEST_FAILURE]: friendRequestFailure,
  [Types.FRIEND_REQUESTS_ATTEMPT]: friendRequestsAttempt,
  [Types.FRIEND_REQUESTS_SUCCESS]: friendRequestsSuccess,
  [Types.FRIEND_REQUESTS_FAILURE]: friendRequestsFailure,
  [Types.GET_INVITES_ATTEMPT]: getInvitesAttempt,
  [Types.GET_INVITES_SUCCESS]: getInvitesSuccess,
  [Types.DELETE_MEMBER_ATTEMPT]: deleteMemberAttempt,
  [Types.DELETE_MEMBER_SUCCESS]: deleteMemberSuccess,
  [Types.DELETE_MEMBER_FAILURE]: deleteMemberFailure,

  [Types.DELETE_MEMBER_FROM_GROUP_ATTEMPT]: deleteMemberFromGroupAttempt,
  [Types.DELETE_MEMBER_FROM_GROUP_SUCCESS]: deleteMemberFromGroupSuccess,
  [Types.DELETE_MEMBER_FROM_GROUP_FAILURE]: deleteMemberFromGroupFailure,

  [Types.SUSPEND_MEMBER_ATTEMPT]: suspendMemberAttempt,
  [Types.SUSPEND_MEMBER_SUCCESS]: suspendMemberSuccess,
  [Types.SUSPEND_MEMBER_FAILURE]: suspendMemberFailure,
  [Types.GET_CENTRE_GROUP_ATTEMPT]: getCentreGroupAttempt,
  [Types.GET_CENTRE_GROUP_SUCCESS]: getCentreGroupSuccess,
  [Types.GET_CENTRE_GROUP_FAILURE]: getCentreGroupFailure,
  [Types.ASSIGN_EQA_ATTEMPT]: assignEqaAttempt,
  [Types.ASSIGN_EQA_SUCCESS]: assignEqaSuccess,
  [Types.ASSIGN_EQA_FAILURE]: assignEqaFailure,
  [Types.GET_CENTRE_GROUP_DETAIL_SUCCESS]: getCentreGroupDetailSuccess,

  [Types.GET_COMMUNITY_USERS_AWAITING_ATTEMPT]: getCommunityUsersAwaitingAttempt,
  [Types.GET_COMMUNITY_USERS_AWAITING_SUCCESS]: getCommunityUsersAwaitingSuccess,
  [Types.GET_COMMUNITY_USERS_AWAITING_FAILURE]: getCommunityUsersAwaitingFailure,

  [Types.SEARCH_GROUP_MEMBERS_ATTEMPT]: searchGroupMembersAttempt,
  [Types.SEARCH_GROUP_MEMBERS_SUCCESS]: searchGroupMembersSuccess,
  [Types.SEARCH_GROUP_MEMBERS_FAILURE]: searchGroupMembersFailure,

  [Types.COMMUNITY_GROUP_CREATE_ATTEMPT]: communityGroupCreateAttempt,
  [Types.COMMUNITY_GROUP_CREATE_SUCCESS]: communityGroupCreateSuccess,
  [Types.COMMUNITY_GROUP_CREATE_FAILURE]: communityGroupCreateFailure,

  [Types.CREATE_CENTRE_ATTEMPT]: createCentreAttempt,
  [Types.CREATE_CENTRE_SUCCESS]: createCentreSuccess,
  [Types.CREATE_CENTRE_FAILURE]: createCentreFailure,

  [Types.COMMUNITY_GET_GROUP_ATTEMPT]: communityGetGroupAttempt,
  [Types.COMMUNITY_GET_GROUP_SUCCESS]: communityGetGroupSuccess,
  [Types.COMMUNITY_GET_GROUP_FAILURE]: communityGetGroupFailure,

  [Types.CLEAR_COMMUNITY_GROUP_EDIT]: clearCommunityGroupEdit,

  [Types.CREATE_GROUP_CHAT_ATTEMPT]: createGroupChatAttempt,
  [Types.CREATE_GROUP_CHAT_SUCCESS]: createGroupChatSuccess,
  [Types.CREATE_GROUP_CHAT_FAILURE]: createGroupChatFailure,

  [Types.GET_ADMIN_CENTRES_ATTEMPT]: getAdminCentresAttempt,
  [Types.GET_ADMIN_CENTRES_FAILURE]: getAdminCentresFailure,
  [Types.GET_ADMIN_CENTRES_SUCCESS]: getAdminCentresSuccess,

  [Types.INVITE_CENTRE_MEMBER_ATTEMPT]: inviteCentreMemberAttempt,
  [Types.INVITE_CENTRE_MEMBER_FAILURE]: inviteCentreMemberFailure,
  [Types.INVITE_CENTRE_MEMBER_SUCCESS]: inviteCentreMemberSuccess,

  [Types.GET_EQA_MEMBER_ATTEMPT]: getEqaMemberAttempt,
  [Types.GET_EQA_MEMBER_SUCCESS]: getEqaMemberSuccess,
  [Types.GET_EQA_MEMBER_FAILURE]: getEqaMemberFailure
});
