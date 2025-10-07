import React from 'react';

const CustomersListHead = ({ title, subTitle, goTo }) => (
  <section className="content-section hero smaller gray">
    <div className="hero-body">
      <div className="container">
        <h1 className="title">{title}</h1>
        <h2 className="subtitle">{subTitle}</h2>
        <div className="hero-nav">
          <div onClick={goTo} className="button is-primary is-outlined">
            Add Customer
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CustomersListHead;
