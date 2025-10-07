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
import QualificationUnitList from '../unit/qualification-unit-list';

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

const FORM_NAME = 'customactivity';
const errorMesage = "Data doesn't exist";

class QualificationTestCustomActivity extends Component {
  constructor() {
    super();
    this.state = {
      subpage: 0
    };
  }

  UNSAFE_componentWillMount() {}

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
    const { changeFieldValue, qualificationUnits } = this.props;
    const { subpage } = this.state;
    const tabs = this.getTabs();

    return (
      <div>
        <div className="columns">
          <div className="column">
            <div>
              <div>Activity Lancher Media</div>
            </div>
            <div>
              <div>Activity Number</div>
            </div>
          </div>
          <div className="column">
            <div>
              <div>Activity Title</div>
              <div />
            </div>
            <div>
              <div>Activity Short Description</div>
              <div />
            </div>
          </div>
        </div>

        {/* Activity Type */}
        <div />

        <div>
          Free text entry will ask your learners to type or paste their answer
          to your activity question or statement
        </div>

        {/* Activity question or answer prompt(s) */}
        <div className="columns">
          <div className="column">Activity question or answer prompt(s)</div>
          <div className="column" />
        </div>
        {/* Prompt title(s) */}
        <div>
          <div className="columns">
            <div className="column">Prompt title(s)</div>
            <div className="column" />
          </div>
        </div>
      </div>
    );
  }
}

QualificationTestCustomActivity.defaultProps = {
  title: '',
  attemptingCreateUnit: false
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationTestCustomActivity);
