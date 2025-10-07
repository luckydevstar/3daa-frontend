import React, { Component } from 'react';
import classNames from 'classnames';
import { Link, browserHistory } from 'react-router';
import { RoleNameMap, Roles } from 'app/core/config/constants';
import { contains } from 'ramda';
import { Text, Unit } from 'app/intl';
import { getPhotoUrl } from '../../util/helpers';

import MemberCardItemFront from './member-card-item-front';

const { SuperAdmin, CentreTutor, CentreLearner, Member } = Roles;

class MemberCardItem extends Component {
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

    return (
      <div className="column member-card-item">
        <div className="hover-capture">
          <div className="ui-component-flipper-container">
            <MemberCardItemFront
              {...{
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
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MemberCardItem;
