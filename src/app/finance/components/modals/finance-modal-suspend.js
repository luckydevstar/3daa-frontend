import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FinanceModalSuspend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Loads the searched friends into the modal
  UNSAFE_componentWillReceiveProps(nextProps) {}

  onSuspend() {}

  render() {
    const { onSuspend, title, content } = this.props;
    return (
      <div className="p-15">
        <div className="has-text-centered">
          <div className="title m-b-30">{title}</div>
          <div style={{ color: 'black' }}>
            <p className="semibold m-b-15">{content}</p>
          </div>
        </div>

        <hr />

        <div className="has-text-centered">
          <button
            className={`button is-primary btn-send`}
            onClick={() => onSuspend()}
          >
            Confirm
          </button>
        </div>
      </div>
    );
  }
}

FinanceModalSuspend.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  onSuspend: PropTypes.func
};

FinanceModalSuspend.defaultProps = {
  title: 'Suspend License',
  content: 'You are about to suspend licenses',

  onSuspend: () => {}
};

export default FinanceModalSuspend;
