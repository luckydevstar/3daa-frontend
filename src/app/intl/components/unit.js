import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from '../helper';

const Unit = ({ amount, unit, lang }) =>
  <span>
    {amount} {_t(unit, lang)}
    {amount > 1 && lang === 'en' ? 's' : ''}
  </span>;

Unit.propTypes = {
  amount: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired
};

const mapStateToProps = ({ persisted: { lang } }) => ({ lang });

export default connect(mapStateToProps, null)(Unit);
