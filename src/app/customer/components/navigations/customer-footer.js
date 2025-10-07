import React from 'react';
import PropTypes from 'prop-types';

const CustomerFooter = ({ children }) => (
  <section className="customer-footer">{children}</section>
);

CustomerFooter.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node)
};

CustomerFooter.defaultProps = {
  children: []
};

export default CustomerFooter;
