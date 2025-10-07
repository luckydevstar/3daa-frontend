/* eslint-disable no-restricted-syntax, no-prototype-builtins */
import React from 'react';
import { takeLatest, takeEvery, put, call, select } from 'redux-saga/effects';
import { path, head, compose, prop, length, contains, dissoc } from 'ramda';
import { browserHistory } from 'react-router';
import { Types, Creators } from '../actions';
import { Creators as MessagingActions } from 'app/messaging/actions';
import { Roles } from 'app/core/config/constants';
import UserRole from 'app/user/enums/user-role';
import common from 'app/common';
import { translate, translatef } from 'app/intl';
import config from 'brand/config';

const {
  helpers: { checkResponse, convertToFormData },
  notify: { notifySuccess, notifyError },
  sagaSelectors: { getUser }
} = common.util;

const { SuperAdmin, SiteAdmin, CentreEQA, CentreIQA, CentreAdmin } = Roles;

export default api => {
  function* getCentreID() {
    const {
      profile: {
        user: { centres }
      }
    } = yield select();
    const id = compose(prop('centre_id'), head)(centres);
    // console.log('>>>>>>>>>>>');
    // console.log(id);
    return id;
  }

  function* communityAuthorActivities() {
    const res = yield call(api.getAuthorActivities);
    if (res.data.status === 'success') {
      yield put(Creators.authorActivitiesSuccess(res.data.data.activities));
    } else {
      yield put(Creators.authorActivitiesFailure());
    }
  }

  function* communityAuthorTasksAttempt(action) {
    const { authorId, params } = action;
    const response = yield call(api.getAuthorTasks, authorId, params);
    if (response.data.status === 'success') {
      yield put(Creators.authorTasksSuccess(response.data.data));
    } else {
      yield put(Creators.authorTasksFailure(response.data.message));
    }
  }

  function* communityAuthorTasksFailure({ authorTasksErrorCode }) {
    yield put(
      notifyError(yield translate(authorTasksErrorCode), {
        icon: <i className="fa fa-times" />
      })
    );
  }

  function* communityCreateAuthorTasksAttempt(action) {
    const { authorId, params, memberId } = action;
    const response = yield call(api.createAuthorTask, params);
    if (response.data.status === 'success') {
      yield put(Creators.authorTaskCreateSuccess());
      yield put(
        Creators.authorTasksAttempt(authorId, {
          member_id: memberId
        })
      );
    } else {
      yield put(Creators.authorTaskCreateFailure(response.data.message));
    }
  }

  function* communityCreateAuthorTasksFailure({ authorTasksErrorCode }) {
    yield put(
      notifyError(yield translate(authorTasksErrorCode), {
        icon: <i className="fa fa-times" />
      })
    );
  }

  function* communityUpdateAuthorTasksAttempt(action) {
    const { authorId, params, memberId, taskId } = action;
    const response = yield call(api.updateAuthorTask, params, taskId);
    if (response.data.status === 'success') {
      yield put(Creators.authorTaskUpdateSuccess());
      yield put(
        Creators.authorTasksAttempt(authorId, {
          member_id: memberId
        })
      );
    } else {
      yield put(Creators.authorTaskCreateFailure(response.data.message));
    }
  }

  function* communityAuthorFileUploadAttempt(action) {
    const { params, filesParams } = action;
    const response = yield call(api.uploadAuthorFile, params);
    if (response.data && response.data.status === 'success') {
      yield put(Creators.authorFilesAttempt(filesParams));
      yield put(Creators.authorFileUploadSuccess());
    } else {
      if (response.data && response.data.message) {
        yield put(Creators.authorFileUploadFailure(response.data.message));
      } else {
        yield put(Creators.authorFileUploadFailure('Unknown error'));
      }
    }
  }

  function* communityAuthorFileUploadFailure({ authorFileUploadErrorCode }) {
    yield put(
      notifyError(yield translate(authorFileUploadErrorCode), {
        icon: <i className="fa fa-times" />
      })
    );
  }

  function* communityAuthorFilesAttempt(action) {
    const { params } = action;
    const response = yield call(api.getAuthorFiles, params);
    if (response.data.status === 'success') {
      yield put(Creators.authorFilesSuccess(response.data.data));
    } else {
      yield put(Creators.authorFilesFailure(response.data.message));
    }
  }

  function* communityGetGroupAttempt({ centre_id, group_id }) {
    try {
      const resp = yield call(api.getCentreGroup, centre_id, group_id);
      const group = path(['data', 'data', 'group'], resp);

      yield checkResponse(resp);
      yield put(Creators.communityGetGroupSuccess(group));
    } catch (err) {
      console.log(err);
      yield put(Creators.communityGetGroupFailure());
    }
  }

  // TODO: remove 'unready' conditional
  function* communityUsersAttempt(action) {
    const { userType, params, viewSeenByRole } = action;
    const {
      community: { groupFilterType }
    } = yield select();

    const getFromAllCenters = contains(viewSeenByRole, [SiteAdmin, SuperAdmin]);

    try {
      let resp = {};
      let users = [];
      let total = null;

      // Basic centre users
      if (userType === 'centre') {
        if (getFromAllCenters) {
          if (params.selectedCentreID) {
            resp = yield call(
              api.getCentreCommunity,
              params.selectedCentreID,
              params
            );
          } else {
            resp = yield call(api.getAllMembers, params);
          }
          resp = yield checkResponse(resp);
          users = resp.data.members;
        } else if (
          contains(viewSeenByRole, [CentreAdmin]) &&
          params.selectedTutorID
        ) {
          resp = yield call(
            api.getCentreTutorMembers,
            yield getCentreID(),
            params.selectedTutorID,
            params
          );

          resp = yield checkResponse(resp);
          users = resp.data.learners;
        } else if (contains(viewSeenByRole, [CentreIQA])) {
          const {
            profile: {
              user: { roles }
            }
          } = yield select();

          const { member_id } = yield select(getUser);
          const newParams = {
            ...params,
            eqa_member: member_id,
            eqa_role: 'EQA_ROLE'
          };

          const isSuperAdmin = contains(UserRole.SUPER_ADMIN_ROLE, roles);
          if (isSuperAdmin) {
            resp = yield call(api.getAllMembers, newParams);
          } else {
            resp = yield call(
              api.getAllMembersV1,
              newParams,
              yield getCentreID()
            );
          }

          resp = yield checkResponse(resp);
          users = resp.data.members;
        } else if (contains(viewSeenByRole, [CentreEQA])) {
          const {
            profile: {
              user: { roles }
            }
          } = yield select();
          const { member_id } = yield select(getUser);
          const newParams = {
            ...params,
            eqa_member: member_id,
            eqa_role: 'EQA_ROLE'
          };

          const isSuperAdmin = contains(UserRole.SUPER_ADMIN_ROLE, roles);
          if (isSuperAdmin) {
            resp = yield call(api.getAllMembers, newParams);
          } else {
            resp = yield call(
              api.getAllMembersV1,
              newParams,
              yield getCentreID()
            );
          }

          resp = yield checkResponse(resp);
          users = resp.data.members;
        } else {
          resp = yield call(
            api.getCentreCommunity,
            yield getCentreID(),
            params
          );
          resp = yield checkResponse(resp);
          users = resp.data.members;
        }
      }

      // Empty centre seats
      if (userType === 'centreSeats') {
        resp = yield call(
          api.getCentreCommunitySeats,
          yield getCentreID(),
          params
        );
        resp = yield checkResponse(resp);
        users = resp.data.seats;
      }

      // Centre groups
      if (userType === 'groups') {
        const {
          profile: {
            user: { roles }
          }
        } = yield select();
        const isSuperAdmin = contains(UserRole.SUPER_ADMIN_ROLE, roles);
        if (isSuperAdmin) {
          resp = yield call(api.getGroups, params);
        } else {
          resp = yield call(api.getCentreGroups, yield getCentreID(), params);
        }
        resp = yield checkResponse(resp);
        users = resp.data.groups;
      }

      // Single centre group
      // When fetching a single group's details, we need to make 2 requests -
      // one with the community explorer params (offset, limit, search etc.)  and
      // one without any of that so that the group can be properly edited. In an ideal world
      // we would fetch the group once and then apply the params on the frontend.
      // Unfortunately this is not much of an option here.
      if (userType === 'group') {
        const { groupID } = params;
        resp = yield call(
          api.getCentreGroup,
          yield getCentreID(),
          groupID,
          dissoc('groupID', params)
        );

        // Assign correct group users to community display list

        const {
          data: {
            group: { members, learners, member_count, learner_count }
          }
        } = yield checkResponse(resp);
        console.log(resp.data);

        if (groupFilterType === 'members') {
          users = members;
          total = member_count;
        }

        if (groupFilterType === 'empty-seats') {
          users = learners;
          total = learner_count;
        }

        // Get group without params

        const respNoParams = yield call(
          api.getCentreGroup,
          yield getCentreID(),
          groupID,
          { limit: 99999999 }
        );

        const {
          data: { group: groupNoParams }
        } = yield checkResponse(respNoParams);

        yield put(Creators.communityGroupSuccess(groupNoParams));
      }

      // Basic sitewide members (friends)
      if (userType === 'member' || userType === undefined) {
        resp = yield call(api.getMemberCommunity);
        resp = yield checkResponse(resp);
        users = resp.data.friends;
      }

      if (contains(userType, ['eqa'])) {
        const {
          profile: {
            user: { roles }
          }
        } = yield select();

        const isSuperAdmin = contains(UserRole.SUPER_ADMIN_ROLE, roles);
        if (isSuperAdmin) {
          resp = yield call(api.getAllMembers, params);
        } else {
          resp = yield call(api.getAllMembersV1, params, yield getCentreID());
        }

        resp = yield checkResponse(resp);

        users = resp.data.members;
      }

      if (contains(userType, ['site-admin', 'super-admin'])) {
        resp = yield call(api.getAllMembers, params);
        resp = yield checkResponse(resp);

        users = resp.data.members;
      }

      if (userType === 'centre-eqa') {
        resp = yield call(api.getCentreEqa, params);
        resp = yield checkResponse(resp);

        users = resp.data.map(user => ({
          ...user,
          centre_roles: ['CENTRE_EQA_ROLE']
        }));
      }

      const usersTotal = (resp.data && resp.data.total) || total || 0;
      yield put(Creators.communityUsersSuccess(users, usersTotal));
    } catch (err) {
      yield put(Creators.communityUsersFailure(err));
    }
  }

  function* communityUsersAwaitingAttempt({ params }) {
    try {
      const res = yield call(api.getCommunityUsersAwaiting, params);
      const { data } = yield checkResponse(res);
      yield put(
        Creators.getCommunityUsersAwaitingSuccess(data.members, data.total)
      );
    } catch (err) {
      yield put(Creators.getCommunityUsersAwaitingFailure(err));
    }
  }

  function* communityUsersAttemptOldApi(action) {
    const { userType, params } = action;

    try {
      let resp = {};
      let users = [];

      // Basic centre users
      if (userType === 'centre') {
        resp = yield call(
          api.getCentreCommunityOldApi,
          yield getCentreID(),
          params
        );
        resp = yield checkResponse(resp);
        users = resp.data.community;
      }

      const usersTotal = resp.data.total || 0;
      yield put(Creators.communityUsersSuccess(users, usersTotal));
    } catch (err) {
      yield put(Creators.communityUsersFailure(err));
    }
  }

  function* communityUsersFailure({ errorCode }) {
    yield put(
      notifyError(yield translate(errorCode), {
        icon: <i className="fa fa-times" />
      })
    );
  }

  /**
   * Attempt to get all centres
   */
  function* communityGetAllCentresAttempt({ params, userRole }) {
    try {
      // Send API calls
      const resp = yield call(api.getAllCentres, params, userRole);
      const data = yield checkResponse(resp);
      yield put(Creators.communityGetAllCentresSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.communityGetAllCentresFailure(err));
    }
  }

  function* communityGetAllCentresFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  /**
   * Attempt to invite Site/Super Admin(s) to the system
   */
  function* communityPostAdminInviteAttempt({ params }) {
    try {
      // Send API calls
      const resp = yield call(api.sendAdminInvite, convertToFormData(params));
      const data = yield checkResponse(resp);
      yield put(Creators.communityPostInviteSuccess(data));
    } catch (err) {
      yield put(Creators.communityPostInviteFailure(err));
    }
  }

  /**
   * Attempt to invite members to join a centre
   */
  function* communityPostCentreInviteAttempt({ params }) {
    try {
      const { roles } = yield select(getUser);
      const resp = yield call(api.sendCentreInvite, convertToFormData(params));
      const data = yield checkResponse(resp);
      const { verification_key } = data.data;
      yield put(Creators.communityPostInviteSuccess(data));
      if (
        config.registrationFlow === '2' &&
        roles.indexOf('SUPER_ADMIN_ROLE') !== -1
      ) {
        browserHistory.push(
          `register/centre/verify/${verification_key}?clearSession=true`
        );
      }
    } catch (err) {
      yield put(Creators.communityPostInviteFailure(err));
    }
  }

  /**
   * Attempt to invite members to join a centre
   */
  function* communityPostMemberInviteAttempt({ params }) {
    try {
      const resp = yield call(
        api.sendCentreMemberInvite,
        convertToFormData(params)
      );
      const data = yield checkResponse(resp);
      yield put(Creators.communityPostInviteSuccess(data));
    } catch (err) {
      yield put(Creators.communityPostInviteFailure(err));
    }
  }

  function* communityPostInviteSuccess() {
    yield put(
      notifySuccess(yield translate('invitation_sent'), {
        canDimiss: true,
        duration: 1000
      })
    );
  }

  function* communityPostInviteFailure() {
    yield put(
      notifyError(yield translate('invitation_failed'), {
        canDimiss: true,
        duration: 1000,
        icon: <i className="fa fa-exclamation" />
      })
    );
  }

  // Search for group members to add to group
  function* communityGroupMemberSearchAttempt({ params }) {
    try {
      const users = yield call(
        api.getCentreCommunity,
        yield getCentreID(),
        params
      );

      const seats = yield call(api.getCentreSeats, yield getCentreID(), params);
      const userData = yield checkResponse(users);
      const seatData = yield checkResponse(seats);
      yield put(
        Creators.communityGroupMemberSearchSuccess(
          userData.data.community,
          seatData.data.seats || []
        )
      );
    } catch (err) {
      yield put(Creators.communityGroupMemberSearchFailure(err));
    }
  }

  // Search for friends to invite
  function* communityFriendSearchAttempt({ params }) {
    try {
      const resp = yield call(api.getAllMembers, params);
      const data = yield checkResponse(resp);
      yield put(Creators.communityFriendSearchSuccess(data.data.members));
    } catch (err) {
      yield put(Creators.communityFriendSearchFailure(err));
    }
  }

  // Invite friend(s)
  function* connectionAction(sender_id, receiver_id, action) {
    const resp = yield call(
      api.manageConnections,
      sender_id,
      receiver_id,
      action
    );
    const { status } = yield checkResponse(resp);
    return status;
  }

  function* friendRequestAttempt({ friendId }) {
    try {
      const { member_id } = yield select(getUser);
      connectionAction(member_id, friendId, 'request');
      yield put(notifySuccess(yield translate('friend_request_sent')));
      yield put(Creators.friendRequestSuccess());
    } catch (err) {
      yield put(notifyError(yield translate('friend_request_failed')));
      yield put(Creators.friendRequestFailure(err));
    }
  }

  function* friendRequestsAttempt({ friendsIds }) {
    try {
      const { member_id } = yield select(getUser);
      const failedIds = [];

      // Map over friend ids and send a request for each
      for (const i in friendsIds) {
        if (friendsIds.hasOwnProperty(i)) {
          const status = yield call(
            connectionAction,
            member_id,
            parseInt(friendsIds[i]),
            'request'
          );

          // If the request status is `fail`, push the ID
          // to a failed ID's array
          if (status === 'fail') {
            failedIds.push(friendsIds[i]);
          }
        }
      }

      // If all requests have failed
      if (length(failedIds) === length(friendsIds)) {
        throw Error('Friend requests failed.');
      }

      // Some/all requests were successful
      yield put(notifySuccess(yield translate('friend_request_sent')));

      // Some requests were unsuccessful
      if (length(failedIds)) {
        yield put(
          notifyError(
            yield translatef(
              'batch_friend_request_failed',
              failedIds.join(', ')
            ),
            { duration: 8000 }
          )
        );
      }

      yield put(Creators.friendRequestsSuccess());
    } catch (err) {
      yield put(notifyError(yield translate('friend_request_failed')));
      yield put(Creators.friendRequestsFailure(err));
    }
  }

  function* manageConnectionAttempt({ connection, action }) {
    const {
      meta: { sender, recipient }
    } = connection;
    try {
      const response = yield call(
        api.manageConnections,
        recipient,
        sender,
        action
      );
      if (checkResponse(response)) {
        yield put(Creators.manageConnectionSuccess(connection, action));
      }
    } catch (e) {
      yield put(Creators.manageConnectionFailure(e, connection, action));
    }
  }

  function* manageConnectionSuccess() {}
  function* manageConnectionFailure() {}

  /**
   * Attempt to create group
   */
  function* communityGroupCreateAttempt({ params }) {
    try {
      const formData = convertToFormData(params);
      const resp = yield call(
        api.createCentreGroup,
        yield getCentreID(),
        formData
      );
      const data = yield checkResponse(resp);
      const group = path(['data', 'group'], data);
      yield put(Creators.communityGroupCreateSuccess(group));
      yield put(notifySuccess(yield translate('group_created')));
    } catch (err) {
      yield put(
        notifyError(yield translate(err || 'group_create_failed'), {
          icon: <i className="fa fa-times" />
        })
      );
      yield put(Creators.communityGroupCreateFailure(err));
    }
  }

  /**
   * Attempt to update group
   */
  function* communityGroupUpdateAttempt({ groupID, params }) {
    try {
      const resp = yield call(
        api.updateCentreGroup,
        yield getCentreID(),
        groupID,
        convertToFormData(params)
      );
      yield checkResponse(resp);
      yield put(Creators.communityGroupUpdateSuccess());
      yield put(notifySuccess(yield translate('group_updated')));
    } catch (err) {
      yield put(
        notifyError(yield translate(err || 'group_update_failed'), {
          icon: <i className="fa fa-times" />
        })
      );
      yield put(Creators.communityGroupUpdateFailure(err));
    }
  }

  /**
   * Attempt to delete group
   */
  function* communityGroupDeleteAttempt({ groupID }) {
    try {
      const resp = yield call(
        api.deleteCentreGroup,
        yield getCentreID(),
        groupID
      );
      yield checkResponse(resp);
      yield put(Creators.communityGroupDeleteSuccess());
      yield put(notifySuccess(yield translate('group_deleted')));
      browserHistory.push('/community/groups');
    } catch (err) {
      yield put(
        notifyError(yield translate(err || 'group_delete_failed'), {
          icon: <i className="fa fa-times" />
        })
      );
      yield put(Creators.communityGroupDeleteFailure(err));
    }
  }

  function* deleteMemberAttempt(action) {
    try {
      const resp = yield call(api.deleteMember, action.member_id);
      yield checkResponse(resp);
      yield put(Creators.deleteMemberSuccess(action.member_id));
    } catch (err) {
      yield put(Creators.deleteMemberFailure(err));
    }
  }

  function* deleteMemberSuccess() {
    yield put(notifySuccess(yield translate('user_deleted')));
  }

  function* deleteMemberFailure() {
    yield put(notifyError(yield translate('user_delete_failed')));
  }

  // function* deleteMemberFromGroupAttempt(action) {
  //   yield checkResponse(yield call(
  //     api.deleteMemberFromGroup,
  //     action.groupID,
  //     action.member_id
  //   ))
  //     .then((response) => {
  //       console.log(response);
  //       notifySuccess(translate('user_deleted_from_group'))
  //       put(Creators.deleteMemberFromGroupSuccess(action.member_id));
  //     })
  //     .catch((response) => {
  //       console.log(response);
  //       notifyError(translate('user_delete_from_group_failed'))
  //       put(Creators.deleteMemberFromGroupFailure(response));
  //     });
  // }

  function* deleteMemberFromGroupAttempt(action) {
    try {
      const resp = yield call(
        api.deleteMemberFromGroup,
        action.groupID,
        action.member_id
      );
      yield checkResponse(resp);
      yield put(Creators.deleteMemberFromGroupSuccess(action.member_id));
    } catch (err) {
      yield put(Creators.deleteMemberFromGroupFailure(err));
    }
  }

  function* deleteMemberFromGroupSuccess() {
    yield put(notifySuccess(yield translate('user_deleted_from_group')));
  }

  function* deleteMemberFromGroupFailure() {
    yield put(notifyError(yield translate('user_delete_from_group_failed')));
  }

  function* suspendMemberAttempt(action) {
    try {
      const resp = yield call(api.suspendMember, action.member_id);
      yield checkResponse(resp);
      yield put(Creators.suspendMemberSuccess(action.member_id));
    } catch (err) {
      yield put(Creators.suspendMemberFailure(err));
    }
  }

  function* suspendMemberSuccess() {
    yield put(notifySuccess(yield translate('user_suspended')));
  }

  function* suspendMemberFailure() {
    yield put(notifyError(yield translate('user_suspend_failed')));
  }

  function* getCentreGroupAttempt(action) {
    try {
      const response = yield call(api.getCentreGroups, yield getCentreID());
      if (
        response &&
        response.ok &&
        response.data &&
        response.data.status === 'success' &&
        response.data.data
      ) {
        const groups = response.data.data.groups;
        yield put(Creators.getCentreGroupSuccess(groups));

        yield* groups.map(function*(item) {
          const resp = yield call(
            api.getCentreGroup,
            yield getCentreID(),
            item.group_id
          );
          const { data } = yield checkResponse(resp);
          yield put(Creators.getCentreGroupDetailSuccess(data.group));
        });
      }
    } catch (err) {
      yield put(Creators.getCentreGroupFailure(err));
    }
  }

  function* assignEqaAttempt(action) {
    try {
      const { member_id, centre_id, params } = action;
      let resp;
      if (centre_id) {
        resp = yield call(api.assignEQAToCentre, centre_id, params);
      } else if (member_id) {
        resp = yield call(api.assignCentreToEQA, member_id, params);
      }
      yield checkResponse(resp);
      yield put(Creators.assignEqaSuccess());
    } catch (err) {
      yield put(Creators.assignEqaFailure());
    }
  }

  function* assignEqaSuccess() {
    yield put(notifySuccess('User added'));
  }

  function* assignEqaFailure() {
    yield put(notifyError('Unable to assign EQA'));
  }

  function* searchGroupMembersAttempt({ params }) {
    try {
      const {
        profile: {
          user: { centres }
        }
      } = yield select();
      const id = prop('centre_id', head(centres));
      const resp = yield call(api.getAllMembersV1, params, id);
      if (path(['data', 'status'])(resp) === 'success') {
        const members = path(['data', 'data', 'members'])(resp);
        console.log(members);

        yield put(Creators.searchGroupMembersSuccess(members, id));
      }
    } catch (err) {
      console.log(err);
      yield put(Creators.searchGroupMembersFailure());
    }
  }

  function* createCentreAttempt({ params }) {
    try {
      const resp = yield call(api.createCentre, params);
      const { data } = yield checkResponse(resp);
      yield put(Creators.createCentreSuccess(data));
    } catch (err) {
      console.log(err);
      yield put(Creators.createCentreFailure(err));
    }
  }

  function* createCentreSuccess() {
    yield put(notifySuccess('Your centre has been created successfully.'));
  }

  function* createCentreFailure({ errorCode }) {
    yield put(notifyError(errorCode));
  }

  function* createGroupChatAttempt({ centre_id, group_id }) {
    try {
      const resp = yield call(api.getCentreGroup, centre_id, group_id);
      const { data } = yield checkResponse(resp);
      const group = path(['group'], data);
      if (group) {
        yield put(Creators.createGroupChatSuccess(group));
      }
    } catch (err) {
      console.log(err);
      yield put(Creators.createGroupChatFailure());
    }
  }

  function* createGroupChatSuccess({ group }) {
    yield put(
      MessagingActions.startChatAttempt(group.members, group.title, true)
    );
  }

  function* generateExportManagerReportAttempt({ centre_id, params }) {
    try {
      const resp = yield call(
        api.generateReport,
        centre_id,
        convertToFormData(params)
      );
      if (resp.status !== 200) {
        throw resp.data.message || 'Fail';
      }
      const respFile = yield call(
        api.getUserExportCsvFile,
        centre_id,
        resp.data.data.user_export_id
      );
      yield put(
        Creators.generateExportManagerReportSuccess(
          respFile.data,
          resp.data.data.export_info.created
        )
      );
    } catch (error) {
      yield put(notifyError(error));
      yield put(Creators.generateExportManagerReportFailure(error));
    }
  }

  function* searchQualificationsAttempt({ params }) {
    try {
      const resp = yield call(api.searchQualifications, params);
      yield put(Creators.searchQualificationsSuccess(resp.data.data || null));
    } catch (error) {
      yield put(Creators.searchQualificationsFailure(error));
    }
  }

  function* getAdminCentresAttempt({ params }) {
    try {
      const resp = yield call(api.getAdminCentre, params);
      const { data } = yield checkResponse(resp);
      yield put(Creators.getAdminCentresSuccess(data));
    } catch (error) {
      yield put(Creators.getAdminCentresFailure());
    }
  }

  function* inviteCentreMemberAttempt({ params }) {
    try {
      yield call(api.inviteCentreMember, params);
      yield put(Creators.inviteCentreMemberSuccess());
    } catch (error) {
      yield put(Creators.inviteCentreMemberFailure());
    }
  }

  function* getEqaMemberAttempt({ member_id }) {
    try {
      const res = yield call(api.getMember, member_id);
      const { data } = yield checkResponse(res);
      yield put(Creators.getEqaMemberSuccess(data));
    } catch (error) {
      yield put(Creators.getEqaMemberFailure());
    }
  }

  function* startWatchers() {
    yield takeEvery(Types.DELETE_MEMBER_ATTEMPT, deleteMemberAttempt);
    yield takeEvery(Types.DELETE_MEMBER_SUCCESS, deleteMemberSuccess);
    yield takeEvery(Types.DELETE_MEMBER_FAILURE, deleteMemberFailure);

    yield takeEvery(
      Types.DELETE_MEMBER_FROM_GROUP_ATTEMPT,
      deleteMemberFromGroupAttempt
    );
    yield takeEvery(
      Types.DELETE_MEMBER_FROM_GROUP_SUCCESS,
      deleteMemberFromGroupSuccess
    );
    yield takeEvery(
      Types.DELETE_MEMBER_FROM_GROUP_FAILURE,
      deleteMemberFromGroupFailure
    );

    yield takeEvery(Types.SUSPEND_MEMBER_ATTEMPT, suspendMemberAttempt);
    yield takeEvery(Types.SUSPEND_MEMBER_SUCCESS, suspendMemberSuccess);
    yield takeEvery(Types.SUSPEND_MEMBER_FAILURE, suspendMemberFailure);
    yield takeEvery(Types.ASSIGN_EQA_ATTEMPT, assignEqaAttempt);
    yield takeEvery(Types.ASSIGN_EQA_SUCCESS, assignEqaSuccess);
    yield takeEvery(Types.ASSIGN_EQA_FAILURE, assignEqaFailure);
    yield takeLatest(Types.AUTHOR_TASKS_ATTEMPT, communityAuthorTasksAttempt);
    yield takeLatest(Types.AUTHOR_TASKS_FAILURE, communityAuthorTasksFailure);
    yield takeLatest(
      Types.AUTHOR_TASK_CREATE_ATTEMPT,
      communityCreateAuthorTasksAttempt
    );
    yield takeLatest(
      Types.AUTHOR_TASK_CREATE_FAILURE,
      communityCreateAuthorTasksFailure
    );
    yield takeLatest(
      Types.AUTHOR_TASK_UPDATE_ATTEMPT,
      communityUpdateAuthorTasksAttempt
    );
    yield takeLatest(
      Types.AUTHOR_FILE_UPLOAD_ATTEMPT,
      communityAuthorFileUploadAttempt
    );
    yield takeLatest(
      Types.AUTHOR_FILE_UPLOAD_FAILURE,
      communityAuthorFileUploadFailure
    );
    yield takeLatest(Types.AUTHOR_FILES_ATTEMPT, communityAuthorFilesAttempt);
    yield takeLatest(
      Types.AUTHOR_ACTIVITIES_ATTEMPT,
      communityAuthorActivities
    );
    yield takeLatest(Types.COMMUNITY_USERS_ATTEMPT, communityUsersAttempt);
    yield takeLatest(Types.COMMUNITY_USERS_FAILURE, communityUsersFailure);
    yield takeLatest(
      Types.COMMUNITY_USERS_ATTEMPT_OLD_API,
      communityUsersAttemptOldApi
    );

    yield takeLatest(
      Types.COMMUNITY_GET_ALL_CENTRES_ATTEMPT,
      communityGetAllCentresAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_GET_ALL_CENTRES_FAILURE,
      communityGetAllCentresFailure
    );

    yield takeLatest(
      Types.COMMUNITY_POST_CENTRE_INVITE_ATTEMPT,
      communityPostCentreInviteAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_POST_ADMIN_INVITE_ATTEMPT,
      communityPostAdminInviteAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_POST_MEMBER_INVITE_ATTEMPT,
      communityPostMemberInviteAttempt
    );

    yield takeLatest(
      Types.COMMUNITY_FRIEND_SEARCH_ATTEMPT,
      communityFriendSearchAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_POST_INVITE_SUCCESS,
      communityPostInviteSuccess
    );
    yield takeLatest(
      Types.COMMUNITY_POST_INVITE_FAILURE,
      communityPostInviteFailure
    );

    yield takeLatest(Types.FRIEND_REQUEST_ATTEMPT, friendRequestAttempt);
    yield takeLatest(Types.FRIEND_REQUESTS_ATTEMPT, friendRequestsAttempt);
    yield takeLatest(Types.MANAGE_CONNECTION_ATTEMPT, manageConnectionAttempt);
    yield takeLatest(Types.MANAGE_CONNECTION_SUCCESS, manageConnectionSuccess);
    yield takeLatest(Types.MANAGE_CONNECTION_FAILURE, manageConnectionFailure);
    yield takeLatest(
      Types.COMMUNITY_GROUP_MEMBER_SEARCH_ATTEMPT,
      communityGroupMemberSearchAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_GROUP_CREATE_ATTEMPT,
      communityGroupCreateAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_GROUP_UPDATE_ATTEMPT,
      communityGroupUpdateAttempt
    );
    yield takeLatest(
      Types.COMMUNITY_GROUP_DELETE_ATTEMPT,
      communityGroupDeleteAttempt
    );
    yield takeLatest(Types.GET_CENTRE_GROUP_ATTEMPT, getCentreGroupAttempt);

    yield takeLatest(
      Types.GET_COMMUNITY_USERS_AWAITING_ATTEMPT,
      communityUsersAwaitingAttempt
    );
    yield takeLatest(
      Types.SEARCH_GROUP_MEMBERS_ATTEMPT,
      searchGroupMembersAttempt
    );
    yield takeLatest(Types.CREATE_CENTRE_ATTEMPT, createCentreAttempt);
    yield takeLatest(Types.CREATE_CENTRE_SUCCESS, createCentreSuccess);
    yield takeLatest(Types.CREATE_CENTRE_FAILURE, createCentreFailure);

    yield takeLatest(
      Types.COMMUNITY_GET_GROUP_ATTEMPT,
      communityGetGroupAttempt
    );

    yield takeLatest(Types.CREATE_GROUP_CHAT_ATTEMPT, createGroupChatAttempt);
    yield takeLatest(Types.CREATE_GROUP_CHAT_SUCCESS, createGroupChatSuccess);

    yield takeLatest(
      Types.SEARCH_QUALIFICATIONS_ATTEMPT,
      searchQualificationsAttempt
    );

    yield takeLatest(
      Types.GENERATE_EXPORT_MANAGER_REPORT_ATTEMPT,
      generateExportManagerReportAttempt
    );

    yield takeLatest(Types.GET_ADMIN_CENTRES_ATTEMPT, getAdminCentresAttempt);

    yield takeLatest(
      Types.INVITE_CENTRE_MEMBER_ATTEMPT,
      inviteCentreMemberAttempt
    );

    yield takeLatest(Types.GET_EQA_MEMBER_ATTEMPT, getEqaMemberAttempt);
  }

  return {
    startWatchers,
    communityUsersAttempt,
    communityUsersAttemptOldApi,

    communityGetAllCentresAttempt,
    communityGetAllCentresFailure,

    communityPostCentreInviteAttempt,
    communityPostAdminInviteAttempt,
    communityPostMemberInviteAttempt,
    communityPostInviteSuccess,
    communityPostInviteFailure,

    communityFriendSearchAttempt,
    communityGroupMemberSearchAttempt,
    communityGroupCreateAttempt,
    communityGroupUpdateAttempt,
    communityGroupDeleteAttempt,
    friendRequestAttempt,
    friendRequestsAttempt,
    manageConnectionAttempt,
    manageConnectionSuccess,
    manageConnectionFailure,
    getCentreGroupAttempt,
    assignEqaAttempt,
    assignEqaSuccess,
    assignEqaFailure
  };
};
