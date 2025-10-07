import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { contains } from 'ramda';
import Isvg from 'react-inlinesvg';

import IconCardView from 'images/icon_card_view.svg';
import IconListView from 'images/icon_list_view.svg';

import { Option, Text, Label } from 'app/intl';

class SwitchLayout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      canChangeLayout,
      activeLayout,
      userType,
      onlineFilter,
      group,
      groupFilterType,
      usersTotal,
      selectedUsers,
      setOnlineFilter,
      handleLayoutChange,
      onGroupMemberFilterChange
    } = this.props;

    const showOnlineFilters = !contains(userType, ['centreSeats', 'groups']);

    return (
      <section className="container explorer-nav">
        <div className="position-container container">
          {showOnlineFilters && (
            <div className="filter-dropdown-container">
              <div className="field is-horizontal is-centered">
                <div className="control-label p-r-10">
                  <Label iKey="status" htmlFor="status" />:
                </div>
                <p className="control">
                  <span name="status" className="select">
                    <select
                      value={onlineFilter || 'All'}
                      onChange={e => setOnlineFilter(e.target.value)}
                    >
                      <Option iKey="all" value="All" />
                      <Option iKey="online" value="Online" />
                      <Option iKey="offline" value="Offline" />
                    </select>
                  </span>
                </p>
                {!group && usersTotal && (
                  <div className="explorer-nav__users-total">
                    Total {usersTotal} members
                  </div>
                )}
                {/* <div>
                  <button className="button is-primary m-l-20" type="button">
                    Invite
                  </button>
                </div> */}
              </div>
              {group && (
                <div className="filter-by field is-horizontal is-centered">
                  <div className="control-label">
                    <Label iKey="view" htmlFor="filter-type" />:
                  </div>
                  <p className="control">
                    <span name="filter-type" className="select">
                      <select
                        value={groupFilterType}
                        onChange={onGroupMemberFilterChange}
                      >
                        <Option iKey="members" value="members" />
                        <Option iKey="empty_seats" value="empty-seats" />
                      </select>
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          {!showOnlineFilters && usersTotal && (
            <div className="explorer-nav__users-total">
              Total {usersTotal} groups
            </div>
          )}

          {canChangeLayout && (
            <div className="view-menu-wrp">
              {selectedUsers > 0 && (
                <div className="view-menu__selected-user">
                  Select User
                  <span className="view-menu__selected-user__count semibold">{`${selectedUsers} Member selected`}</span>
                </div>
              )}
              <div />
              <div className="view-menu">
                <div
                  className={classNames('view-option', 'view-option-card', {
                    active: activeLayout === 'card'
                  })}
                  onClick={() => handleLayoutChange('card')}
                >
                  <Text iKey="card_view" />
                  <Isvg src={IconCardView} />
                </div>
                <div
                  className={classNames('view-option', 'view-option-list', {
                    active: activeLayout === 'list'
                  })}
                  onClick={() => handleLayoutChange('list')}
                >
                  <Text iKey="list_view" />
                  <Isvg src={IconListView} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

SwitchLayout.propTypes = {
  canChangeLayout: PropTypes.bool,
  activeLayout: PropTypes.string,
  userType: PropTypes.string,
  onlineFilter: PropTypes.string,
  group: PropTypes.bool,
  groupFilterType: PropTypes.string,

  setOnlineFilter: PropTypes.func,
  handleLayoutChange: PropTypes.func,
  onGroupMemberFilterChange: PropTypes.func
};

SwitchLayout.defaultProps = {
  canChangeLayout: true,
  activeLayout: 'card',
  userType: '',
  onlineFilter: '',
  group: false,
  groupFilterType: '',

  setOnlineFilter: () => {},
  handleLayoutChange: () => {},
  onGroupMemberFilterChange: () => {}
};

export default SwitchLayout;
