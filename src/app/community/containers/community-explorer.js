import React, { Component } from 'react';
import { connect } from 'react-redux';
import { last, find, propEq, findIndex, path, head } from 'ramda';
import { Creators } from '../actions';

import { Creators as CommunityActions } from '../actions';
import { Creators as UserActions } from 'app/user/actions';
import { Creators as MessagingActions } from 'app/messaging/actions';
import CommunityUsers from './community-users';
import common from 'app/common';
import ModalGroup from 'app/modal-group/container';
import navTabs from '../config/navs';
import { Text } from 'app/intl';
import {
  ModalInvite,
  ModalInviteIqa,
  HeaderView,
  SwitchLayoutView,
  ModalFriends,
  ModalCreateGroup
} from '../components';
import EqaAssignView from '../components/eqa-assign-view';
import CommunityExportManager from './community-export-manager';
import ExportManagerHeader from '../components/export-manager/export-manager-header';

const {
  components: { Pagination, Footer, ContentModalNew, UINavigation, UILoading },
  util: {
    helpers: { checkRolesAndPermissions }
  }
} = common;

const ITEMS_PER_PAGE = 15;

class CommunityExplorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityNav: [],
      activeLayout: 'card',
      pageNumber: 1,
      groupToDeleteID: null,
      searchTerm: null,
      modalDeleteGroupOpen: false,
      onlineFilter: null,
      activeSection: '',
      activeSectionHacked: false,
      activeMember: null,
      modalLoginAsMemberOpen: false,
      selectedMemberID: null,
      selectedCentreID: null,
      selectedTutorID: null,
      createGroupModal: false,
      groupToEdit: false,
      groupModalTitle: ''
    };

    this.buildCommunityNav = this.buildCommunityNav.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.handleLayoutChange = this.handleLayoutChange.bind(this);
    this.openGroupModal = this.openGroupModal.bind(this);
    this.closeGroupModal = this.closeGroupModal.bind(this);
    this.closeDeleteGroupModal = this.closeDeleteGroupModal.bind(this);
    this.openInviteModal = this.openInviteModal.bind(this);
    this.closeInviteModal = this.closeInviteModal.bind(this);
    this.openInviteIqaModal = this.openInviteIqaModal.bind(this);
    this.closeInviteIqaModal = this.closeInviteIqaModal.bind(this);
    this.openCreateGroupModal = this.openCreateGroupModal.bind(this);
    this.closeCreateGroupModal = this.closeCreateGroupModal.bind(this);
    // this.openFriendModal = this.openFriendModal.bind(this);
    // this.closeFriendModal = this.closeFriendModal.bind(this);

    this.openDeleteGroupModal = this.openDeleteGroupModal.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.onCommunitySearch = this.onCommunitySearch.bind(this);
    this.setOnlineFilter = this.setOnlineFilter.bind(this);
    this.onGroupMemberFilterChange = this.onGroupMemberFilterChange.bind(this);
    this.changeActiveSection = this.changeActiveSection.bind(this);
    this.onAssignEQA = this.onAssignEQA.bind(this);
    this.onAssignCancel = this.onAssignCancel.bind(this);

    this.openLoginAsMemberModal = this.openLoginAsMemberModal.bind(this);
    this.closeLoginAsMemberModal = this.closeLoginAsMemberModal.bind(this);
    this.loginAsMember = this.loginAsMember.bind(this);
    this.setCentreID = this.setCentreID.bind(this);
    this.setTutorID = this.setTutorID.bind(this);
    this.clearGroupEdit = this.clearGroupEdit.bind(this);
    this.openGroupChat = this.openGroupChat.bind(this);
  }

  componentDidMount() {
    const { routes } = this.props;
    const activeSection =
      routes[findIndex(propEq('path', 'community/'))(routes) + 1].path;
    this.setState({ activeSection });
  }

  UNSAFE_componentWillMount() {
    this.setState({
      communityNav: this.buildCommunityNav()
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { sendingRequest, deletingGroup } = this.props;
    const { routes } = nextProps;
    // Close friend request modal on request finish
    if (
      sendingRequest &&
      !nextProps.sendingRequest &&
      !nextProps.errorCodeRequest
    ) {
      this.closeFriendModal();
    }

    // Close group delete modal on delete group finish
    if (
      deletingGroup &&
      !nextProps.deletingGroup &&
      !nextProps.errorCodeDeletingGroup
    ) {
      this.closeDeleteGroupModal();
    }

    const activeSection =
      routes[findIndex(propEq('path', 'community/'))(routes) + 1].path;
    if (!this.state.activeSectionHacked) {
      this.setState({ activeSection });
    }
  }

  componentWillUnmount() {}

  // Component helper funcs

  onCommunitySearch(term) {
    this.setState({
      pageNumber: 1,
      searchTerm: term
    });
  }

  onGroupMemberFilterChange({ target: { value } }) {
    const { dispatch } = this.props;
    dispatch(Creators.communityGroupChangeFilterType(value));
  }

  setOnlineFilter(onlineFilter) {
    this.setState({
      onlineFilter
    });
  }

  /**
   * BuildCommunityNav()
   * Go over the community routes, check roles/permissions and if they are
   * valid for the user return them as part of the navigation.
   */
  buildCommunityNav() {
    const { user, routes } = this.props;
    // Find community subroutes
    const communityRoutes = find(propEq('path', 'community/'))(routes)
      .childRoutes;
    // Return a set of allowed route paths
    return communityRoutes.reduce((acc, route) => {
      const { allowRoles, allowPermissions, path } = route;
      if (checkRolesAndPermissions(user, allowRoles, allowPermissions)) {
        acc.push(path);
      }
      return acc;
    }, []);
  }

  // Switch to section page
  goToPage(pageNumber, setStateCallback = () => {}) {
    this.setState({ pageNumber }, setStateCallback());
  }

  // Change card/list/featured view
  handleLayoutChange(view) {
    this.setState({ activeLayout: view });
  }

  openCreateGroupModal() {
    this.setState({
      createGroupModal: true
    });
  }

  closeCreateGroupModal() {
    this.setState({
      createGroupModal: false
    });
  }

  // Register modal
  openInviteModal() {
    this.inviteModal.open();
  }

  closeInviteModal() {
    this.inviteModal.close();
  }

  openInviteIqaModal() {
    this.inviteIqaModal.open();
  }

  closeInviteIqaModal() {
    this.inviteIqaModal.close();
  }

  // // Friend modal
  // openFriendModal() {
  //   this.friendModal.open();
  // }

  // closeFriendModal() {
  //   this.friendModal.close();
  // }

  // Group management modal
  openGroupModal(group, title) {
    const { getGroup, user } = this.props;
    const centre = head(path(['centres'], user));
    this.groupModal.open();
    this.setState({
      groupToEdit: group,
      groupModalTitle: title
    });

    if (group) {
      getGroup(centre ? centre.centre_id : null, group.group_id);
    }
  }

  closeGroupModal() {
    this.groupModal.close();
    this.clearGroupEdit();
  }

  clearGroupEdit() {
    const { clearCommunityGroupEdit } = this.props;
    this.setState({
      groupToEdit: null
    });
    clearCommunityGroupEdit();
  }

  // Group management modal
  openDeleteGroupModal(id) {
    this.setState({
      groupToDeleteID: id,
      modalDeleteGroupOpen: true
    });
    // this.deleteGroupModal.open();
  }

  closeDeleteGroupModal() {
    this.setState({
      groupToDeleteID: null,
      modalDeleteGroupOpen: false
    });
  }

  openLoginAsMemberModal(id) {
    this.setState({
      selectedMemberID: id,
      modalLoginAsMemberOpen: true
    });
  }

  closeLoginAsMemberModal() {
    this.setState({
      selectedMemberID: null,
      modalLoginAsMemberOpen: false
    });
  }

  loginAsMember() {
    this.closeLoginAsMemberModal();
    if (this.state.selectedMemberID) {
      this.props.loginAsMemberAttempt(this.state.selectedMemberID);
    }
  }

  deleteGroup() {
    const { dispatch } = this.props;
    const { groupToDeleteID } = this.state;
    dispatch(Creators.communityGroupDeleteAttempt(groupToDeleteID));
  }

  changeActiveSection(sectionName) {
    this.setState({
      activeSection: sectionName,
      activeSectionHacked: true
    });
  }

  onAssignEQA(memberId) {
    this.props.users.map(item => {
      if (item.member_id === memberId) {
        this.setState({ activeMember: item });
      }
    });
    this.props.getEqaMember(memberId);
  }

  onAssignCancel() {
    this.setState({ activeMember: null });
  }

  setCentreID(centreID) {
    this.setState({ selectedCentreID: centreID });
  }

  setTutorID(tutorID) {
    this.setState({ selectedTutorID: tutorID });
  }

  openGroupChat(group) {
    const { startChatAttempt } = this.props;

    startChatAttempt(group.members, group.title, true);
  }

  // Render me papi
  render() {
    // Props

    const {
      attemptingInvite,
      searchGroupMembers,
      location,
      user,
      users,
      routes,
      attemptingUsersGet,
      attemptingCreateGroup,
      deletingGroup,
      usersTotal,
      groupFilterType,
      group,
      groupToEditAttempting,
      dispatch,
      assigningEQA,
      assignEQAStatus,
      groupUsers,
      attemptingGroupUsers,
      communityGroupCreate,
      eqaMember
    } = this.props;

    // Route params
    const { userType, routeRole, oldApi } = last(routes);

    // State
    const {
      activeLayout,
      pageNumber,
      searchTerm,
      groupToDeleteID,
      onlineFilter,
      activeSection,
      activeMember,
      selectedCentreID,
      selectedTutorID,
      createGroupModal,
      groupModalTitle,
      groupToEdit
    } = this.state;

    // Callbacks
    const {
      openInviteModal,
      openInviteIqaModal,
      closeInviteIqaModal,
      // openFriendModal,
      openGroupModal,
      closeGroupModal,
      deleteGroup,
      closeDeleteGroupModal,
      openDeleteGroupModal,
      openCreateGroupModal,
      handleLayoutChange,
      goToPage,
      onCommunitySearch,
      setOnlineFilter,
      onGroupMemberFilterChange,
      changeActiveSection,
      onAssignEQA,
      onAssignCancel,
      openLoginAsMemberModal,
      setCentreID,
      setTutorID
    } = this;

    // Extract the active community section path
    // const activeSection =
    //   routes[findIndex(propEq('path', 'community/'))(routes) + 1].path;
    /* it might happen after selecting online filter that there are no online users as
      a result the array length will be 0
      but we still want to show the filters and layout switch menu
      so we could change the filters */
    const showLayoutSwitch =
      (users && users.length > 0) || this.onlineFilter !== null;

    const canEditCurrentGroup =
      group && group.created_by.member_id === user.member_id;

    const isExportManager = location.pathname.includes('export_manager');

    return (
      <div>
        {activeMember ? (
          <div className="assign-centre-eqa-view">
            <EqaAssignView
              onAssignEQAConfirm={(member_id, centre_id, params) =>
                this.props.assignEQA(member_id, centre_id, params)
              }
              {...{
                itemData: activeMember,
                routeRole,
                activeSection,
                onAssignCancel,
                assigningEQA,
                assignEQAStatus,
                users,
                eqaMember,
                setCentreID,
                goToPage: value => {
                  goToPage(value);
                  this.setState({
                    activeMember: null
                  });
                }
              }}
            />
          </div>
        ) : (
          <div>
            {!isExportManager && (
              <HeaderView
                {...{
                  openInviteModal,
                  openInviteIqaModal,
                  // openFriendModal,
                  openGroupModal,
                  openDeleteGroupModal,
                  openCreateGroupModal,
                  activeSection,
                  canEditCurrentGroup,
                  group,
                  openGroupChat: this.openGroupChat
                }}
              />
            )}
            {isExportManager && <ExportManagerHeader />}

            {/* Navigation */}
            <section className="content-section navigation-section">
              <div className="container">
                <UINavigation
                  active={activeSection}
                  change={e =>
                    this.setState({
                      activeSectionHacked: false,
                      selectedCentreID: null,
                      selectedTutorID: null
                    })
                  }
                  tabs={navTabs}
                  onSearch={value => onCommunitySearch(value)}
                />
              </div>
            </section>
            {isExportManager && <CommunityExportManager {...this.props} />}
            {!isExportManager && showLayoutSwitch && (
              <SwitchLayoutView
                {...{
                  handleLayoutChange,
                  activeLayout,
                  userType,
                  setOnlineFilter,
                  onlineFilter,
                  group,
                  usersTotal,
                  onGroupMemberFilterChange,
                  groupFilterType
                }}
              />
            )}
            {!isExportManager && (
              <div className="list-container community-explorer">
                {/* Community users */}
                <CommunityUsers
                  {...{
                    itemsPerPage: ITEMS_PER_PAGE,
                    activeLayout,
                    userType,
                    activeSection,
                    routeRole,
                    pageNumber,
                    goToPage,
                    openDeleteGroupModal,
                    openLoginAsMemberModal,
                    openGroupModal,
                    searchTerm,
                    oldApi,
                    groupToDeleteID,
                    onlineFilter,
                    attemptingUsersGet,
                    changeActiveSection,
                    onAssignEQA,
                    selectedCentreID,
                    selectedTutorID,
                    setCentreID,
                    setTutorID
                  }}
                />
                {/* Invite IQA modal */}
                <ContentModalNew
                  size="large"
                  ref={e => {
                    this.inviteIqaModal = e;
                  }}
                >
                  <ModalInviteIqa
                    {...{
                      activeSection
                    }}
                  />
                </ContentModalNew>
                {/* Invite a tutor modal */}
                <ContentModalNew
                  size="large"
                  ref={e => {
                    this.inviteModal = e;
                  }}
                >
                  <ModalInvite
                    {...{
                      routes,
                      routeRole,
                      closeModal: this.closeInviteModal
                    }}
                  />
                </ContentModalNew>
                {/* Manage group modal */}
                <ContentModalNew
                  className="manage-group-modal"
                  size="large"
                  height="auto"
                  onClose={this.clearGroupEdit}
                  ref={e => {
                    this.groupModal = e;
                  }}
                >
                  {!groupToEditAttempting && (
                    <ModalGroup
                      group={groupToEdit}
                      title={groupModalTitle}
                      onSave={() => {
                        goToPage(1, () => {
                          // If page number was not equal to 1 then
                          // we don't have to refresh it from here
                          // as it will be refreshed in componentWillReceiveProps
                          if (pageNumber !== 1) {
                            return;
                          }
                          if (groupToEdit && groupToEdit.group_id) {
                            dispatch(
                              Creators.communityUsersAttempt('group', {
                                groupID: groupToEdit.group_id,
                                limit: 15,
                                offset: 0
                              })
                            );
                          } else {
                            dispatch(Creators.communityUsersAttempt('groups'));
                          }
                        });
                      }}
                      closeModal={closeGroupModal}
                    />
                  )}
                  {groupToEditAttempting && (
                    <UILoading marginTop="100px" marginBottom="100px" />
                  )}
                </ContentModalNew>
                {/* Confirm group deletion modal */}
                <ContentModalNew
                  isOpened={this.state.modalDeleteGroupOpen}
                  className="confirm-delete-group-modal"
                  title="Delete group"
                  onClose={closeDeleteGroupModal}
                  footerComponent={
                    <div className="actions has-text-right p-25">
                      <button
                        className="button is-primary is-outlined"
                        onClick={closeDeleteGroupModal}
                      >
                        <Text iKey="cancel" />
                      </button>
                      <button
                        className={`button is-danger m-l-15 ${deletingGroup &&
                          'is-loading'}`}
                        onClick={deleteGroup}
                      >
                        <Text iKey="delete" />
                      </button>
                    </div>
                  }
                  ref={e => {
                    this.deleteGroupModal = e;
                  }}
                >
                  <div className="has-text-centered">
                    Are you sure you want to delete this group?
                  </div>
                </ContentModalNew>
                {/* Confirm group deletion modal */}
                <ContentModalNew
                  isOpened={this.state.modalLoginAsMemberOpen}
                  className="confirm-login-as-member-modal"
                  title="Login As Member"
                  onClose={() => this.closeLoginAsMemberModal()}
                  footerComponent={
                    <div className="actions is-centered p-25">
                      <button
                        className="button is-primary"
                        onClick={() => this.loginAsMember()}
                      >
                        <Text iKey="Confirm" />
                      </button>
                    </div>
                  }
                  ref={e => {
                    this.LoginAsMemberModal = e;
                  }}
                >
                  <div className="has-text-centered">
                    Are you sure you want to login as this member?
                  </div>
                </ContentModalNew>
                <ModalCreateGroup
                  {...{
                    user,
                    isOpen: createGroupModal,
                    onClose: this.closeCreateGroupModal,
                    searchGroupMembers,
                    groupUsers,
                    attemptingGroupUsers,
                    attemptingCreateGroup,
                    communityGroupCreate
                  }}
                />
                {/* Pagination */}
                {usersTotal ? (
                  <Pagination
                    itemsLength={parseInt(usersTotal)}
                    itemsPerPage={ITEMS_PER_PAGE}
                    maxPagesDisplayed={3}
                    initialPage={pageNumber - 1}
                    onPageChange={goToPage}
                    forcePage={pageNumber - 1}
                  />
                ) : null}
              </div>
            )}
            <Footer />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ community, profile: { user } }) => ({
  ...community,
  user
});

const mapDispatchToProps = dispatch => ({
  assignEQA: (member_id, centre_id, params) =>
    dispatch(CommunityActions.assignEqaAttempt(member_id, centre_id, params)),
  searchGroupMembers: params =>
    dispatch(CommunityActions.searchGroupMembersAttempt(params)),
  communityGroupCreate: params =>
    dispatch(CommunityActions.communityGroupCreateAttempt(params)),
  loginAsMemberAttempt: memberId =>
    dispatch(UserActions.loginAsMemberAttempt(memberId)),
  getGroup: (centre_id, group_id) =>
    dispatch(Creators.communityGetGroupAttempt(centre_id, group_id)),
  clearCommunityGroupEdit: () => dispatch(Creators.clearCommunityGroupEdit()),
  startChatAttempt: (members, screen_name, bool) =>
    dispatch(MessagingActions.startChatAttempt(members, screen_name, bool)),
  getEqaMember: memberId =>
    dispatch(CommunityActions.getEqaMemberAttempt(memberId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityExplorer);

// {/* Add a friend modal */}
// <ContentModalNew
// className="add-friends-modal"
// ref={e => {
//   this.friendModal = e;
// }}
// >
// <ModalFriends />
// </ContentModalNew>
