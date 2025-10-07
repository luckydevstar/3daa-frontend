// CORE
import React from 'react';

// ADDONS
import { Field, reduxForm } from 'redux-form';
import common from 'app/common';
import util from 'app/user/util/';

// CONST
const FormField = common.components.Form.field;
const { FormUtil } = util;
const FORM_NAME = 'addUnitGuidance';

class AddUnitGuidance extends React.Component {
  constructor() {
    super();
    this.state = {
      toggleClass: 'hidden'
    };
  }

  // show/hide add guidance element
  toggleAddField() {
    const newState = this.state.toggleClass === 'hidden' ? '' : 'hidden';
    this.setState({ toggleClass: newState });
  }

  render() {
    const {
      handleSubmit,
      addUnitGuidance,
      outcomeIndex,
      criteriaIndex
    } = this.props;
    return (
      <div>
        <div
          className="editToggle"
          onClick={() => {
            this.toggleAddField();
          }}
        >
          {this.state.toggleClass === 'hidden'
            ? 'Add Guidance +'
            : 'Hide panel -'}
        </div>
        <form
          className={`criteria-submit ${this.state.toggleClass}`}
          onSubmit={handleSubmit(addUnitGuidance)}
        >
          <label htmlFor="title">Guidance</label>
          <div className="field is-horizontal is-centered">
            <Field
              id="title"
              name={`title,${outcomeIndex}-${criteriaIndex}?`}
              type="text"
              component={FormField}
              className="control"
            />
            <button className="button is-success" type="submit">
              Add
            </button>
          </div>
        </form>
      </div>
    );
  }
}

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  return errors;
};

export default reduxForm({
  form: FORM_NAME,
  validate
})(AddUnitGuidance);
