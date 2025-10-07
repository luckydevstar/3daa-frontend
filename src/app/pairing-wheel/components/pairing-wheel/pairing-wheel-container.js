import React from 'react';
import { cond, equals, always } from 'ramda';
import {
  PairingMainCategory,
  PairingSubCategory,
  PairingRecommendedCategory
} from '../../containers';

class PairingWheelContainer extends React.Component {
  render() {
    const { categoryType } = this.props;
    return (
      <div className="pairing-wheel-container">
        <div className="pairing-wheel__categories">
          {cond([
            [equals('main'), always(<PairingMainCategory />)],
            [equals('sub'), always(<PairingSubCategory />)],
            [equals('recommended'), always(<PairingRecommendedCategory />)]
          ])(categoryType)}
        </div>
      </div>
    );
  }
}

export default PairingWheelContainer;
