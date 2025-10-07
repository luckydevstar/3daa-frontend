import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';
import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as WorkBookCreators } from 'app/workbooks/actions';

import QualificationActvivityLibrary from './qualification-activity-library';
import QualificationCustomActivity from './qualification-custom-activity';
import OutcomesTray from '../workbook/outcomes-tray';

const {
  Form: { field }
} = common.components;

const FormField = field;

const {
  UILoading,
  ContentModalNew,
  UINavigation,
  UIProgressCircle
} = common.components;

const { FormUtil } = userUtil;

const FORM_NAME = 'qualificationTestActivity';
const errorMesage = "Data doesn't exist";

class QualificationTestActivity extends Component {
  constructor() {
    super();
    this.state = {
      subpage: 0
    };
  }

  UNSAFE_componentWillMount() {
    const { activityTypes, getActivityTypesAttempt } = this.props;
    if (!activityTypes || activityTypes.length < 0) {
      getActivityTypesAttempt();
    }
  }

  handleSubmit() {}

  setActive(key) {
    this.setState({ subpage: +key.substr(9) });
  }

  getTabs() {
    const tabs = ['Activity Library', 'Custom Activity'];
    return tabs.map((label, i) => ({
      key: `test-nav-${i}`,
      text: label
    }));
  }

  render() {
    const { changeFieldValue, unit, activityTypes } = this.props;
    const { subpage } = this.state;
    const tabs = this.getTabs();

    return (
      <div className="qualifications background-white">
        <div className="content-section navigation-section m-b-10">
          <UINavigation
            tabs={tabs}
            active={`activity-nav-${subpage}`}
            showSearch={false}
            change={e => {
              this.setActive(e);
            }}
          />
        </div>
        <div className="columns space-between">
          <div className="column">
            <QualificationCustomActivity
              {...{
                activityTypes
              }}
            />
          </div>
          <div className="column">
            <OutcomesTray
              unitID={'' + unit.unit_id}
              activityMap={[]}
              right_place={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

QualificationTestActivity.defaultProps = {
  attemptingCreateUnit: false,
  unit: null
};

const mapStateToProps = state => {
  return {
    activityTypes: path(['qualifications', 'activityTypes'])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },

  getActivityTypesAttempt: () =>
    dispatch(QualificationActions.getActivityTypesAttempt())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationTestActivity);
