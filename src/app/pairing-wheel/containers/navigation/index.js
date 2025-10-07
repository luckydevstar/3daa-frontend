import React from 'react';
import PairingCategoryNavigation from './pairing-category-navigation';
import PairingTypeNavigation from './pairing-type-navigation';

class PairingNavigation extends React.Component {
  render() {
    return (
      <div className="pairing-navigation">
        <PairingTypeNavigation />
        <PairingCategoryNavigation />
      </div>
    );
  }
}

export default PairingNavigation;
