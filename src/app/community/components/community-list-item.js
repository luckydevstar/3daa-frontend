import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { contains, filter } from 'ramda';
import * as lodash from 'lodash';
import cx from 'classnames';

import common from 'app/common';
import { Creators as WorkbookActions } from 'app/workbooks/actions';
import { Roles } from 'app/core/config/constants';
import { Text } from 'app/intl';
import { Creators as AssessmentActions } from 'app/assessment/actions';

import CommunityProgressBadge from './community-progress-badge';

import TaskExplorer from './task-explorer';

const { SuperAdmin, CentreAdmin, CentreTutor, CentreLearner } = Roles;

const {
  util: {
    helpers: { isLearner, isEmptySeat, isGroup, getCommunityProfilePhotoId }
  }
} = common;

class CommuntyListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskViewOpened: false,
      taskTitle: '',
      taskDescription: '',
      taskActive: 0,
      taskContent: [],
      taskActivities: [],
      startDate: new Date(),
      dueDate: new Date()
    };
    this.toggleTaskView = this.toggleTaskView.bind(this);
    this.changeInputValue = this.changeInputValue.bind(this);
    this.changeTaskActive = this.changeTaskActive.bind(this);
    this.addTaskContent = this.addTaskContent.bind(this);
    this.removeTaskContent = this.removeTaskContent.bind(this);
    this.addTaskActivity = this.addTaskActivity.bind(this);
    this.updateDates = this.updateDates.bind(this);
    this.updateTaskState = this.updateTaskState.bind(this);
  }

  toggleTaskView() {
    const { getMemberTasks, userData } = this.props;
    const { taskViewOpened } = this.state;
    if (!taskViewOpened) {
      getMemberTasks(userData.member_id);
    }
    this.setState({ taskViewOpened: !taskViewOpened });
  }
  updateTaskState(
    taskTitle,
    taskDescription,
    taskActive,
    taskContent,
    taskActivities,
    startDate,
    dueDate
  ) {
    this.setState({
      taskTitle,
      taskDescription,
      taskActive,
      taskContent,
      taskActivities,
      startDate,
      dueDate
    });
  }
  updateDates(dates) {
    this.setState({
      startDate: dates[0],
      dueDate: dates[1]
    });
  }
  addTaskContent(file) {
    const { taskContent } = this.state;
    if (!taskContent.find(f => f.media_id === file.media_id)) {
      this.setState({
        taskContent: [...taskContent, file]
      });
    } else {
      this.removeTaskContent(file);
    }
  }
  removeTaskContent(file) {
    const { taskContent } = this.state;
    const filteredTaskContent = filter(
      item => item.media_id !== file.media_id,
      taskContent
    );
    this.setState({
      taskContent: filteredTaskContent
    });
  }
  addTaskActivity(activityId) {
    const { taskActivities } = this.state;
    this.setState({
      taskActivities: [...taskActivities, activityId]
    });
  }
  changeTaskActive() {
    const { taskActive } = this.state;
    this.setState({
      taskActive: taskActive === 0 ? 1 : 0
    });
  }
  changeInputValue(name, e) {
    this.setState({
      [name]: e.target.value
    });
  }

  render() {
    const {
      taskViewOpened,
      taskTitle,
      taskDescription,
      taskActive,
      taskContent,
      startDate,
      dueDate,
      taskActivities
    } = this.state;
    const {
      userData,
      canSeeOthersProgress,
      canAccessWorkbooks,
      seenByTutor,
      seenByMemberId,
      seenByGlobalAdmin,
      openChat,
      activeSection,
      openDeleteGroupModal,
      openLoginAsMemberModal,
      role,
      onRemoveButtonClick,
      onSuspendUser,
      setCentreID,
      setTutorID,
      onAssignEQA,
      tasks,
      activities,
      authorTaskCreateAttempt,
      attemptionAuthorTasks,
      user,
      authorFileUploadAttempt,
      files,
      attemptingAuthorFileUpload,
      openMediaAddModal,
      authorTaskUpdateAttempt,
      isLogin,
      setAssessmentMember,
      setAssessWorkbooksActiveLearnerId,
      openGroupChat,
      showCentres,
      onMemberSelect
    } = this.props;
    {
      const {
        cloudinary_file_id,
        member_id,
        centre_id,
        online,
        screen_name,
        date_of_birth,
        title,
        created_by,
        current_qualification,
        group_id,
        total,
        gender,
        groups_count,
        number_of_learners,
        progress_percentage,
        uln,
        centre_name,
        approved_percentage
      } = userData;
      let sector;
      let short_title;
      let qualification_title;
      const user_progress = progress_percentage || 0;
      if (current_qualification) {
        sector = current_qualification.sector;
        short_title = current_qualification.short_title;
        qualification_title = current_qualification.title;
      }
      const qualification_id =
        lodash.get(current_qualification, 'qualification_id') || 0;
      const checkOnline = parseInt(online);
      const isEmptySeatItem = isEmptySeat(userData);
      const isLearnerItem = isLearner(userData);

      const isGroupItem = isGroup(userData);
      const canEditGroup = isGroupItem && created_by === seenByMemberId;

      const showPercentage = contains(activeSection, ['learners']);

      // const showChat = seenByGlobalAdmin || (!isEmptySeatItem && !isLearnerItem);
      const showChat = true;
      const showWorkbooks =
        isLearnerItem && canAccessWorkbooks && !seenByGlobalAdmin;

      const profilePhotoId = getCommunityProfilePhotoId(userData);

      const handleAssessClick = () => {
        browserHistory.push(`/bookstand/assess/${member_id}`);
        setAssessWorkbooksActiveLearnerId(member_id);
      };

      const handlePortfolioClick = () => {
        if (qualification_id) {
          setAssessmentMember(userData);
          browserHistory.push(`/assessment/qualification-progress`);
        } else {
          alert('No qualification!');
        }
      };

      let isShowSuspend;
      if (!contains(activeSection, ['super-admins', 'site-admins', 'eqas'])) {
        isShowSuspend =
          role === SuperAdmin ||
          role === CentreAdmin ||
          (role === CentreTutor && activeSection === 'learners');
      }

      const isShowDelete =
        role === SuperAdmin ||
        role === CentreAdmin ||
        (role === CentreTutor && activeSection === 'groups');

      const showPortfolio =
        contains(activeSection, ['learners']) && role !== CentreLearner;
      const isEQACard =
        contains(activeSection, ['eqas']) && role === SuperAdmin;

      const isShowTask =
        contains(activeSection, ['learners', 'groups']) && role === CentreTutor;

      let showViewLearners;
      if (contains(activeSection, ['centre-tutors', 'centre-admins'])) {
        showViewLearners = !contains(role, [CentreTutor, CentreLearner]);
      }
      const showAssignEQA =
        contains(activeSection, ['centre-admins']) && role === SuperAdmin;

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

      const loginAble =
        isLogin && activeSection !== 'groups' && role === SuperAdmin;

      const isBookstand =
        contains(activeSection, ['learners', 'groups']) && role === CentreTutor;

      const navTabs = [
        {
          key: 'active-tasks'
        },
        {
          key: 'planned-tasks'
        },
        {
          key: 'archived-tasks'
        }
      ];
      return (
        // expandTaskView,
        // taskViewStatus
        <tr
          className={`community-list-item ${
            taskViewOpened ? 'expand-task' : null
          }`}
        >
          {!isEmptySeatItem && !isGroupItem && hasCompleted && (
            <td className="body-completed">
              <div className="body-completed__inner">
                <CommunityProgressBadge
                  {...{
                    cloudinary_file_id,
                    profilePhotoId,
                    canSeeOthersProgress,
                    progress_percentage: approved_percentage,
                    isLearner: isLearnerItem,
                    gender
                  }}
                />
              </div>
            </td>
          )}
          {!isEmptySeatItem && !isGroupItem && hasApproved && (
            <td className="body-approved">
              <div className="body-approved__inner">
                <CommunityProgressBadge
                  {...{
                    cloudinary_file_id,
                    profilePhotoId,
                    canSeeOthersProgress,
                    progress_percentage: user_progress,
                    isLearner: isLearnerItem,
                    gender
                  }}
                />
              </div>
            </td>
          )}
          <td>
            <div className={cx({ columns: !hasApproved && !hasCompleted })}>
              <div
                className={cx({
                  'column no-grow': !hasApproved && !hasCompleted
                })}
              >
                {!isEmptySeatItem && !isGroupItem && !hasApproved && (
                  <CommunityProgressBadge
                    {...{
                      cloudinary_file_id,
                      profilePhotoId,
                      canSeeOthersProgress,
                      progress_percentage: user_progress,
                      isLearner: isLearnerItem,
                      gender
                    }}
                  />
                )}
                {/* TODO implement overlay in the ProgressBadge with props
                overlay:bool overlayColor:string */}
                {!isEmptySeatItem && !isGroupItem && (
                  <div className="image overlay">
                    <div className="value">
                      {canSeeOthersProgress
                        ? user_progress && `${Math.round(user_progress)}%`
                        : 0}
                    </div>
                  </div>
                )}
              </div>
              <div
                className={cx({ 'column name': !hasApproved && !hasCompleted })}
              >
                {!isEmptySeatItem &&
                  ((isGroupItem && title) || (
                    <div>
                      {activeSection === 'centre-admins' && (
                        <div className="semibold">{centre_name}</div>
                      )}
                      {activeSection !== 'centre-admins' && (
                        <div className="semibold">{screen_name}</div>
                      )}
                      {!uln && (
                        <div className="reg-id">
                          <Text iKey="registration_id" /> {member_id}
                        </div>
                      )}
                      {uln && (
                        <div className="reg-id">
                          <Text iKey="ULN" />: {uln}
                        </div>
                      )}
                    </div>
                  ))}
                {isEmptySeatItem && <Text iKey="empty_seat" />}
              </div>
            </div>
          </td>
          {!isEmptySeatItem && !isGroupItem && hasSector && (
            <td>{sector || 'n/a'}</td>
          )}
          {!isEmptySeatItem && !isGroupItem && hasQualification && (
            <td>{qualification_title || 'n/a'}</td>
          )}
          {!isEmptySeatItem && !isGroupItem && hasPreferences && (
            <td>{'n/a'}</td>
          )}
          {!isEmptySeatItem && !isGroupItem && hasLearners && (
            <td className="has-text-right">{number_of_learners || 0}</td>
          )}
          {!isEmptySeatItem && !isGroupItem && hasGroups && (
            <td className="has-text-right">{groups_count || 0}</td>
          )}
          {/* {!isEmptySeatItem && !isGroupItem && isLearnerItem && showPercentage && (
            <td className="text-center">
              {progress_percentage ? `${Math.round(progress_percentage)}%` : 0}
            </td>
          )} */}
          {!isEmptySeatItem && !isGroupItem && (
            <td>
              <div className="columns text-center">
                {/* {showWorkbooks && (
                  <div className="column action">
                    <div onClick={() => handleAssessClick(member_id)}>
                      <div className="action-workbook" />
                      <div className="action-title">
                        {seenByTutor ? (
                          <div>
                            {' '}
                            <Text iKey="assess" /> <Text iKey="workbooks" />{' '}
                          </div>
                        ) : (
                          <div>
                            {' '}
                            <Text iKey="view" /> <Text iKey="workbooks" />{' '}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )} */}

                {loginAble && (
                  <div className="column action">
                    <Link onClick={() => openLoginAsMemberModal(member_id)}>
                      <div className="action-login" />
                      <div className="action-title">
                        <Text iKey="Login" />
                      </div>
                    </Link>
                  </div>
                )}

                {isEQACard && (
                  <div className="column action">
                    <Link onClick={() => onAssignEQA(member_id)}>
                      <div className="action-assign" />
                      <div className="action-title">
                        <Text iKey="Assign Centre" />
                      </div>
                    </Link>
                  </div>
                )}

                {isShowSuspend && (
                  <div className="column action">
                    <Link onClick={() => onSuspendUser(member_id)}>
                      <div className="action-suspend" />
                      <div className="action-title">
                        <Text iKey="Suspend" />
                      </div>
                    </Link>
                  </div>
                )}

                {isBookstand && (
                  <div className="column action">
                    <Link onClick={handleAssessClick}>
                      <div className="action-portfolio2" />
                      <div className="action-title">
                        <Text iKey="Bookstand" />
                      </div>
                    </Link>
                  </div>
                )}

                {showViewLearners && (
                  <div className="column action">
                    <Link
                      onClick={() => {
                        if (contains(role, [CentreAdmin])) {
                          setTutorID(member_id);
                        } else {
                          setCentreID(centre_id);
                        }
                        browserHistory.push(`/community/learners`);
                      }}
                    >
                      <div className="action-group2" />
                      <div className="action-title">
                        <Text iKey="Learners" />
                      </div>
                    </Link>
                  </div>
                )}

                {isEQACard && (
                  <div className="column action">
                    <div onClick={onMemberSelect}>
                      <div className="action-centre" />
                      <div className="action-title">
                        <Text iKey="Centres" />
                      </div>
                    </div>
                  </div>
                )}

                {showAssignEQA && (
                  <div className="column action">
                    <Link onClick={() => onAssignEQA(member_id)}>
                      <div className="action-add" />
                      <div className="action-title">
                        <Text iKey="Assign EQA" />
                      </div>
                    </Link>
                  </div>
                )}

                {isShowTask && window.location.href.includes('testing') && (
                  <div className="column action">
                    <Link onClick={this.toggleTaskView}>
                      <div className="action-task" />
                      <div className="action-title">
                        <Text iKey="task" />
                      </div>
                    </Link>
                  </div>
                )}

                {showPortfolio && window.location.href.includes('testing') && (
                  <div className="column action">
                    <Link onClick={() => handlePortfolioClick()}>
                      <div className="action-portfolio2" />
                      <div className="action-title">
                        <Text iKey="Portfolio" />
                      </div>
                    </Link>
                  </div>
                )}

                {/* {showCalendar && (
                  <div className="column action">
                    <Link>
                      <div className="action-calendar" />
                      <div className="action-title">
                        <Text iKey="calendar" />
                      </div>
                    </Link>
                  </div>
                )} */}

                {showChat && (
                  <div
                    className="column action"
                    onClick={() => openChat(userData, screen_name)}
                  >
                    <div className="action-message" />
                    <div className="action-title">
                      <Text iKey="message" />
                    </div>
                  </div>
                )}
                <div className="column action">
                  <Link to={`/profile/${member_id}`}>
                    <div className="action-profile">
                      {/*gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />*/}
                    </div>
                    <div className="action-title">
                      <Text iKey="profile" />
                    </div>
                  </Link>
                </div>
                {isShowDelete && (
                  <div
                    className="column action"
                    onClick={() => onRemoveButtonClick(member_id)}
                  >
                    <div className="action-remove" />
                    <div className="action-title">
                      <Text iKey="Delete" />
                    </div>
                  </div>
                )}
              </div>
            </td>
          )}
          {isGroupItem && (
            <td>
              {`${total} `}
              <Text iKey="member" />
              {`${total > 1 ? 's' : ''}`}
            </td>
          )}
          {isGroupItem && (
            <td>
              <div className="columns text-center">
                {isShowTask && window.location.href.includes('testing') && (
                  <div
                    className="column action"
                    onClick={() => alert('Assign Task')}
                  >
                    <div className="action-task" />
                    <div className="action-title">Assign Task</div>
                  </div>
                )}
                <div
                  className="column action"
                  onClick={() => alert('Add group')}
                >
                  <div className="action-add" />
                  <div className="action-title">Add User</div>
                </div>
                <div
                  className="column action"
                  onClick={() => openGroupChat(userData)}
                >
                  <div className="action-message" />
                  <div className="action-title">Message</div>
                </div>
                <div
                  className="column action"
                  onClick={() => {
                    browserHistory.push(`/community/groups/${group_id}`);
                  }}
                >
                  <div className="action-group2" />
                  <div className="action-title">
                    <Text iKey="view_group" />
                  </div>
                </div>
                {/* {canEditGroup && ( */}
                <div
                  className="column action"
                  onClick={() => openDeleteGroupModal(group_id)}
                >
                  <div className="action-remove" />
                  <div className="action-title">
                    <Text iKey="remove_group" />
                  </div>
                </div>
                {/* )} */}
              </div>
            </td>
          )}

          {/* !isEmptySeatItem &&
            <td className="has-text-centered">
              <div className="user-type">{type}</div>
            </td> */}

          {!isEmptySeatItem && !isGroupItem && (
            <td className="text-center dot-container">
              <div className={checkOnline ? 'dot dot-green' : 'dot dot-red'} />
              <div className="status">
                {checkOnline ? <Text iKey="online" /> : <Text iKey="offline" />}
              </div>
            </td>
          )}
          {isEmptySeatItem && !isGroupItem && (
            <td className="has-text-center">{member_id}</td>
          )}
          {isEmptySeatItem && !isGroupItem && (
            <td className="has-text-center">{date_of_birth || '99/99/1999'}</td>
          )}
          {taskViewOpened && (
            <TaskExplorer
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
                tasks,
                activities,
                user,
                authorTaskCreateAttempt,
                attemptionAuthorTasks,
                taskTitle,
                taskDescription,
                taskActive,
                authorFileUploadAttempt,
                files,
                attemptingAuthorFileUpload,
                taskContent,
                startDate,
                dueDate,
                openMediaAddModal,
                authorTaskUpdateAttempt,
                taskActivities,
                addTaskContent: this.addTaskContent,
                changeInputValue: this.changeInputValue,
                changeTaskActive: this.changeTaskActive,
                removeTaskContent: this.removeTaskContent,
                addTaskActivity: this.addTaskActivity,
                updateDates: this.updateDates,
                updateTaskState: this.updateTaskState
              }}
              toggleTaskView={this.toggleTaskView}
            />
          )}
        </tr>
      );
    }
  }
}

CommuntyListItem.propTypes = {
  showCalendar: PropTypes.bool,
  showTask: PropTypes.bool
};

CommuntyListItem.defaultProps = {
  showCalendar: false,
  showTask: false
};

const mapDispatchToProps = dispatch => ({
  setAssessmentMember: member =>
    dispatch(AssessmentActions.setAssessmentMember(member)),
  setAssessWorkbooksActiveLearnerId: member_id =>
    dispatch(WorkbookActions.setAssessWorkbooksActiveLearnerId(member_id))
});

export default connect(null, mapDispatchToProps)(CommuntyListItem);
