import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as lodash from 'lodash';
import { Creators as CommunityActions } from 'app/community/actions';
import { Creators as UserActions } from 'app/user/actions';
import CommunityUsers from 'app/community/containers/community-users';
import common from 'app/common';
import { Text } from 'app/intl';
import { Roles } from 'app/core/config/constants';

import { HeaderView } from '../components';

import { SwitchLayoutView } from 'app/community/components';

const {
  components: { Pagination, Footer, ContentModalNew, UINavigation },
  util: {
    helpers: { checkRolesAndPermissions }
  }
} = common;

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin
} = Roles;

const ITEMS_PER_PAGE = 15;

const NavTabs = [
  {
    key: 'learners',
    text: 'learners',
    userType: 'centre',
    routeRole: CentreLearner
  },
  {
    key: 'groups',
    text: 'groups',
    userType: 'group',
    routeRole: null
  }
];

class AssessmentSelectUserRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLayout: 'list',
      activeTabKey: 'learners',
      pageNumber: 1,
      searchTerm: null,
      onlineFilter: null,
      modalLoginAsMemberOpen: false,
      selectedMemberID: null
    };

    this.goToPage = this.goToPage.bind(this);
    this.onCommunitySearch = this.onCommunitySearch.bind(this);
    this.setOnlineFilter = this.setOnlineFilter.bind(this);
    this.onGroupMemberFilterChange = this.onGroupMemberFilterChange.bind(this);

    this.openLoginAsMemberModal = this.openLoginAsMemberModal.bind(this);
    this.closeLoginAsMemberModal = this.closeLoginAsMemberModal.bind(this);
    this.loginAsMember = this.loginAsMember.bind(this);
  }

  UNSAFE_componentWillMount() {
    // const { dispatch } = this.props;
    // dispatch(CommunityActions.communityUsersSuccess(null, 0));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {
    // this.props.dispatch(CommunityActions.communityUsersSuccess(null, 0));
  }

  // Component helper funcs

  onCommunitySearch(term) {
    this.setState({
      pageNumber: 1,
      searchTerm: term
    });
  }

  onGroupMemberFilterChange({ target: { value } }) {
    const { dispatch } = this.props;
    dispatch(CommunityActions.communityGroupChangeFilterType(value));
  }

  setOnlineFilter(onlineFilter) {
    this.setState({
      onlineFilter
    });
  }

  // Switch to section page
  goToPage(pageNumber, setStateCallback = () => {}) {
    this.setState({ pageNumber }, setStateCallback());
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

  // Render me papi
  render() {
    // Props
    const {
      user,
      users,
      routes,
      attemptingUsersGet,
      usersTotal,
      groupFilterType,
      group,
      dispatch
    } = this.props;

    // State
    const {
      activeLayout,
      activeTabKey,
      pageNumber,
      searchTerm,
      groupToDeleteID,
      onlineFilter
    } = this.state;

    const activeTab = lodash.find(NavTabs, t => t.key == activeTabKey);
    const userType = activeTab.userType;
    const routeRole = activeTab.routeRole;
    const oldApi = null;

    // Callbacks
    const {
      goToPage,
      onCommunitySearch,
      setOnlineFilter,
      onGroupMemberFilterChange,
      openLoginAsMemberModal
    } = this;

    return (
      <div>
        <HeaderView showDownloadCV={false} />

        {/* Navigation */}
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active={activeTabKey}
              tabs={NavTabs}
              change={e => this.setState({ activeTabKey: e })}
              onSearch={value => onCommunitySearch(value)}
            />
          </div>
        </section>

        <SwitchLayoutView
          {...{
            activeLayout,
            userType,
            routeRole,
            setOnlineFilter,
            onlineFilter,
            group,
            groupFilterType
          }}
          canChangeLayout={false}
        />

        <div className="list-container community-explorer">
          {/* Community users */}
          <CommunityUsers
            {...{
              itemsPerPage: ITEMS_PER_PAGE,
              activeLayout,
              userType,
              routeRole,
              pageNumber,
              goToPage,
              searchTerm,
              oldApi,
              onlineFilter,
              attemptingUsersGet,
              openLoginAsMemberModal
            }}
            canAccessWorkbooks={false}
            showCalendar={true}
            showTask={true}
            showPortfolio={true}
            activeSection={activeTabKey}
            isLogin={false}
          />

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
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ community, profile: { user } }) => ({
  ...community,
  user
});

const mapDispatchToProps = dispatch => ({
  loginAsMemberAttempt: memberId =>
    dispatch(UserActions.loginAsMemberAttempt(memberId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentSelectUserRoute);
