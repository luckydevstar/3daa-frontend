import React from 'react';
import { connect } from 'react-redux';
import { PairingWheelContainer } from '../components';

class PairingWheel extends React.Component {
  render() {
    const { categoryType, router } = this.props;
    return <PairingWheelContainer {...{ categoryType }} />;
  }
}

const mapStateToProps = ({ pairing }) => ({
  ...pairing
});

export default connect(mapStateToProps)(PairingWheel);
