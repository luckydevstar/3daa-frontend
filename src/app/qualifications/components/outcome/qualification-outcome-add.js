import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, path } from 'ramda';
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

const {
  Form: { field }
} = common.components;

const FormField = field;

const { FormUtil } = userUtil;

const FORM_NAME = 'learningUnitOutcomeAdd';
const errorMesage = "Data doesn't exist";

class QualificationOutcomeAdd extends Component {
  constructor() {
    super();
    this.onAdd = this.onAdd.bind(this);
  }

  UNSAFE_componentWillMount() {}

  handleSubmit() {}

  onAdd() {
    const { changeFieldValue, title, outcomes } = this.props;

    if (!title || !title.trim()) return;

    const temp = outcomes || [];
    const newOutcome = {
      title: title,
      number: 0,
      assessment_criteria: []
    };

    changeFieldValue('learningUnitEdit', 'outcomes', [...temp, newOutcome]);
    changeFieldValue(FORM_NAME, 'title', '');
  }

  render() {
    const { outcomes, title } = this.props;
    const { onAdd } = this;
    return (
      <div className="container">
        <div
          className="columns space-between"
          style={{ alignItems: 'center', background: '#f9f9f9' }}
        >
          <div
            className="column is-flex is-centered no-grow has-text-black font-family-semibold"
            style={{ whiteSpace: 'nowrap' }}
          >
            Outcome {outcomes ? outcomes.length + 1 : 1}
          </div>
          <div className="column p-t-20">
            <Field
              placeholder="Add your Outcome Title"
              name="title"
              type="text"
              component={FormField}
            />
          </div>
          <div className="column no-grow">
            <a
              className="qualifications button is-primary is-rounded is-outlined m-l-20"
              disabled={!title}
              onClick={() => onAdd()}
            >
              Add Outcome&nbsp;&nbsp;&nbsp;+
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  return errors;
};

QualificationOutcomeAdd.defaultProps = {
  title: ''
};

const QualificationOutcomeAddForm = reduxForm({
  form: FORM_NAME,
  validate
})(QualificationOutcomeAdd);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => ({
  title: selector(state, 'title'),
  outcomes: path(['form', 'learningUnitEdit', 'values', 'outcomes'])(state)
});

const mapDispatchToProps = dispatch => ({
  initializeForm: (form_name, data) => {
    dispatch(initialize(form_name, data));
  },
  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationOutcomeAddForm);
