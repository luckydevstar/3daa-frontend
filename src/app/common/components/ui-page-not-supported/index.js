import React from 'react';

const UIPageNotSupported = () =>
  <div>
    <div className="page-not-supported-overlay">
      <i className="fa fa-television fa-3" aria-hidden="true" />
      <h1>Sorry!</h1>
      <p>
        This system is for large screens only. Please either resize the window
        or visit this part of the site on a desktop PC.
      </p>
    </div>
  </div>;

export default UIPageNotSupported;
