import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';
import { Text } from 'app/intl';

import MemberCardItem from './member-card-item';

class MemberCardListView extends Component {
  constructor(props) {
    super(props);

    this.isChecked = this.isChecked.bind(this);
  }

  isChecked(member) {
    const { selectedCentreMembers } = this.props;
    return (
      selectedCentreMembers.findIndex(sm => sm.member_id == member.member_id) >=
      0
    );
  }

  render() {
    const {
      className,
      members,
      showHeader,
      showChat,
      showRemove,
      openChat,
      onCheckBoxChange
    } = this.props;
    return (
      <section className="member-card-view">
        <div className="container">
          {lodash.get(members, 'length', 0) > 0 ? (
            <div className="columns">
              {members.map((member, i) => (
                <MemberCardItem
                  key={
                    member.member_id ||
                    member.group_id ||
                    member.registration_number
                  }
                  member_id={member['member_id']}
                  screen_name={member['screen_name']}
                  cloudinary_file_id={member['cloudinary_file_id']}
                  gender={member['gender']}
                  registration_number={member.registration_number}
                  showChat={showChat}
                  showRemove={showRemove}
                  openChat={openChat}
                  checked={this.isChecked(member)}
                  onCheckBoxChange={e => onCheckBoxChange(member)}
                />
              ))}
            </div>
          ) : (
            <div className="has-text-centered m-t-30">No Members</div>
          )}
        </div>
      </section>
    );
  }
}

export default MemberCardListView;
