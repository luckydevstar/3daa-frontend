import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as lodash from 'lodash';

import common from 'app/common';
import { Creators as Actions } from 'app/user/actions';

import RegisterTerms from '../../components/registration/register-terms';
import RegisterAdminForm from '../../components/registration/register-admin-form';
import RegisterCentreForm from '../../components/registration/register-centre-form';

const {
  components: { ContentModal, UILoading }
} = common;
class RegisterActivationRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountType: '',
      userData: {}
    };

    this.openTermsModal = this.openTermsModal.bind(this);
    this.closeTermsModal = this.closeTermsModal.bind(this);
    this.handleActivationAttempt = this.handleActivationAttempt.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { params } = this.props;
    this.setState({ accountType: params.account_type });
  }

  /**
   * Record user details and open terms
   * and conditions modal so the user can accept and be signed up.
   */
  openTermsModal(values, someFunc, form) {
    const { activationKey } = this.props;

    if (activationKey && lodash.get(form, 'valid')) {
      const { accountType } = this.state;
      const password = lodash.get(values, 'password', '');
      const confirmPassword = lodash.get(values, 'confirm_password', '');

      let userData = {};

      if (accountType == 'business') {
        userData = { password: password, confirm_password: confirmPassword };
      } else {
        userData = { activation_key: activationKey, password: password };
        if (accountType == 'admin') {
          userData['first_name'] = lodash.get(values, 'first_name');
          userData['last_name'] = lodash.get(values, 'first_name');
        }
      }

      this.setState({ userData: userData });
      setTimeout(() => {
        this.registerTermsModal.open();
      });
    }
  }

  closeTermsModal() {
    this.registerTermsModal.close();
  }

  handleActivationAttempt() {
    const { userData, accountType } = this.state;

    this.props.setActivationData(userData);
    this.props.activationAttempt(userData, accountType);
  }

  render() {
    const { activating, errorCode } = this.props;
    const { accountType, userData } = this.state;

    return (
      <div className="login-container">
        <section className="section">
          <div className="container">
            {accountType == 'admin' ? (
              <RegisterAdminForm
                onSubmitAttempt={this.openTermsModal}
                {...{
                  activating,
                  errorCode
                }}
              />
            ) : (
              <RegisterCentreForm
                onSubmitAttempt={this.openTermsModal}
                {...{
                  activating,
                  errorCode
                }}
              />
            )}
          </div>
        </section>

        <ContentModal
          className="register-terms-modal"
          ref={el => {
            this.registerTermsModal = el;
          }}
        >
          <RegisterTerms
            closePanel={this.closeTermsModal}
            userData={userData}
            onSubmitAttempt={this.handleActivationAttempt}
          />
        </ContentModal>
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  activating: lodash.get(state, 'registration.activating'),
  activated: lodash.get(state, 'registration.activated'),
  activationKey: lodash.get(state, 'registration.activationKey'),
  errorCode: lodash.get(state, 'registration.errorCode')
});

const mapDispatchToProps = dispatch => ({
  setActivationData: activationData => {
    dispatch(Actions.setActivationData(activationData));
  },
  activationAttempt: (userData, accountType) => {
    dispatch(Actions.activationAttempt(userData, accountType));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterActivationRoute);
