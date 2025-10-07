import React, { useState, useEffect, useCallback } from 'react';
import { reduxForm, change, initialize } from 'redux-form';
import { path, isEmpty } from 'ramda';
import { connect } from 'react-redux';

import userUtil from 'app/user/util';
import { Text } from 'app/intl';
import CommunityModalInviteIqaFooter from './community-modal-invite-iqa-footer';
import { FORM_NAME } from './index';

const { FormUtil } = userUtil;

const CommunityModalInviteIqaForm = ({
  handleBack,
  handleNext,
  removeBackButton,
  formValues,
  validate,
  changeFieldValue,
  handleSubmit,
  initializeForm,
  activeSection
}) => {
  const [errors, setErrors] = useState();

  const onSubmit = useCallback(() => {
    const formErrors = validate(formValues);
    if (isEmpty(formErrors)) {
      handleNext();
    } else {
      setErrors(formErrors);
    }
  }, [validate, formValues]);

  const updateFieldValue = useCallback(
    e => {
      if (errors) {
        setErrors({
          ...errors,
          [e.target.name]: null
        });
      }
      changeFieldValue(e.target.name, e.target.value);
    },
    [errors, changeFieldValue]
  );

  useEffect(() => {
    initializeForm({
      firstName: '',
      lastName: '',
      email: ''
    });
  }, [initializeForm]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="modal-invite-iqa__form">
      <div className="modal-invite_field">
        <label htmlFor="invite-iqa__first-name">First Name</label>
        <input
          id="invite-iqa__first-name"
          placeholder={`Type First Name of ${
            activeSection === 'iqas' ? 'IQA' : 'EQA'
          }`}
          name="firstName"
          type="text"
          className="control"
          value={formValues ? formValues.firstName : ''}
          onChange={updateFieldValue}
        />
        {errors && errors.firstName && (
          <div className="modal-invite_field_error">
            <Text iKey={errors.firstName} />
          </div>
        )}
      </div>
      <div className="modal-invite_field">
        <label htmlFor="invite-last-name">Last Name</label>
        <input
          id="invite-last-name"
          placeholder={`Type Last Name of ${
            activeSection === 'iqas' ? 'IQA' : 'EQA'
          }`}
          name="lastName"
          type="text"
          className="control"
          value={formValues ? formValues.lastName : ''}
          onChange={updateFieldValue}
        />
        {errors && errors.lastName && (
          <div className="modal-invite_field_error">
            <Text iKey={errors.lastName} />
          </div>
        )}
      </div>
      <div className="modal-invite_field">
        <label htmlFor="invite-iqa__email">Email Address</label>
        <input
          id="invite-iqa__email"
          placeholder={`Type Email Address of ${
            activeSection === 'iqas' ? 'IQA' : 'EQA'
          }`}
          name="email"
          type="text"
          className="control"
          value={formValues ? formValues.email : ''}
          onChange={updateFieldValue}
        />
        {errors && errors.email && (
          <div className="modal-invite_field_error">
            <Text iKey={errors.email} />
          </div>
        )}
      </div>
      <CommunityModalInviteIqaFooter
        handleBack={handleBack}
        removeBackButton={removeBackButton}
      />
    </form>
  );
};

const mapStateToProps = ({ form }) => ({
  formValues: path([FORM_NAME, 'values'], form)
});

const mapDispatchToProps = dispatch => ({
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },

  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: FORM_NAME,
    validate: values => {
      const errors = {};
      FormUtil.validate(values, errors, 'firstName').required();
      FormUtil.validate(values, errors, 'lastName').required();
      FormUtil.validate(values, errors, 'email')
        .email()
        .required();
      return errors;
    }
  })(CommunityModalInviteIqaForm)
);
