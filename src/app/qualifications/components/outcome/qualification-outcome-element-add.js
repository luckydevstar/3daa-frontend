import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, clone, path } from 'ramda';
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

const FORM_NAME = 'learningUnitOutcomeElementAdd';
const errorMesage = "Data doesn't exist";

class QualificationOutcomeAdd extends Component {
  constructor() {
    super();
    this.onAdd = this.onAdd.bind(this);
  }

  UNSAFE_componentWillMount() {}

  onAdd() {
    const {
      changeFieldValue,
      title,
      outcomes,
      outcome,
      outcomeIndex
    } = this.props;

    if (!title || !title.trim()) return;

    let temp = outcome.assessment_criteria || [];
    let newOutcomes = [].concat(outcomes);
    let newOutcome = clone(outcome);

    const newCriteria = {
      title: title,
      guidance: null,
      require_observation: 0,
      require_discussion: 0
      // in_test: 0
    };

    newOutcome.assessment_criteria = [...temp, newCriteria];
    newOutcomes.splice(outcomeIndex, 1, newOutcome);
    changeFieldValue('learningUnitEdit', 'outcomes', newOutcomes);
    changeFieldValue(FORM_NAME, 'title', '');
  }

  render() {
    const { title } = this.props;
    const { onAdd } = this;

    return (
      <div
        className="columns space-between is-centered"
        style={{ background: '#f9f9f9' }}
      >
        <div className="column p-t-20">
          <Field
            placeholder="Add an element"
            name="title"
            type="text"
            component={FormField}
          />
        </div>
        <div className="column no-grow">
          <button
            className="qualifications button is-primary is-rounded m-l-20"
            disabled={!title}
            onClick={() => onAdd()}
          >
            Add Element
          </button>
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
  title: '',
  outcome: null
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
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationOutcomeAddForm);
