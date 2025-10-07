import React from 'react';
import { Link } from 'react-router';
import common from 'app/common';
import { Text } from 'app/intl';
import { contains, path } from 'ramda';
import moment from 'moment';
import { RoleNameMap } from 'app/core/config/constants';

import CommunityCardItemBackGroup from './community-card-item-back-group';
import CommunityCardItemBackTutor from './community-card-item-back-tutor';
import CommunityCardItemBackCentre from './community-card-item-back-centre';
import CommunityCardItemBackEQA from './community-card-item-back-eqa';
import CommunityCardItemBackAdmin from './community-card-item-back-admin';

const {
  isEmptySeat,
  isGroup,
  isLearner,
  createCloudinaryUrl
} = common.util.helpers;

const BackView = ({ activeSection, itemData }) => {
  // Item data
  const {
    member_id,
    centre_roles,
    centre_name,
    roles,
    online,
    screen_name,
    current_qualification,
    media,
    date_of_birth,
    title,
    created_by,
    group_id,
    total,
    cloudinary_file_id,
    registration_number,
    latest_digital_badge
  } = itemData;

  // Get user's sector
  const isEmptySeatCard = isEmptySeat(itemData);
  const isLearnerCard = isLearner(itemData);

  const isGroupCard = isGroup(itemData);
  const siteAdminsTab = contains(activeSection, [
    'super-admins',
    'site-admins'
  ]);

  const centreRole =
    !isEmptySeatCard && !isGroupCard && centre_roles && centre_roles.length > 0
      ? centre_roles[0]
      : undefined;

  const globalRole = roles && roles[0];
  const centreRoleString = centreRole && RoleNameMap[centreRole];
  const globalRoleString = globalRole && RoleNameMap[globalRole];
  const roleString = siteAdminsTab ? globalRoleString : centreRoleString;

  const date_started_qualification = path(
    ['date_started_qualification'],
    current_qualification
  );

  return (
    <div className="back-view">
      {activeSection === 'learners' && ( //TODO create CommunityCardItemBackLearner component
        <div>
          <div className="screen-name">{screen_name}</div>
          <div className="join-date">Member for 1 year</div>
          <div className="has-text-centered p-t-10">
            <span className="role-view">
              <Text iKey={roleString} />
            </span>
          </div>
          <div className="photo-view">
            <div className="is-flex space-between photo-view-controls">
              <span>Photos</span>
              <Link to={`/profile/${member_id}/photos`}>View</Link>
            </div>
            {media && media.length ? (
              <div className="photos">
                <div
                  className="main-photo"
                  style={{
                    backgroundImage: media[0].cloudinary_file_id
                      ? `url('${createCloudinaryUrl(
                          media[0].cloudinary_file_id
                        )}')`
                      : ''
                  }}
                />
                <div className="secondary-photos">
                  <div
                    className="secondary-photo"
                    style={{
                      backgroundImage:
                        media[1] && media[1].cloudinary_file_id
                          ? `url('${createCloudinaryUrl(
                              media[1].cloudinary_file_id
                            )}')`
                          : ''
                    }}
                  />
                  <div
                    className="secondary-photo"
                    style={{
                      backgroundImage:
                        media[2] && media[2].cloudinary_file_id
                          ? `url('${createCloudinaryUrl(
                              media[2].cloudinary_file_id
                            )}')`
                          : ''
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="photos sub-title opensans-regular">
                <span>No Photos</span>
              </div>
            )}
          </div>
          <hr />
          <div className="achievement">
            <div className="has-text-centered sub-text opensans-regular">
              Latest Achievement
            </div>
            <div className="achievement-content">
              <div
                className="badge"
                style={{
                  backgroundImage:
                    latest_digital_badge &&
                    latest_digital_badge.cloudinary_file_id
                      ? `url('${createCloudinaryUrl(
                          latest_digital_badge.cloudinary_file_id
                        )}')`
                      : ''
                }}
              />
              <div className="content">
                <div className="achievement-content-title sub-title opensans-regular">
                  {latest_digital_badge && latest_digital_badge.title}
                </div>
                <div className="achievement-content-date sub-title opensans-regular">
                  <span>Awarded</span>
                  &nbsp;&nbsp;&nbsp;
                  <span>
                    {!latest_digital_badge &&
                      date_started_qualification &&
                      moment(latest_digital_badge.created)
                        .tz('Europe/London')
                        .format('ll')}
                    {latest_digital_badge &&
                      moment(latest_digital_badge.created)
                        .tz('Europe/London')
                        .format('ll')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSection === 'groups' && (
        <CommunityCardItemBackGroup
          {...{
            itemData,
            activeSection
          }}
        />
      )}
      {activeSection === 'centre-tutors' && (
        <CommunityCardItemBackTutor
          {...{
            itemData,
            activeSection
          }}
        />
      )}
      {activeSection === 'centre-admins' && (
        <CommunityCardItemBackCentre
          {...{
            itemData,
            activeSection
          }}
        />
      )}
      {(activeSection === 'eqas' || activeSection === 'iqas') && (
        <CommunityCardItemBackEQA
          {...{
            itemData,
            activeSection
          }}
        />
      )}
      {(activeSection === 'super-admins' ||
        activeSection === 'site-admins') && (
        <CommunityCardItemBackAdmin
          {...{
            itemData,
            activeSection,
            roleString
          }}
        />
      )}
    </div>
  );
};

export default BackView;
