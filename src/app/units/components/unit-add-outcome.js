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
const FORM_NAME = 'addUnitOutcome';

/** DATABASE STRUCTURE
 *     "outcome_id": "12",
 *     "title": "U2 O2",
 *     "number": "3",
 *     "assessment_criteria": [{}]
 */
class AddUnitOutcome extends React.Component {
  render() {
    const { handleSubmit, addUnitOutcome, resetForm } = this.props;
    console.log(this.props);
    return (
      <form
        className="outcomes-add columns m-t-20 m-b-20"
        onSubmit={handleSubmit(addUnitOutcome)}
      >
        <div className="column is-2">
          <b>Add An Outcome</b>
        </div>
        <div className="column is-8">
          <Field
            id="title"
            name="title"
            type="text"
            component={FormField}
            className="control"
          />
        </div>
        <div className="column is-2">
          <button
            className="button is-primary is-outlined"
            onClick={resetForm}
            type="submit"
          >
            Add an Outcome
            <i className="fa fa-plus m-l-10" />
          </button>
        </div>
      </form>
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
})(AddUnitOutcome);
