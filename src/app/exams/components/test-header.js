import React from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
import common from 'app/common';
import { IndexLink } from 'react-router';

const { UINavColorPicker } = common.components;

const TestHeader = ({ colors, colorChangable, onColorChange }) => (
  <header className="test-header" role="banner">
    <nav className="nav top-nav has-shadow" role="navigation">
      {/* Logo */}
      <div className="nav-left">
        <div className="navbar-item is-brand logo">
          <IndexLink to={'/'} activeClassName="is-active">
            <span className="logo" />
          </IndexLink>
        </div>
      </div>
      <div className="header-template-container">
        <UINavColorPicker
          {...{
            labels: {
              background: 'Background',
              text: 'Font'
            },
            colors,
            changable: colorChangable,
            onColorChange
          }}
        />
      </div>
    </nav>
  </header>
);

TestHeader.propTypes = {
  colors: PropTypes.shape({
    background: PropTypes.string,
    text: PropTypes.string
  }),
  colorChangable: PropTypes.bool,
  onColorChange: PropTypes.func.isRequired
};

TestHeader.defaultProps = {
  colors: {
    background: 'white',
    text: 'black'
  },
  colorChangable: false
};

export default TestHeader;
