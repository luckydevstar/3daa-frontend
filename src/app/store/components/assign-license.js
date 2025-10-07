import React from 'react';
import common from 'app/common';
import { Field, reduxForm } from 'redux-form';

const { components: { Form: { field, select } } } = common;

const FORM_NAME = 'selectedLicenseForm';

const selectedInfoForm = () => {
  return (
    <form>
      <label className="label" htmlFor="employees">
        Select Employee
      </label>
      <Field
        name="employees"
        component={field}
        placeholder="Search Employee..."
      />
      <label className="label" htmlFor="licenses">
        Select License
      </label>
      <Field name="licenses" className="control grow" component={select}>
        <option value="">Food Hygine</option>
      </Field>
    </form>
  );
};

const AssignLicense = () =>
  <div className="assign-license">
    <section className="selected-info">
      <div className="m-b-20 has-text-centered">
        <h1>Assign a License</h1>
        <h3>Please Select an employee to assign a license to</h3>
      </div>
      <ConnectedSelectedInfoForm />
    </section>
  </div>;

const validate = values => {
  const errors = {};

  return errors;
};

const ConnectedSelectedInfoForm = reduxForm({ form: FORM_NAME, validate })(
  selectedInfoForm
);

export default AssignLicense;
