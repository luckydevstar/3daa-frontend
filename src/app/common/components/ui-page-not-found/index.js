import React from 'react';
import Footer from '../footer';

const UIPageNotFound = () =>
  <div className="">
    <div className="min-content-height p-t-25 align-children-center">
      <div className="has-text-centered">
        <h1 className="m-b-15" style={{ fontSize: 64 }}>
          404
        </h1>
        <h3 className="m-b-5">Page not found.</h3>
        <p>How did you even get here?</p>
      </div>
    </div>
    <Footer />
  </div>;

export default UIPageNotFound;
