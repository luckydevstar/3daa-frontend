// TODO SUBMIT ERROR HANDLING
// CORE
import React from 'react';

// ADDONS
import { Field, reduxForm } from 'redux-form';

// COMPONENTS
import util from 'app/user/util/';
import common from 'app/common';

// CONST
const FormField = common.components.Form.field;
const { FormUtil } = util;

const FORM_NAME = 'addUnitCriteria';

class AddUnitCriteria extends React.Component {
  constructor() {
    super();
    this.state = {
      toggleClass: 'hidden'
    };
  }
  toggleEdit() {
    const newState = this.state.toggleClass === 'hidden' ? ' ' : 'hidden';
    this.setState({ toggleClass: newState });
  }

  render() {
    const { handleSubmit, addUnitCriteria, outcomeIndex } = this.props;
    return (
      <div>
        <div
          className="editToggle"
          onClick={() => {
            this.toggleEdit();
          }}
        >
          {this.state.toggleClass === 'hidden'
            ? 'Add Assesment Criteria +'
            : 'Hide panel -'}
        </div>
        <form
          className={`criteria-submit ${this.state.toggleClass}`}
          onSubmit={handleSubmit(addUnitCriteria)}
        >
          <div className="field is-horizontal is-centered">
            <Field
              name={`title,${outcomeIndex}?`}
              type="text"
              component={FormField}
              className="control"
              placeholder="Assesment Criteria name"
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
})(AddUnitCriteria);
