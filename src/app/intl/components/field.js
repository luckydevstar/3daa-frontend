import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { _t } from '../helper';

const FormField = ({ placeholder, lang, ...rest }) =>
  <Field placeholder={_t(placeholder, lang)} {...rest} />;

FormField.propTypes = {
  placeholder: PropTypes.string
};

FormField.defaultProps = {
  placeholder: ''
};

const mapStateToProps = ({ persisted: { lang } }) => ({ lang });

export default connect(mapStateToProps, null)(FormField);
