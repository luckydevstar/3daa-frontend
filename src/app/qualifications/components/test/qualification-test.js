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
import QualificationTestOpen from './qualification-test-open';
import QualificationTestClose from './qualification-test-close';

const {
  Form: { field, select }
} = common.components;

const FormField = field;
const FormSelect = select;

const {
  UILoading,
  ContentModalNew,
  UINavigation,
  UIProgressCircle
} = common.components;

const { FormUtil } = userUtil;

const FORM_NAME = 'qualificationTestEdit';
const errorMesage = "Data doesn't exist";

class QualificationTest extends Component {
  constructor() {
    super();
    this.state = {
      subpage: 0
    };
  }

  UNSAFE_componentWillMount() {}

  setActive(key) {
    this.setState({ subpage: +key.substr(9) });
  }

  getTabs() {
    const tabs = [
      'Opening Page Content',
      'Closing Page Content',
      'Customise Test'
    ];
    return tabs.map((label, i) => ({
      key: `test-nav-${i}`,
      text: label
    }));
  }

  render() {
    const {
      changeFieldValue,
      attemptingGetQualification,
      units,
      durations
    } = this.props;
    const { subpage } = this.state;
    const tabs = this.getTabs();

    return (
      <div className="container content-section">
        <div className="p-b-10">
          <div className="columns space-between qualifications background-white">
            <div
              className="column no-grow"
              style={{ whiteSpace: 'nowrap', position: 'relative' }}
            >
              <UIProgressCircle
                percentage={15}
                strokeWidth={3}
                diameter={80}
                blurSize={2}
              />
              <div
                className="text"
                style={{
                  position: 'absolute',
                  top: '35px',
                  left: '23px',
                  textAlign: 'center',
                  fontSize: '12px'
                }}
              >
                <span>15</span>
                <span>%</span>
                <br />
                <span>COMPLETE</span>
              </div>
            </div>
            <div className="column no-grow" style={{ whiteSpace: 'nowrap' }}>
              <div className="p-t-10">Total 2 Units</div>
              <div className="p-t-10">Total 0 Question</div>
            </div>
            <div className="column">
              <div className="columns" style={{ maxWidth: '250px' }}>
                <div
                  className="column no-grow"
                  style={{ whiteSpace: 'nowrap', paddingTop: '22px' }}
                >
                  <label htmlFor="duration">Set Duration</label>
                </div>
                <div className="column">
                  <Field
                    name="duration"
                    type="text"
                    component={FormSelect}
                    placeholder="Select"
                    className="qualifications control"
                  >
                    <option value="">Select one...</option>
                    {durations &&
                      durations.map((duration, index) => (
                        <option key={index} value={duration}>
                          {duration}
                        </option>
                      ))}
                  </Field>
                </div>
              </div>
            </div>
            <div className="column no-grow">
              <a className="button is-rounded is-primary m-l-20">
                Run The Test
              </a>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <section className="content-section navigation-section m-b-10">
          <div className="container">
            <UINavigation
              tabs={tabs}
              active={`test-nav-${subpage}`}
              showSearch={false}
              change={e => {
                this.setActive(e);
              }}
            />
          </div>
        </section>
        <section>
          {subpage == 0 && <QualificationTestOpen />}
          {subpage == 1 && <QualificationTestClose />}
          {subpage == 2 && (
            <QualificationUnitList units={units} isTestMode={true} />
          )}
        </section>
      </div>
    );
  }
}

QualificationTest.defaultProps = {
  durations: Array.from({ length: 30 }, (v, k) => k + 1)
};

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'open_media').required();
  FormUtil.validate(values, errors, 'close_text').required();
  FormUtil.validate(values, errors, 'close_subtext').required();
  FormUtil.validate(values, errors, 'signature_name').required();
  FormUtil.validate(values, errors, 'signature_title').required();
  return errors;
};

const QualificationTestForm = reduxForm({
  form: FORM_NAME,
  validate
})(QualificationTest);

const mapStateToProps = state => ({
  units: path(['qualifications', 'currentQualification', 'units'])(state),
  attemptingGetQualification: path([
    'qualifications',
    'attemptingGetQualification'
  ])(state),
  errorCode: state.qualificationUnits.errorCode
});

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
)(QualificationTestForm);
