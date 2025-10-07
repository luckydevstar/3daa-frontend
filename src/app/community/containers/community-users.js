import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {
  take,
  cond,
  always,
  T,
  equals,
  length,
  last,
  contains,
  head,
  path
} from 'ramda';

import common from 'app/common';
import { Roles } from 'app/core/config/constants';

import { Creators as MessagingActions } from 'app/messaging/actions';
import { Creators } from '../actions';
import { ListView, CardView, FeaturedView, EmptyView } from '../components';

const {
  util: {
    helpers: { extractUserRole }
  },
  components: { UILoading }
} = common;

const { CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin } = Roles;

class CommunityUsers extends Component {
  constructor(props) {
    super(props);
    this.toggleSortBy = this.toggleSortBy.bind(this);
    this.openChat = this.openChat.bind(this);
    this.openGroupChat = this.openGroupChat.bind(this);
    this.viewSeenByRole = null;
    this.notCentreRoles = null;
    this.getFromAllCenters = null;
    this.initialFetch = false;
    this.useOldApi = false;

    this.onRemoveButtonClick = this.onRemoveButtonClick.bind(this);
    this.onRemoveFromGroupButtonClick = this.onRemoveFromGroupButtonClick.bind(
      this
    );
    this.onSuspendUser = this.onSuspendUser.bind(this);
    this.getMemberTasks = this.getMemberTasks.bind(this);
    this.convertToArray = this.convertToArray.bind(this);
  }

  // Component lifecycle funcs

  componentDidMount() {
    const {
      userType,
      activeSection,
      itemsPerPage,
      pageNumber,
      sorting,
      routeRole,
      oldApi,
      authorFilesAttempt,
      user,
      authorActivitiesAttempt
    } = this.props;
    authorFilesAttempt({
      member_id: user.member_id
    });
    this.getMemberTasks(null);
    authorActivitiesAttempt();
    if (!this.initialFetch) {
      // Initial get users
      this.getUsers({
        userType,
        activeSection,
        itemsPerPage,
        pageNumber,
        sorting,
        routeRole,
        oldApi
      });
      this.initialFetch = true;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      activeSection,
      pageNumber,
      goToPage,
      userType,
      searchTerm,
      groupToDeleteID,
      onlineFilter,
      sorting,
      deletingMember,
      deletingMemberFromGroup,
      groupFilterType,
      group
    } = this.props;

    // If the source of the users is changed
    if (
      !equals(activeSection, nextProps.activeSection) ||
      !equals(userType, nextProps.userType) ||
      !equals(pageNumber, nextProps.pageNumber) ||
      !equals(groupToDeleteID, nextProps.groupToDeleteID) ||
      !equals(onlineFilter, nextProps.onlineFilter) ||
      !equals(searchTerm, nextProps.searchTerm) ||
      !equals(sorting, nextProps.sorting) ||
      // !equals(selectedCentreID, nextProps.selectedCentreID) ||
      // If user recently deleted
      (deletingMember && nextProps.deletingMember === null) ||
      (deletingMemberFromGroup && nextProps.deletingMemberFromGroup === null)
    ) {
      this.getUsers(nextProps);
    }

    // Update UI on group remove

    // If section changes tell parent container
    // to return to page 1
    if (!equals(activeSection, nextProps.activeSection)) {
      goToPage(1);
    }

    if (!equals(userType, nextProps.userType)) {
      goToPage(1);
    }

    // Update user set on group filter type change
    if (group && groupFilterType !== nextProps.groupFilterType) {
      goToPage(1, () => this.getUsers(nextProps));
    }
  }

  // Helper funcs

