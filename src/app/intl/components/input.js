import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from '../helper';
import { noop } from 'app/common/util/helpers';

const Input = ({
  placeholder,
  lang,
  onKeyUp,
  onFocus,
  onBlur,
  type,
  className,
  value
}) => (
  <input
    placeholder={_t(placeholder, lang)}
    defaultValue={value}
    {...{
      onKeyUp,
      onFocus,
      onBlur,
      type,
      className
    }}
  />
);

Input.propTypes = {
  placeholder: PropTypes.string,
  onKeyUp: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string
};

Input.defaultProps = {
  placeholder: '',
  className: '',
  type: 'text',
  value: '',
  onKeyUp: noop
};

const mapStateToProps = ({ persisted: { lang } }) => ({ lang });

export default connect(
  mapStateToProps,
  null
)(Input);
