import React from 'react';

const Nav = () => (
  <section className="content-section separated">
    <div className="container">
      <div className="tabs">
        <ul>
          <li className="is-active">
            <a>All</a>
          </li>
          <li>
            <a>Link 1</a>
          </li>
          <li>
            <a>Link 2</a>
          </li>
          <li>
            <a>Link 3</a>
          </li>
        </ul>
        <ul className="is-right">
          <p className="control search">
            <input
              type="text"
              className="input"
              placeholder="Search example module"
            />
          </p>
        </ul>
      </div>
    </div>
  </section>
);

export default Nav;
