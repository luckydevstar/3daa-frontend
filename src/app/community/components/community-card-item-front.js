import React from 'react';
import classNames from 'classnames';
import common from 'app/common';
import { Link, browserHistory } from 'react-router';
import { RoleNameMap, Roles } from 'app/core/config/constants';
import CommunityProgressBadge from './community-progress-badge';
import { contains } from 'ramda';
import * as lodash from 'lodash';
import { Text, Unit } from 'app/intl';
import Isvg from 'react-inlinesvg';

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';
import IconRemove from 'images/icon_remove.svg';
import IconSuspend from 'images/icon_suspend.svg';
import IconPeople from 'images/icon_group.svg';
import IconTask from 'images/icon_task.svg';
import IconCentres from 'images/icon_centres.svg';
import IconCentreDefault from 'images/icon_centre_default.svg';
import IconPortfolio from 'images/icon_portfolio_blue.svg';

const {
  SuperAdmin,
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  CentreEQA,
  CentreIQA
} = Roles;

const {
  getCommunityProfilePhotoUrl,
  extractUserRole,
  isEmptySeat,
  isGroup,
  isLearner,
  getCommunityProfilePhotoId
} = common.util.helpers;
const { UICheckbox } = common.components;

const FrontView = ({
  itemData,
  activeSection,
  seenByGlobalAdmin,
  canAccessWorkbooks,
  seenByMemberId,
  canSeeOthersProgress,
  openChat,
  openGroupChat,
  openDeleteGroupModal,
  openLoginAsMemberModal,
  openGroupModal,
  role,
  onRemoveButtonClick,
  onRemoveFromGroupButtonClick,
  onSuspendUser,
  onAssignEQA,
  showCheckbox,
  selected,
  onChange,
  setCentreID,
  setTutorID,
  setAssessmentMember,
  setAssessWorkbooksActiveLearnerId,
  attemptingCreateGroupChat
}) => {
  // Item data
  const {
    member_id,
    centre_roles,
    centre_id,
    centre_name,
    roles,
    gender,
    online,
    screen_name,
    current_qualification,
    qualification_title,
    date_of_birth,
    title,
    created_by,
    group_id,
    total,
    cloudinary_file_id,
    registration_number,
    number_of_learners,
    progress_percentage,
    approved_percentage,
    member_count,
    groups_count,
    uln
  } = itemData;

  const user_progress = progress_percentage || 0;
  let sector;
  if (current_qualification) {
    sector = current_qualification.sector;
  }
  const qualification_id =
    lodash.get(current_qualification, 'qualification_id') || 0;
  // Get user's sector
  const isEmptySeatCard = isEmptySeat(itemData);
  const isLearnerCard = isLearner(itemData);

  const isGroupCard = isGroup(itemData);
  const siteAdminsTab = contains(activeSection, [
    'super-admins',
    'site-admins',
    'eqas'
  ]);
  const userRole = extractUserRole(itemData);

  const centreRole =
    !isEmptySeatCard && !isGroupCard && centre_roles && centre_roles.length > 0
      ? centre_roles[0]
      : undefined;

  const globalRole = roles && roles[0];
  const centreRoleString = centreRole && RoleNameMap[centreRole];
  const globalRoleString = globalRole && RoleNameMap[globalRole];
  const roleString = siteAdminsTab ? globalRoleString : centreRoleString;

  const showChat = !isEmptySeatCard;

  const profilePhotoUrl = getCommunityProfilePhotoUrl(itemData);
  const profilePhotoId = getCommunityProfilePhotoId(itemData);

  const handleAssessClick = () => {
    browserHistory.push(`/bookstand/assess/${member_id}`);
    setAssessWorkbooksActiveLearnerId(member_id);
  };

  const handlePortfolioClick = () => {
    if (qualification_id) {
      setAssessmentMember(itemData);
      browserHistory.push(`/assessment/qualification-progress`);
    } else {
      alert('No qualification!');
    }
  };

  let isShowSuspend;
  if (!contains(activeSection, ['super-admins', 'site-admins'])) {
    isShowSuspend =
      role === SuperAdmin ||
      role === CentreAdmin ||
      (role === CentreTutor && activeSection === 'learners');
  }

  let isShowViewLearners;
  if (activeSection === 'centre-admins' || activeSection === 'centre-tutors') {
    isShowViewLearners = contains(role, [SuperAdmin, CentreAdmin, CentreEQA]);
  }

  const isShowDelete =
    role === SuperAdmin || (role === CentreAdmin && activeSection !== 'eqas');

  const isShowRemoveFromGroup =
    activeSection === 'groups' &&
    (role === SuperAdmin || role === CentreTutor || role === CentreAdmin);

  const isEqaCard = activeSection === 'eqas';
  const isEqaRelated =
    role === SuperAdmin && (activeSection === 'centre-admins' || isEqaCard);

  const isCentreCard = activeSection === 'centre-admins';

  const isShowSector =
    (activeSection === 'learners' &&
      contains(role, [CentreTutor, CentreLearner, SuperAdmin])) ||
    (activeSection === 'centre-tutors' && role === CentreLearner);

  const isShowTask =
    contains(activeSection, ['learners', 'groups']) && role === CentreTutor;

  const isShowPortfolio =
    contains(activeSection, ['learners']) && role !== CentreLearner;

  const isShowQualification =
    activeSection === 'groups' && role === CentreTutor;

  const canLoginAsMember = activeSection !== 'groups' && role === SuperAdmin;

  const isBookstand =
    contains(activeSection, ['learners', 'groups']) &&
    contains(role, [CentreTutor, CentreEQA, CentreIQA]);

  const isShowViewCentres = contains(activeSection, ['eqas']);

  return (
    <div className="front-view">
      <div className="inner">
        {roleString && (
          <div className="user-role has-text-centered">
            <button
              className={classNames('button is-medium is-rounded', {
                'is-primary': !isEqaCard,
                'is-secondary': isEqaCard
              })}
            >
              <Text iKey={roleString} />
            </button>
          </div>
        )}

        {/* TODO replace this with a live Cloudinary ID from the API */}
        <div
          className={classNames('no-image', {
            'is-third': isEqaCard
          })}
        >
          {isCentreCard ? (
            <Isvg className="is-centre" src={IconCentreDefault} />
          ) : (
            <div>
              {gender === 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />}
            </div>
          )}
        </div>
        <div
          className={classNames('cover-photo', {
            'photo-exists': !isEmptySeatCard && cloudinary_file_id
          })}
          style={{
            backgroundImage:
              !isEmptySeatCard && cloudinary_file_id
                ? `url(${profilePhotoUrl})`
                : ''
          }}
        />
        <div className="description">
          <CommunityProgressBadge
            {...{
              cloudinary_file_id,
              profilePhotoId,
              canSeeOthersProgress,
              progress_percentage: user_progress,
              isLearner: isLearnerCard,
              gender,
              isCentreCard
            }}
          />

          <div className="approved-percentage__hover">
            {approved_percentage}% Approved
          </div>

          {/* Card header/basic information */}

          {!isEmptySeatCard && !isGroupCard && (
            <div className={classNames('status', { online })}>
              {online ? <Text iKey="online" /> : <Text iKey="offline" />}
            </div>
          )}
          <div
            className={classNames('screen-name-link', {
              'screen-name-link-centre': activeSection === 'centre-admins'
            })}
          >
            {activeSection === 'centre-admins' && (
              <div
                className="title centre-title"
                title={isGroupCard ? title : centre_name}
              >
                {isGroupCard ? title : centre_name}
              </div>
            )}
            {activeSection !== 'centre-admins' && (
              <div className="title" title={isGroupCard ? title : screen_name}>
                {isGroupCard ? title : screen_name}
              </div>
            )}
            {/* // login as member */}
            {!isGroupCard &&
              canLoginAsMember &&
              activeSection !== 'centre-admins' && (
                <div
                  className="link opensans-regular"
                  onClick={() => openLoginAsMemberModal(member_id)}
                >
                  Login
                </div>
              )}
          </div>
          {uln && (
            <div className="join-date">
              <small>ULN: {uln}</small>
            </div>
          )}
          <div className="course opensans-regular">
            {isEmptySeatCard && <span>Empty Seat </span>}
            {isEqaCard ||
              (isShowSector && (
                <div className="sub-title sub-text opensans-regular">
                  {isShowSector ? sector : 'External Quality Assurance Officer'}
                  <div className="approved-percentage">
                    {approved_percentage}% Approved
                  </div>
                </div>
              ))}
            {isLearnerCard && !isShowSector && (
              <div className="approved-percentage">
                {approved_percentage}% Approved
              </div>
            )}
            {(!isEmptySeatCard && seenByGlobalAdmin) ||
              (isShowQualification && (
                <div className="sub-title opensans-regular">
                  {isGroupCard ? qualification_title : centre_name}
                </div>
              ))}
          </div>
          {role !== CentreLearner && !!member_count && (
            <div className="sub-title-container">
              <div className="learner-count opensans-semibold">
                {activeSection === 'centre-tutors' ||
                activeSection === 'centre-admins' ||
                activeSection === 'groups'
                  ? `${member_count} Members`
                  : null}
              </div>
              {activeSection === 'centre-tutors' && (
                <div className="learner-count opensans-semibold">{`${groups_count} Groups`}</div>
              )}
            </div>
          )}

          {/* Normal user card actions */}

          {!isEmptySeatCard && !isGroupCard && (
            <div className="actions">
              <div className="inner">
                {activeSection === 'centre-admins' && (
                  <div className="centre-card-actions-learners-login">
                    <div className="centre-card-actions-learners">
                      {number_of_learners} learners
                    </div>
                    <div
                      className="centre-link opensans-regular"
                      onClick={() => openLoginAsMemberModal(member_id)}
                    >
                      Login
                    </div>
                  </div>
                )}
                {/* {showWorkbooks && (
                  <div
                    className="control"
                    onClick={() => handleAssessClick(member_id)}
                  >
                    <button className="button is-medium is-primary m-b-10 assess-workbooks-button is-rounded">
                      <span>
                        {seenByTutor ? (
                          <Text iKey="assess_workbooks" />
                        ) : (
                          <Text iKey="view_workbooks" />
                        )}
                      </span>
                    </button>
                  </div>
                )} */}

                <div
                  className={classNames('field m-t-10', {
                    'is-grouped': false
                  })}
                >
                  {isEqaRelated && (
                    <div className="control is-marginless m-t-5">
                      <button
                        onClick={() => onAssignEQA(member_id)}
                        className={classNames('button is-medium is-rounded', {
                          'is-primary': !isEqaCard,
                          'is-secondary': isEqaCard
                        })}
                      >
                        <Text
                          iKey={
                            isEqaCard ? 'Assign To a Centre' : 'Assign an EQA'
                          }
                        />
                      </button>
                    </div>
                  )}
                  <div
                    className={classNames('field', {
                      'is-grouped': isEqaRelated
                    })}
                  >
                    <div
                      className={classNames('control is-marginless m-t-10', {
                        'p-r-5': isEqaRelated
                      })}
                    >
                      <Link to={`/profile/${member_id}`}>
                        <button
                          className={classNames(
                            'button is-medium Link is-primary is-rounded',
                            {
                              'is-outlined': isEqaRelated,
                              'is-secondary': isEqaCard && !isEqaRelated
                            }
                          )}
                        >
                          <Text iKey="view_profile" />
                        </button>
                      </Link>
                    </div>
                    {showChat && (
                      <div className="control is-marginless m-t-10">
                        <button
                          onClick={() => openChat(itemData, screen_name)}
                          className="button is-medium is-primary is-outlined is-rounded"
                        >
                          <Text iKey="message" />
                        </button>
                      </div>
                    )}
                    {/* {showChat && (
                      <div className="control is-marginless m-t-10">
                        <button
                          // onClick={() => openChat(itemData, screen_name)}
                          className="button is-medium is-primary is-outlined is-rounded"
                        >
                          <Text iKey="Invite" />
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>

                {/* Community card footer */}
                <div>
                  <hr />
                  <div className="footer-buttons">
                    {isShowSuspend && (
                      <div className="controls flex-1">
                        <a onClick={() => onSuspendUser(member_id)}>
                          <Isvg className="control-icon" src={IconSuspend} />
                          <p>Suspend</p>
                        </a>
                      </div>
                    )}
                    {isShowViewCentres && (
                      <div className="controls">
                        <a
                          onClick={() => {
                            setCentreID(centre_id);
                            browserHistory.push(`/community/centre-admins`);
                          }}
                        >
                          <Isvg className="control-icon" src={IconCentres} />
                          <p>View Centres</p>
                        </a>
                      </div>
                    )}
                    {isShowTask && window.location.href.includes('testing') && (
                      <div className="controls flex-1">
                        <a onClick={() => {}}>
                          <Isvg className="control-icon" src={IconTask} />
                          <p>Task</p>
                        </a>
                      </div>
                    )}
                    {isBookstand && (
                      <div className="controls flex-1">
                        <Link onClick={handleAssessClick}>
                          <Isvg className="control-icon" src={IconPortfolio} />
                          <p>Bookstand</p>
                        </Link>
                      </div>
                    )}
                    {isShowViewLearners && (
                      <div className="controls flex-2">
                        {/* <Link
                          to={`/community/${
                            isEqaCard ? 'centre-admins' : 'learners'
                          }`}
                          title={isEqaCard ? 'View Centres' : 'View Learners'}
                        > */}
                        <a
                          onClick={() => {
                            if (contains(role, [CentreAdmin])) {
                              setTutorID(member_id);
                            } else {
                              setCentreID(centre_id);
                            }
                            if (isEqaCard) {
                              browserHistory.push(`/community/centre-admins`);
                            } else {
                              browserHistory.push(`/community/learners`);
                            }
                          }}
                        >
                          <Isvg
                            className="control-icon"
                            src={isEqaCard ? IconCentres : IconPeople}
                          />
                          <p>{isEqaCard ? 'Centres' : 'Learners'}</p>
                        </a>
                        {/* </Link> */}
                      </div>
                    )}
                    {isShowPortfolio &&
                      window.location.href.includes('testing') && (
                        <div className="controls flex-1">
                          <a onClick={() => handlePortfolioClick()}>
                            <Isvg
                              className="control-icon"
                              src={IconPortfolio}
                            />
                            <p>Portfolio</p>
                          </a>
                        </div>
                      )}
                    {isShowDelete && (
                      <div className="controls flex-1">
                        <a onClick={() => onRemoveButtonClick(member_id)}>
                          <Isvg className="control-icon" src={IconRemove} />
                          <p>Delete</p>
                        </a>
                      </div>
                    )}
                    {isShowRemoveFromGroup && (
                      <div className="controls flex-1">
                        <a
                          onClick={() =>
                            onRemoveFromGroupButtonClick(member_id)
                          }
                        >
                          <Isvg className="control-icon" src={IconRemove} />
                          <p>Remove</p>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Group actions */}

          {isGroupCard && (
            <div className="actions">
              <div className="inner">
                <div className="control">
                  <button
                    className={classNames(
                      'button is-medium is-primary send-group-message is-rounded',
                      {
                        'is-loading': attemptingCreateGroupChat
                      }
                    )}
                    onClick={() => {
                      openGroupChat(itemData);
                    }}
                  >
                    <span>Send Group Message</span>
                  </button>
                </div>
                <div
                  className={classNames('field m-t-10', {
                    'is-grouped': true
                  })}
                >
                  <div className="control is-marginless p-r-5">
                    <button
                      className="button is-medium is-primary is-outlined is-rounded"
                      onClick={() => {
                        openGroupModal(itemData, 'Add learners');
                      }}
                    >
                      <Text iKey="Add Learners" />
                    </button>
                  </div>
                  <div className="control is-marginless">
                    <button
                      className="button is-medium is-primary is-outlined is-rounded"
                      onClick={() => {
                        browserHistory.push(`/community/groups/${group_id}`);
                      }}
                    >
                      <Text iKey="View Group" />
                    </button>
                  </div>
                </div>
                <div>
                  <hr />
                  <div className="footer-buttons">
                    {isShowTask && window.location.href.includes('testing') && (
                      <div className="controls">
                        <a onClick={() => {}}>
                          <Isvg className="control-icon" src={IconTask} />
                          <p>Task</p>
                        </a>
                      </div>
                    )}
                    {/* {canEditGroup && ( */}
                    <div className="controls">
                      <a onClick={() => openDeleteGroupModal(group_id)}>
                        <Isvg className="control-icon" src={IconRemove} />
                        <p>Remove</p>
                      </a>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCheckbox && (
        <div className="checkbox-view">
          <UICheckbox checked={selected} onChange={e => onChange(e)} />
        </div>
      )}
      {/* Community card footer */}
    </div>
  );
};

export default FrontView;