  onRemoveButtonClick(member_id) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.props.deleteMemberAttempt(member_id);
    }
  }

  onRemoveFromGroupButtonClick(member_id) {
    if (confirm('Are you sure you want to remove this member from group?')) {
      const groupID = last(window.location.pathname.split('/'));
      this.props.deleteMemberFromGroupAttempt(groupID, member_id);
    }
  }

  onSuspendUser(member_id) {
    if (confirm('Are you sure you want to suspend this member?')) {
      this.props.suspendMemberAttempt(member_id);
    }
  }

  // Gets a set of users related to a centre or member
  getUsers(nextProps) {
    const {
      userType,
      itemsPerPage,
      pageNumber,
      routeRole,
      searchTerm,
      oldApi,
      onlineFilter,
      sorting,
      selectedCentreID,
      selectedTutorID,
      activeSection
    } = nextProps;
    const { activeProp, config } = sorting;
    const {
      centre_id,
      member_id,
      communityUsersAttempt,
      communityUsersAttemptOldApi,
      getCommunityUsersAwaiting,
      user,
      isAssignEQAToCentre,
      isAssignCentreToEQA
    } = this.props;

    this.viewSeenByRole = extractUserRole(user);
    this.notCentreRoles = contains(userType, ['site-admin', 'super-admin']);

    this.getFromAllCenters = contains(this.viewSeenByRole, [
      SiteAdmin,
      SuperAdmin
    ]);

    const params = {
      offset: (pageNumber - 1) * itemsPerPage,
      order: activeProp ? config[activeProp].sortOrder : null,
      sort: activeProp,
      search: searchTerm,
      limit: itemsPerPage,
      selectedCentreID,
      selectedTutorID
    };

    if (routeRole && userType === 'centre') {
      params['centre_roles[]'] = routeRole;
    }

    if (routeRole && userType === 'eqa') {
      params['centre_roles[]'] = routeRole;
    }

    if (userType === 'group') {
      // get group ID from URL, not from the router because
      // if this function is called from componentWillMount the router
      // is not available yet
      params.groupID = last(window.location.pathname.split('/'));
    }

    if (onlineFilter && onlineFilter !== 'All')
      params.online = onlineFilter === 'Online' ? 1 : 0;

    if (this.notCentreRoles)
      params['roles[]'] = userType === 'site-admin' ? 2 : 1;

    // To get EQA or Centre users to assign
    if (isAssignEQAToCentre) {
      params['roles[]'] = 'EQA_ROLE';
      params['not_centre_eqa'] = centre_id;
      params['eqa_role'] = 'EQA_ROLE';
      params['not_eqa_invited'] = 1;
    } else if (isAssignCentreToEQA) {
      params['offset'] = undefined;
      params['limit'] = undefined;
      params['not_centre_eqa_member'] = member_id;
      params['centre_eqa_role'] = 'EQA';
      params['not_eqa_invited'] = 1;
    }

    this.useOldApi =
      oldApi && !this.getFromAllCenters && this.viewSeenByRole === CentreTutor;

    if (activeSection === 'awaiting_users') {
      getCommunityUsersAwaiting(params);
    } else if (this.useOldApi) {
      communityUsersAttemptOldApi(userType, params);
    } else {
      communityUsersAttempt(userType, params, this.viewSeenByRole);
    }
  }

  getMemberTasks(memberId) {
    const { authorTasksAttempt, user } = this.props;

    const params = {
      member_id: memberId
    };

    authorTasksAttempt(user.member_id, params);
  }
  toggleSortBy(sortProp, sortOrder) {
    this.props.goToPage(1);
    this.props.communityUpdateSortSettings(sortProp, sortOrder);
  }

  openChat(member, screen_name) {
    const { startChatAttempt } = this.props;
    startChatAttempt([member], screen_name, true);
  }

  openGroupChat(group) {
    const { createGroupChatAttempt, user } = this.props;
    const centre = head(path(['centres'], user));

    createGroupChatAttempt(centre ? centre.centre_id : null, group.group_id);
    // startChatAttempt(group.members, group.screen_name, true);
  }

  convertToArray(obj) {
    let arr = [];
    for (let i = 0; obj[i]; i++) {
      arr.push(obj[i]);
    }
    return arr;
  }

  renderTab(users) {
    const {
      onRemoveButtonClick,
      onRemoveFromGroupButtonClick,
      onSuspendUser
    } = this;
    const {
      dispatch,
      activeLayout,
      filterTabs,
      filterTabActive,
      user,
      activeSection,
      sorting: { config: sortConfig },
      openDeleteGroupModal,
      openLoginAsMemberModal,
      openGroupModal,
      changeActiveSection,
      onAssignEQA,
      showCheckbox,
      showCalendar,
      showTask,
      onChange,
      selectedItems,
      setCentreID,
      setTutorID,
      communityAuthorTasks,
      authorTaskCreateAttempt,
      attemptionAuthorTasks,
      authorFileUploadAttempt,
      authorFiles,
      attemptingAuthorFileUpload,
      attemptingCreateGroupChat,
      authorTaskUpdateAttempt,
      activities,
      isLogin
    } = this.props;

    // console.log(activeLayout);

    const role = extractUserRole(user);

    const canAccessWorkbooks =
      this.props.canAccessWorkbooks &&
      contains(role, [CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin]);

    const seenByGlobalAdmin = contains(role, [SiteAdmin, SuperAdmin]);

    const seenByMemberId = user.member_id;

    const canSeeOthersProgress = canAccessWorkbooks;
    const seenByTutor = role === CentreTutor;
    const list = (
      <ListView
        toggleSortBy={this.toggleSortBy}
        openChat={this.openChat}
        sortSettings={sortConfig}
        getMemberTasks={this.getMemberTasks}
        tasks={communityAuthorTasks}
        files={this.convertToArray(authorFiles)}
        {...{
          role,
          users,
          canSeeOthersProgress,
          canAccessWorkbooks,
          seenByGlobalAdmin,
          seenByTutor,
          seenByMemberId,
          activeSection,
          openDeleteGroupModal,
          openLoginAsMemberModal,
          openGroupModal,
          onRemoveButtonClick,
          onRemoveFromGroupButtonClick,
          showCheckbox,
          showCalendar,
          showTask,
          onChange,
          selectedItems,
          onSuspendUser,
          setCentreID,
          setTutorID,
          onAssignEQA,
          authorTaskCreateAttempt,
          user,
          activities,
          attemptionAuthorTasks,
          authorFileUploadAttempt,
          attemptingAuthorFileUpload,
          authorTaskUpdateAttempt,
          isLogin,
          openGroupChat: this.openGroupChat
        }}
      />
    );

    return cond([
      [
        // If there are no users or group members (Empty view)
        () => !length(users),
        always(<EmptyView {...{ dispatch, filterTabs, filterTabActive }} />)
      ],
      // List view
      // [equals('list'), always(list)],
      [equals('list'), always(list)],
      // Feature view
      [
        equals('feature'),
        always(
          <FeaturedView
            {...{
              role,
              featuredUsers: take(8, users),
              canSeeOthersProgress,
              canAccessWorkbooks,
              seenByGlobalAdmin,
              seenByTutor,
              list
            }}
          />
        )
      ],
      // Card (default)
      [
        T,
        always(
          <CardView
            openChat={this.openChat}
            {...{
              role,
              users,
              dispatch,
              seenByTutor,
              activeSection,
              seenByMemberId,
              seenByGlobalAdmin,
              canAccessWorkbooks,
              canSeeOthersProgress,
              openDeleteGroupModal,
              openLoginAsMemberModal,
              openGroupModal,
              onRemoveButtonClick,
              onRemoveFromGroupButtonClick,
              onSuspendUser,
              changeActiveSection,
              onAssignEQA,
              showCheckbox,
              onChange,
              selectedItems,
              setCentreID,
              setTutorID,
              attemptingCreateGroupChat,
              tasks: communityAuthorTasks,
              openGroupChat: this.openGroupChat
            }}
          />
        )
      ]
    ])(activeLayout);
  }

  render() {
    const {
      users,
      attemptingUsersGet,
      attemptingAwaitingUsersGet
    } = this.props;

    return (
      <div className="community-users-container container min-content-height-inner">
        {(attemptingUsersGet || attemptingAwaitingUsersGet) && (
          <UILoading marginTop="100px" />
        )}
        {!attemptingUsersGet &&
          !attemptingAwaitingUsersGet &&
          users &&
          this.renderTab(users)}
      </div>
    );
  }
}

