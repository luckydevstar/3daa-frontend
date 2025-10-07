import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { contains } from 'ramda';

import common from 'app/common';
import { Text } from 'app/intl';

import { Creators as CommunityActions } from '../actions';

import ListItem from './community-list-item';
import EqaListItem from './eqa-assign-list-item';
import SortHeading from './community-list-sortHeading';
import CommunityMediaAdd from './community-media-add';

const {
  components: { ContentModalNew, UILoading },
  util: {
    helpers: { isEmptySeat, isGroup }
  }
} = common;

import { isSelected } from '../helpers';

class CommunityListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaAddModal: false,
      memberId: '',
      selectedMember: null
    };
    this.closeMediaAddModal = this.closeMediaAddModal.bind(this);
    this.openMediaAddModal = this.openMediaAddModal.bind(this);
    this.uploadClick = this.uploadClick.bind(this);
    this.selectMember = this.selectMember.bind(this);
  }
  componentDidUpdate(prevProps) {
    const { attemptingAuthorFileUpload } = this.props;
    const { mediaAddModal } = this.state;
    if (
      !attemptingAuthorFileUpload &&
      prevProps.attemptingAuthorFileUpload &&
      mediaAddModal
    ) {
      this.closeMediaAddModal();
    }
  }
  closeMediaAddModal() {
    this.setState({ mediaAddModal: false });
  }
  openMediaAddModal() {
    this.setState({ mediaAddModal: true });
  }
  uploadClick(memberId) {
    this.setState({
      mediaAddModal: false,
      memberId
    });
  }
  selectMember(memberId) {
    this.setState({
      selectedMember: memberId
    });
    this.props.getEqaMember(memberId);
  }
  render() {
    const {
      sortSettings,
      toggleSortBy,
      users,
      canAccessWorkbooks,
      seenByTutor,
      seenByMemberId,
      seenByGlobalAdmin,
      canSeeOthersProgress,
      openChat,
      activeSection,
      openDeleteGroupModal,
      openLoginAsMemberModal,
      role,
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
      expandTaskView,
      taskViewStatus,
      getMemberTasks,
      tasks,
      activities,
      authorTaskCreateAttempt,
      user: userObj,
      attemptionAuthorTasks,
      authorFileUploadAttempt,
      attemptingAuthorFileUpload,
      files,
      authorTaskUpdateAttempt,
      isLogin,
      openGroupChat,
      eqaMemberLoading,
      eqaMember
    } = this.props;

    const { mediaAddModal } = this.state;

    /* currently table columns are dynamic and dependent on the user role
      as a result it number columns should match the table headings
      so constructing the table header based on the role of one user
      as all roles will be the same anyway */

    const user = users[0];

    const isEmptySeatCard = isEmptySeat(user);
    // const hasProgress = isLearner(user) && activeSection === 'learners';
    const hasProgress = false;
    const isGroupData = isGroup(user);

    const hasQualification = !contains(activeSection, [
      'super-admins',
      'site-admins',
      'centre-tutors',
      'eqas',
      'centre-admins'
    ]);
    const hasSector = !contains(activeSection, [
      'centre-tutors',
      'super-admins',
      'site-admins',
      'eqas'
    ]);
    const hasLearners = contains(activeSection, ['centre-admins']);
    const hasGroups = false;
    const hasPreferences = contains(activeSection, [
      'super-admins',
      'site-admins'
    ]);
    const hasApproved = contains(activeSection, ['learners']);
    const hasCompleted = contains(activeSection, ['learners']);

    const getSortingHeadings = () => {
      let sortHeadingList = Object.keys(sortSettings);

      sortHeadingList = hasProgress
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'progress_percentage');

      sortHeadingList = hasQualification
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'qualification');

      sortHeadingList = hasSector
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'sector');

      sortHeadingList = hasLearners
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'learners');

      sortHeadingList = hasGroups
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'groups');

      sortHeadingList = hasPreferences
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'preferences');

      sortHeadingList = hasApproved
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'approved');

      sortHeadingList = hasCompleted
        ? sortHeadingList
        : sortHeadingList.filter(heading => heading !== 'completed');

      return sortHeadingList.map(key => {
        const config = sortSettings[key];
        const { name, sortOrder, active, sortable } = config;
        return (
          <th className={`heading-${key.split('_')[0]}`} key={key}>
            <Text iKey={name} />
            {sortable && (
              <SortHeading
                sortProp={key}
                {...{ toggleSortBy, sortOrder, active }}
              />
            )}
          </th>
        );
      });
    };

    return (
      <section className="community-list-view">
        <table
          className={classNames('table', {
            'emptySeat-table': isEmptySeatCard
          })}
        >
          {!showCheckbox && (
            <thead>
              {isGroupData && (
                <tr>
                  <th className="group-title">
                    <Text iKey="group_title" />
                  </th>
                  <th className="group-members">
                    <Text iKey="group_members" />
                  </th>
                  <th className="goup-actions">
                    <Text iKey="actions" />
                  </th>
                </tr>
              )}
              {!isEmptySeatCard && !isGroupData && (
                <tr>{getSortingHeadings()}</tr>
              )}
              {isEmptySeatCard && !isGroupData && (
                <tr>
                  <th className="emptySeat-name" />
                  <th className="emptySeat-registration-nr">
                    <Text iKey="registration_number" />{' '}
                  </th>
                  <th className="emptySeat-DOB">
                    <Text iKey="date_of_birth" />
                  </th>
                </tr>
              )}
            </thead>
          )}
          {showCheckbox ? (
            <tbody>
              {users.map(userData => (
                <EqaListItem
                  key={
                    userData.member_id ||
                    userData.group_id ||
                    userData.registration_number
                  }
                  {...{
                    userData,
                    canAccessWorkbooks,
                    seenByTutor,
                    seenByMemberId,
                    seenByGlobalAdmin,
                    canSeeOthersProgress,
                    openChat,
                    activeSection,
                    openDeleteGroupModal,
                    role,
                    onRemoveButtonClick,
                    onRemoveFromGroupButtonClick,
                    showCheckbox,
                    showCalendar,
                    showTask,
                    selected: isSelected(userData, selectedItems)
                  }}
                  onChange={e => onChange(e, userData)}
                />
              ))}
            </tbody>
          ) : (
            <tbody>
              {users.map(userData => (
                <React.Fragment>
                  <ListItem
                    key={
                      userData.member_id ||
                      userData.group_id ||
                      userData.registration_number ||
                      userData.centre_id
                    }
                    {...{
                      userData,
                      canAccessWorkbooks,
                      seenByTutor,
                      seenByMemberId,
                      seenByGlobalAdmin,
                      canSeeOthersProgress,
                      openChat,
                      activeSection,
                      openDeleteGroupModal,
                      openLoginAsMemberModal,
                      role,
                      onRemoveButtonClick,
                      onRemoveFromGroupButtonClick,
                      showCheckbox,
                      showCalendar,
                      showTask,
                      onSuspendUser,
                      selected: isSelected(userData, selectedItems),
                      setCentreID,
                      setTutorID,
                      onAssignEQA,
                      expandTaskView,
                      taskViewStatus,
                      getMemberTasks,
                      tasks,
                      activities,
                      authorTaskCreateAttempt,
                      user: userObj,
                      attemptionAuthorTasks,
                      authorFileUploadAttempt,
                      files,
                      attemptingAuthorFileUpload,
                      authorTaskUpdateAttempt,
                      openMediaAddModal: this.openMediaAddModal,
                      isLogin,
                      openGroupChat,
                      onMemberSelect: () =>
                        this.selectMember(userData.member_id)
                    }}
                    onChange={e => onChange(e, userData)}
                  />
                  {this.state.selectedMember === userData.member_id && (
                    <tr>
                      <td colSpan={8} className="list-item-centres-wrapper">
                        <div className="list-item-centres">
                          {eqaMemberLoading && (
                            <div className="list-item-centres__loading">
                              <UILoading />
                            </div>
                          )}
                          {!eqaMemberLoading && eqaMember && eqaMember.centres && (
                            <div>
                              {eqaMember.centres.map(centre => (
                                <div className="list-item-centre">
                                  <div className="list-item-centre__content">
                                    <img
                                      className="list-item-centre__logo"
                                      src={centre.logo}
                                      alt=""
                                    />
                                    <div className="list-item-centre__name">
                                      {centre.screen_name || centre.centre_name}
                                    </div>
                                  </div>
                                  <div className="list-item-centre__actions">
                                    <div className="list-item-centre__action">
                                      <div className="action-remove" />
                                      <div className="action-title">Remove</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          )}
        </table>
        <ContentModalNew
          isOpened={mediaAddModal}
          onClose={this.closeMediaAddModal}
        >
          <CommunityMediaAdd
            authorFileUploadAttempt={authorFileUploadAttempt}
            attemptingAuthorFileUpload={attemptingAuthorFileUpload}
            memberId={userObj.member_id}
          />
        </ContentModalNew>
      </section>
    );
  }
}

CommunityListView.propTypes = {
  showCalendar: PropTypes.bool,
  showTask: PropTypes.bool
};

CommunityListView.defaultProps = {
  showCalendar: true,
  showTask: true
};

const mapStateToProps = ({ community }) => ({
  ...community
});

const mapDispatchToProps = dispatch => ({
  getEqaMember: memberId =>
    dispatch(CommunityActions.getEqaMemberAttempt(memberId))
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityListView);
