import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import common from 'app/common';
import CommunityProgressBadge from './community-progress-badge';

import { Text } from 'app/intl';

const {
  components: { UICheckbox },
  util: {
    helpers: { isLearner, isEmptySeat, isGroup, getCommunityProfilePhotoId }
  }
} = common;

const EqaAssignListItem = ({
  userData,
  canSeeOthersProgress,
  seenByGlobalAdmin,
  openChat,
  showCheckbox,
  onChange,
  selected
}) => {
  const { member_id, screen_name, current_qualification, gender } = userData;

  let progress_percentage;
  if (current_qualification) {
    progress_percentage = current_qualification.progress_percentage;
  }

  const isEmptySeatItem = isEmptySeat(userData);
  const isLearnerItem = isLearner(userData);

  const isGroupItem = isGroup(userData);

  const showChat = seenByGlobalAdmin || (!isEmptySeatItem && !isLearnerItem);

  const profilePhotoId = getCommunityProfilePhotoId(userData);

  return (
    <tr className="community-list-item">
      <td>
        <div className="columns community-list-item__content">
          {showCheckbox && (
            <div className="community-list-item__content__checkbox">
              <UICheckbox checked={selected} onChange={e => onChange(e)} />
            </div>
          )}
          <div className="column no-grow">
            <CommunityProgressBadge
              {...{
                profilePhotoId,
                canSeeOthersProgress,
                progress_percentage,
                isLearner: isLearnerItem,
                gender
              }}
            />
            {/* TODO implement overlay in the ProgressBadge with props
            overlay:bool overlayColor:string */}
            {!isEmptySeatItem && !isGroupItem && (
              <div className="image overlay">
                <div className="value">
                  {canSeeOthersProgress
                    ? progress_percentage &&
                      `${Math.round(progress_percentage)}%`
                    : 0}
                </div>
              </div>
            )}
          </div>
          <div className="column name">
            <div>
              {screen_name}
              <div className="reg-id">
                <Text iKey="registration_number" />
                {`: ${member_id}`}
              </div>
            </div>
            {/* {isEmptySeatItem && <Text iKey="empty_seat" />} */}
          </div>
        </div>
      </td>
      {!isEmptySeatItem && !isGroupItem && (
        <td>
          <div className="columns text-center">
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
          </div>
        </td>
      )}
    </tr>
  );
};

EqaAssignListItem.propTypes = {};

EqaAssignListItem.defaultProps = {};

export default connect()(EqaAssignListItem);
