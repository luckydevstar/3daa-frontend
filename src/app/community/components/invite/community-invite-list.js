import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { take, cond, always, T, equals, length, last, contains } from 'ramda';
import { Creators } from '../../actions';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { bindActionCreators } from 'redux';
import { Creators as MessagingActions } from 'app/messaging/actions';

import CommuntyInviteListItem from './community-invite-list-item';

const {
  util: {
    helpers: { extractUserRole }
  },
  components: { UILoading }
} = common;

const { CentreAdmin, CentreTutor, SuperAdmin, SiteAdmin } = Roles;

class CommunityInviteList extends Component {
  constructor(props) {
    super(props);
    this.toggleSortBy = this.toggleSortBy.bind(this);
    this.isSelected = this.isSelected.bind(this);
  }

  // Component lifecycle funcs

  componentDidMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {}

  toggleSortBy(sortProp, sortOrder) {}

  isSelected(item) {
    const { whatFor, selectedItems } = this.props;

    if (!selectedItems || selectedItems.length <= 0) return false;

    switch (whatFor) {
      case 'learner':
        return selectedItems.find(i => i.member_id == item.member_id);
      case 'centre':
        return selectedItems.find(i => i.centre_id == item.centre_id);
      case 'qualification':
        return selectedItems.find(i => i.id == item.id);
    }

    return false;
  }

  renderList(whatFor, items, selectedItems, onChange) {
    return (
      <section className="community-list-view">
        <table className={classNames('table')}>
          {whatFor == 'invites' && (
            <thead>
              <tr>
                <th className="emptySeat-name" />
                <th className="emptySeat-registration-nr">
                  {/* <Text iKey="registration_number" />{' '} */}
                  Centre Name
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  Centre Number
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  Email Address
                </th>
                <th />
              </tr>
            </thead>
          )}

          {['learner', 'centre'].indexOf(whatFor) >= 0 && (
            <thead>
              <tr>
                <th className="emptySeat-name" />
                <th className="emptySeat-registration-nr">
                  {/* <Text iKey="registration_number" />{' '} */}
                  Profile Name
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  View Full Profile
                </th>
                <th />
              </tr>
            </thead>
          )}

          {whatFor == 'qualification' && (
            <thead>
              <tr>
                <th className="emptySeat-name" />
                <th className="emptySeat-registration-nr">
                  {/* <Text iKey="registration_number" />{' '} */}
                  Qualification Title
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  Level
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  LARA Ref
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  Sector
                </th>
                <th className="emptySeat-DOB">
                  {/* <Text iKey="date_of_birth" /> */}
                  Veiw Full Specification
                </th>
                <th />
              </tr>
            </thead>
          )}

          <tbody>
            {items.map((item, index) => (
              <CommuntyInviteListItem
                key={index}
                whatFor={whatFor}
                item={item}
                selected={this.isSelected(item)}
                onChange={e => onChange(e, item)}
                {...{
                  item
                }}
              />
            ))}
          </tbody>
        </table>
      </section>
    );
  }

  render() {
    const {
      attemptingUsersGet,
      whatFor,
      items,
      selectedItems,
      onChange
    } = this.props;

    return (
      <div className="container">
        {items && !attemptingUsersGet ? (
          this.renderList(whatFor, items, selectedItems, onChange)
        ) : (
          <UILoading marginTop="100px" />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ community, profile: { user } }) => ({
  ...community,
  user
});

const {
  communityUsersAttempt,
  communityUsersSuccess,
  communityUsersAttemptOldApi,
  communityUpdateSortSettings
} = Creators;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      communityUpdateSortSettings,
      communityUsersAttempt,
      communityUsersSuccess,
      communityUsersAttemptOldApi
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityInviteList);