CommunityUsers.propTypes = {
  canAccessWorkbooks: PropTypes.bool,
  showCalendar: PropTypes.bool,
  showTask: PropTypes.bool,
  changeActiveSection: PropTypes.func,
  onAssignEQA: PropTypes.func,
  isLogin: PropTypes.bool
};

CommunityUsers.defaultProps = {
  canAccessWorkbooks: true,
  showCalendar: false,
  showTask: false,
  changeActiveSection: () => {},
  onAssignEQA: () => {},
  isLogin: true
};

const mapStateToProps = state => ({
  ...state.community,
  user: state.profile.user,
  state
});

const {
  communityUsersAttempt,
  communityUsersSuccess,
  communityUsersAttemptOldApi,
  communityUpdateSortSettings,
  deleteMemberAttempt,
  deleteMemberFromGroupAttempt,
  suspendMemberAttempt,
  authorTasksAttempt,
  authorTaskCreateAttempt,
  authorTaskUpdateAttempt,
  authorFileUploadAttempt,
  authorFilesAttempt,
  authorActivitiesAttempt,
  getCommunityUsersAwaitingAttempt,
  createGroupChatAttempt
} = Creators;

const { startChatAttempt } = MessagingActions;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      communityUpdateSortSettings,
      communityUsersAttempt,
      communityUsersSuccess,
      authorTasksAttempt,
      communityUsersAttemptOldApi,
      deleteMemberAttempt,
      deleteMemberFromGroupAttempt,
      suspendMemberAttempt,
      startChatAttempt,
      authorTaskCreateAttempt,
      authorFileUploadAttempt,
      authorFilesAttempt,
      authorTaskUpdateAttempt,
      authorActivitiesAttempt,
      createGroupChatAttempt,
      getCommunityUsersAwaiting: getCommunityUsersAwaitingAttempt
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CommunityUsers);
