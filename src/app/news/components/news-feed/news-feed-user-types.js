import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex } from 'ramda';
import { Field, reduxForm, change, initialize } from 'redux-form';

import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';

import { Roles } from 'app/core/config/constants';

const { CentreAdmin, CentreTutor, CentreLearner } = Roles;
class NewsFeedUserTypes extends Component {
  constructor() {
    super();
    this.state = {};
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  onCheckBoxChange(e) {
    const { changeFieldValue, userRoles, userRoleTypes, editable } = this.props;
    console.log('changed');
    if (!editable) return;

    if (e.target.value == 'ALL') {
      if (e.target.checked) {
        changeFieldValue(userRoleTypes.map(u => u.key));
      } else {
        changeFieldValue([]);
      }
    } else {
      if (e.target.checked) {
        if (!userRoles || userRoles.findIndex(u => u == e.target.value) < 0) {
          changeFieldValue(
            userRoles ? [...userRoles, e.target.value] : [e.target.value]
          );
        }
      } else {
        changeFieldValue(userRoles.filter(u => u != e.target.value));
      }
    }
  }

  isChecked(key) {
    const { userRoles } = this.props;
    if (key == 'ALL') return userRoles && userRoles.length == 3;
    else if (userRoles) {
      return userRoles.indexOf(key) >= 0;
    } else {
      return false;
    }
  }

  render() {
    const { userRoleTypes } = this.props;
    const { isChecked } = this;

    return (
      <div className="columns">
        <div className="column is-6">
          <div style={{ maxWidth: '200px', margin: 'auto' }}>
            <div className="m-b-15">
              <b>Type of User</b>
            </div>
            <div>
              {userRoleTypes.map((userRole, index) => (
                <div className="m-t-10" key={index}>
                  <label className="custom radio">
                    <input
                      type="checkbox"
                      value={userRole.key}
                      checked={isChecked(userRole.key)}
                      onChange={e => this.onCheckBoxChange(e, userRole.key)}
                    />
                    <span className="ui" />
                    {userRole.name}
                  </label>
                </div>
              ))}
              <div className="m-t-10">
                <label className="custom radio">
                  <input
                    type="checkbox"
                    value="ALL"
                    checked={isChecked('ALL')}
                    onChange={e => this.onCheckBoxChange(e)}
                  />
                  <span className="ui" />
                  Global
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewsFeedUserTypes.defaultProps = {
  userRoleTypes: [
    { key: CentreAdmin, name: 'Centre' },
    { key: CentreTutor, name: 'Tutor' },
    { key: CentreLearner, name: 'Learner' }
  ],
  userRoles: [],
  editable: true,
  changeFieldValue: () => {}
};

export default NewsFeedUserTypes;
