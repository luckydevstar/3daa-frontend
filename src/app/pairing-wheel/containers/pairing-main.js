import React from 'react';
import { connect } from 'react-redux';

import { PairingWheelHead, PairingWheelFooter } from '../components';
import { Creators } from '../actions';
import PairingNavigation from './navigation';

class PairingMain extends React.Component {
  componentDidMount() {
    this.props.getPairingItems();
    this.props.getPairingCategories();
  }
  render() {
    return (
      <div className="pairing">
        <PairingWheelHead />
        <PairingNavigation />
        {this.props.children}
        <PairingWheelFooter />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getPairingItems: () => dispatch(Creators.getPairingItemsAttempt()),
  getPairingCategories: () => dispatch(Creators.getPairingCategoriesAttempt())
});

export default connect(
  null,
  mapDispatchToProps
)(PairingMain);
