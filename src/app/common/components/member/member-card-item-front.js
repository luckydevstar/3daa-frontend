import React, { Component } from 'react';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import common from 'app/common';
import { RoleNameMap, Roles } from 'app/core/config/constants';
import MemberProgressBadge from './member-progress-badge';
import CloudinaryMedia from '../cloudinary-media';
import { Text, Unit } from 'app/intl';
import { getPhotoUrl } from '../../util/helpers';

import Isvg from 'react-inlinesvg';

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';
import IconRemove from 'images/icon_remove.svg';

const { SuperAdmin, CentreTutor, CentreLearner, Member } = Roles;

class MemberCardItemFront extends Component {
  render() {
    const {
      member_id,
      screen_name,
      registration_number,
      cloudinary_file_id,
      checked,
      gender,
      showChat,
      showRemove,
      openChat,
      onCheckBoxChange
    } = this.props;

    const imageDimesnions = {
      width: 240,
      height: 310
    };

    const profilePhotoUrl = getPhotoUrl({ gender, cloudinary_file_id });

    return (
      <div className="front-view">
        <div className="inner">
          <div className="member-checkbox">
            <label className="custom radio">
              <input
                type="checkbox"
                value={member_id}
                checked={checked}
                onChange={e => onCheckBoxChange(e)}
              />
              <span className="ui" />
            </label>
          </div>

          <div className="no-image">
            {gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />}
          </div>

          <div
            className={classNames('cover-photo', {
              'photo-exists': cloudinary_file_id
            })}
            style={{
              backgroundImage: cloudinary_file_id
                ? `url(${profilePhotoUrl})`
                : ''
            }}
          />
          <div className="description">
            <MemberProgressBadge
              {...{
                cloudinary_file_id,
                profilePhotoId: profilePhotoUrl,
                canSeeOthersProgress: true,
                progress_percentage: 0,
                isLearner: true,
                gender,
                dimensions: 50
              }}
            />

            <div className="title">{screen_name}</div>
            <div className="sub-title">
              <Text
                iKey="registration_id"
                vals={[member_id || registration_number]}
              />
            </div>

            <div className="actions">
              <div className="inner">
                <div className="control">
                  <button
                    className="button is-medium is-primary"
                    onClick={e => onCheckBoxChange(e)}
                  >
                    <span>Select</span>
                  </button>
                </div>
                <div className="control m-t-5">
                  <Link to={`/profile/${member_id}`}>
                    <button className="button is-medium is-primary is-outlined">
                      <span>View Profile</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MemberCardItemFront;
