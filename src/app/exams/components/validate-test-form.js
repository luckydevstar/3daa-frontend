import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { cond, equals, always, T } from 'ramda';

import { Field } from 'app/intl';
import common from 'app/common';
import TesterInfo from './tester-info';

const {
  util: { helpers: { noop } },
  components: { Form: { field, select } }
} = common;

const FORM_NAME = 'validate-test-form';

class ValidateTestForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1
    };

    this.goNext = this.goNext.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  goNext() {
    this.setState({
      step: 2
    });
  }

  goBack() {
    this.setState({
      step: 1
    });
  }

  render() {
    const { step } = this.state;
    const { idType, handleSubmit, onSubmit } = this.props;

    const title = cond([
      [equals('1'), always('Enter Driver License Number')],
      [equals('2'), always('Enter Passport Number')],
      [equals('3'), always('Select ID Type')],
      [T, always('Enter Other')]
    ])(idType);

    return (
      <form
        className="validate-test-form has-text-centered"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Validate</h1>
        <p className="application-id m-t-20">
          Please validate your candidate - your application Identity is: 2508
        </p>
        <p className="m-t-10">
          This validation is valid for:{' '}
          <span className="is-primary">30 minutes</span>
        </p>
        <div className="has-text-centered m-t-30">
          <h4>Select one form of identification</h4>
        </div>
        <div className="columns m-t-10">
          <div className="column flex-none">
            <TesterInfo />
          </div>
          <div
            className={cx('column form has-text-left', {
              visible: step === 1
            })}
          >
            <div className="field">
              <div className="control m-t-20 m-l-20">
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="id_type"
                    value="1"
                    component="input"
                  />
                  <span className="ui" />
                  Driver License
                </label>
                <br />
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="id_type"
                    value="2"
                    component="input"
                  />
                  <span className="ui" />
                  Passport
                </label>
                <br />
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="id_type"
                    value="3"
                    component="input"
                  />
                  <span className="ui" />
                  ID Card
                </label>
                <br />
                <label className="custom radio">
                  <Field
                    type="radio"
                    name="id_type"
                    value="4"
                    component="input"
                  />
                  <span className="ui" />
                  Other
                </label>
              </div>
            </div>
          </div>
          <div
            className={cx('column form has-text-left', {
              visible: step === 2
            })}
          >
            <div className="columns">
              <div className="column flex-none">
                <a onClick={this.goBack}>
                  <i className="fa fa-angle-left" /> Back
                </a>
              </div>
              <div className="column">
                {title}
              </div>
            </div>
            <div className="field">
              {step === 2 &&
                <Field
                  name="id_card_type"
                  className="control"
                  component={select}
                >
                  <option value="1">EU National ID Card</option>
                  <option value="0">Other ID Card</option>
                </Field>}
              <Field
                name="id_number"
                type="text"
                placeholder="Enter Number"
                component={field}
              />
            </div>
          </div>
        </div>
        <div className="m-t-30">
          {step === 1 &&
            <button
              type="button"
              className="button is-primary w-180"
              onClick={this.goNext}
            >
              Next
            </button>}
          {step === 2 &&
            <button type="submit" className="button is-primary w-180">
              Validate
            </button>}
        </div>
      </form>
    );
  }
}

ValidateTestForm.propTypes = {
  onSubmit: PropTypes.func
};

ValidateTestForm.defaultProps = {
  onSubmit: noop
};

const selector = formValueSelector(FORM_NAME);
const mapStateToProps = state => ({
  idType: selector(state, 'id_type')
});

const ValidateTestFormRedux = reduxForm({
  form: FORM_NAME
})(ValidateTestForm);

export default connect(mapStateToProps, null)(ValidateTestFormRedux);
