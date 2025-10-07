import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from '../helper';

const Option = ({ iKey, lang, value }) =>
  <option value={value}>
    {_t(iKey, lang)}
  </option>;

Option.propTypes = {
  iKey: PropTypes.string.isRequired
};

const mapStateToProps = ({ persisted: { lang } }) => ({ lang });

export default connect(mapStateToProps, null)(Option);
