import React from 'react';
import { Route } from 'react-router';
import {
  PairingMain,
  PairingWheel,
  PairingContent,
  PairingSummary
} from '../containers';

const PairingWheelRoutes = (
  <Route>
    <Route component={PairingMain} path="pairing">
      <Route component={PairingWheel} path="pairing-wheel" />
      <Route component={PairingContent} path="pairing-content" />
      <Route component={PairingSummary} path="pairing-summary" />
    </Route>
  </Route>
);

export default PairingWheelRoutes;
