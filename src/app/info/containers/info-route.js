import React from 'react';
import common from 'app/common';

const { Footer } = common.components;

const InfoRoute = ({ children }) =>
  <div className="info-container another-class-name">
    <section className="container">
      {children}
    </section>
    <Footer />
  </div>;

export default InfoRoute;
