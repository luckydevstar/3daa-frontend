import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import common from 'app/common';
import { Text, Field } from 'app/intl';

const {
  components: { Form: { field, dateform, FormTime } },
  util: { helpers: { noop } }
} = common;
const FormField = field;
const FormDate = dateform;

const FORM_NAME = 'register-personal-profile';

const BookTestForm = ({ handleSubmit, onSubmit }) =>
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="has-text-left">
      <div className="label">Test Location</div>
      <div className="control">
        <Field name="test_location" type="text" component={FormField} />
      </div>
      <div className="label">Date of Test</div>
      <Field
        id="date_of_test"
        name="date_of_test"
        maxDate="2099-12-31"
        component={FormDate}
      />
      <div className="label">Time</div>
      <Field id="time" name="time" component={FormTime} />
      <div className="label">Add Invigilator</div>
      <div className="control">
        <Field name="invigilator" type="text" component={FormField} />
      </div>
      <div className="actions">
        <button className="button is-primary">Next</button>
      </div>
    </div>
  </form>;

BookTestForm.propTypes = {
  onSubmit: PropTypes.func
};

BookTestForm.defaultProps = {
  onSubmit: noop
};

export default reduxForm({
  form: FORM_NAME
})(BookTestForm);
