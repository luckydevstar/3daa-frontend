import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as lodash from 'lodash';
import { Text } from 'app/intl';
import MemberListItem from './member-list-item';

class MemberListView extends Component {
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
      showProfile,
      onCheckBoxChange,
      onRemove
    } = this.props;

    return (
      <section className="member-list-view">
        {lodash.get(members, 'length', 0) > 0 ? (
          <table className={classNames('table', className)}>
            {showHeader && (
              <thead>
                <tr>
                  <th className="group-title">
                    <Text iKey="group_title" />
                  </th>
                  <th className="goup-actions">
                    <Text iKey="actions" />
                  </th>
                </tr>
              </thead>
            )}

            <tbody>
              {members.map(member => (
                <MemberListItem
                  key={
                    member.member_id ||
                    member.group_id ||
                    member.registration_number
                  }
                  member={member}
                  showChat={showChat}
                  showRemove={showRemove}
                  openChat={() => openChat(member)}
                  showProfile={showProfile}
                  checked={this.isChecked(member)}
                  onCheckBoxChange={() => onCheckBoxChange(member)}
                  onRemove={() => onRemove(member)}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="has-text-centered m-t-30">No Members</div>
        )}
      </section>
    );
  }
}

MemberListView.propTypes = {
  className: PropTypes.string,
  members: PropTypes.array,
  showChat: PropTypes.bool,
  showRemove: PropTypes.bool,
  showProfile: PropTypes.bool,
  openChat: PropTypes.func
};

MemberListView.defaultProps = {
  className: '',
  members: [],
  showChat: true,
  showRemove: true,
  openChat: true,
  showProfile: true,
  openChat: e => {},
  onRemove: e => {}
};

export default MemberListView;
