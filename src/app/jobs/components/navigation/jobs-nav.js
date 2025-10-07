import React from 'react';

const Nav = () =>
  <div className="tabs is-fullwidth jobs-navs">
    <ul>
      <li>
        <span className="icon">
          <i className="fa fa-search" />
        </span>
        <span className="text">Paramedic</span>
      </li>
      <li>
        <span className="icon">
          <i className="fa fa-map-marker" />
        </span>
        <span className="text">London</span>
      </li>
      <li>
        <span className="text">Distance</span>
        <span className="icon">
          <i className="fa fa-angle-down" />
        </span>
      </li>
      <li>
        <span className="text">Contract Type</span>
        <span className="icon">
          <i className="fa fa-angle-down" />
        </span>
      </li>
    </ul>
  </div>;

export default Nav;
