import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from '../helper';

const Label = ({ iKey, lang, htmlFor, className }) =>
  <label htmlFor={htmlFor} className={className}>
    {_t(iKey, lang)}
  </label>;

Label.propTypes = {
  iKey: PropTypes.string.isRequired,
  htmlFor: PropTypes.string,
  className: PropTypes.string
};

Label.defaultProps = {
  htmlFor: '',
  className: ''
};

const mapStateToProps = ({ persisted: { lang } }) => ({ lang });

export default connect(mapStateToProps, null)(Label);
