import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router';

const PairingTypeNavigation = () => (
  <div className="pairing-type__navigation">
    <Link
      className="pairing-type__navigation__item"
      activeClassName="pairing-type__navigation__item--active"
      to="/pairing/pairing-wheel"
    >
      Pairing Wheel
    </Link>
    <Link
      className="pairing-type__navigation__item"
      activeClassName="pairing-type__navigation__item--active"
      to="/pairing/pairing-content"
    >
      Pairing Content
    </Link>
    <Link
      className="pairing-type__navigation__item"
      activeClassName="pairing-type__navigation__item--active"
      to="/pairing/pairing-summary"
    >
      Summary
    </Link>
  </div>
);

export default PairingTypeNavigation;
