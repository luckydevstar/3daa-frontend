import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';
import UserRoles from '../../enums/user-role';
import { Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import config from 'brand/config';

const { Terms, TermsSeg } = common.components;

class RegisterTerms extends Component {
  constructor(props) {
    super(props);
    this.registerUser = this.registerUser.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTryAgain = this.handleTryAgain.bind(this);
    this.state = {
      checked: false,
      startRegistrationFailed: false,
      registrationFlow: config.registrationFlow
    };
  }

  /**
   * Handle a failed registration attempt
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errorCode) {
      this.setState({
        startRegistrationFailed: true
      });
    }
  }

  /**
   * Agreeing to terms and conditions
   */
  handleChange() {
    this.setState({
      checked: !this.state.checked
    });
  }

  /**
   * Register user
   */
  registerUser() {
    const { userData, onSubmitAttempt, registerOther, closePanel } = this.props;
    const { registrationFlow } = this.state;

    if (lodash.isEmpty(userData)) {
      throw new Error('No user passed to the modal');
    }

    if (onSubmitAttempt) {
      onSubmitAttempt();
    } else if (registrationFlow === '2') {
      registerOther(userData);
      closePanel();
    } else {
      this.props.registerAttempt(userData);
    }
  }

  handleTryAgain() {
    this.props.closePanel();
  }

  render() {
    const { startingRegistration, activating, activeForm } = this.props;
    const { checked, startRegistrationFailed } = this.state;

    const attempting = startingRegistration || activating;

    const btnCls = classNames('button is-success', {
      'is-loading': attempting
    });

    const failedBtnCls = classNames('button is-primary is-outlined', {
      'is-loading': attempting
    });

    const failedRegistrationText = (
      <div className="terms-content">
        <h1 className="has-text-centered">Oops!</h1>
        <p className="p-30 has-text-centered">
          Sorry we’re having trouble signing you up right now. This might be our
          fault not yours so please try signing up again.
        </p>
        <div className="has-text-centered">
          <button className={failedBtnCls} onClick={this.handleTryAgain}>
            Ok
          </button>
        </div>
      </div>
    );
    const terms = (
      <div className="terms-content info-container">
        {config.registrationFlow !== '2' && <h3>Terms & Conditions</h3>}
        {config.registrationFlow === '2' && <TermsSeg />}
        {config.registrationFlow !== '2' && <Terms />}
      </div>
    );
    return (
      <div className="inner">
        {startRegistrationFailed ? (
          <div className="flex">{failedRegistrationText}</div>
        ) : (
          <div className="flex">
            {terms}
            <div className="footer">
              <p className="control">
                <label className="custom checkbox">
                  <input
                    type="checkbox"
                    onChange={this.handleChange}
                    checked={this.state.checked}
                  />
                  <span
                    className={classNames('ui', {
                      active: this.state.checked
                    })}
                  />
                  I have read and agree to these Terms and Use
                </label>
              </p>
              <button
                className={btnCls}
                onClick={this.registerUser}
                disabled={attempting || !checked}
              >
                Agree
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

RegisterTerms.propTypes = {
  userData: PropTypes.object,
  activeForm: PropTypes.string,
  onSubmitAttempt: PropTypes.func
};

RegisterTerms.defaultProps = {
  userData: null,
  activeForm: ''
};

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  startingRegistration: lodash.get(state, 'registration.startingRegistration'),
  activating: lodash.get(state, 'registration.activating'),
  errorCode: state.registration.errorCode
});

const mapDispatchToProps = dispatch => ({
  registerOther(user) {
    dispatch(Actions.registerOtherAttempt(user));
  },

  registerAttempt(user) {
    dispatch(Actions.registerAttempt(user));
  },

  sendEducatorEmailAttempt(user) {
    dispatch(Actions.sendEducatorEmailAttempt(user));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTerms);
