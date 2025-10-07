import React from 'react';
import { connect } from 'react-redux';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dismiss: false
    };
    this.dismiss = this.dismiss.bind(this);
  }

  componentDidMount() {
    const { duration } = this.props;
    this.timeout = setTimeout(() => this.dismiss(), duration);
  }

  dismiss() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
      this.setState({
        dismiss: true
      });
    }
  }

  render() {
    const { dismiss } = this.state;
    const { children } = this.props;

    return !dismiss && children;
  }
}

export default Timer;
