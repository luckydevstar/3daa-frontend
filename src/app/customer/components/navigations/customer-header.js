import React from 'react';
import PropTypes from 'prop-types';

const CustomerHeader = ({ title, headline }) => (
  <section className="hero smaller">
    <div className="hero-body customer-header">
      <div className="content-section">
        <h1 className="title">{title}</h1>
        <p>{headline}</p>
      </div>
    </div>
  </section>
);

CustomerHeader.propTypes = {
  title: PropTypes.string,
  headline: PropTypes.string
};

CustomerHeader.defaultProps = {
  title: 'Lets add your brand',
  headline: ''
};

export default CustomerHeader;
