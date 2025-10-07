import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { dissoc } from 'ramda';
import common from 'app/common';
import { browserHistory } from 'react-router';
import * as lodash from 'lodash';
import CreatePersonalProfile from '../../components/registration/create-personal-profile';
import CreateInvitationPersonalProfile from '../../components/registration/create-invitation-personal-profile';
import { Creators as Actions } from '../../actions';

const UISteps = common.components.UISteps;
const convertToFormData = common.util.helpers.convertToFormData;

const FORM_NAME = 'register-personal-profile';
class RegisterPersonalProfileRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialFormData: null,
      sendingRequest: false
    };

    this.handleCreateProfile = this.handleCreateProfile.bind(this);
  }

  componentDidMount() {
    const { initialFormData, initializeForm } = this.props;

    if (lodash.get(initialFormData, 'email')) {
      this.setState({ initialFormData: initialFormData });
      initializeForm(initialFormData);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      sendingRequest,
      updatingOwnProfile,
      user,
      initialFormData,
      initializeForm
    } = nextProps;

    if (
      lodash.get(initialFormData, 'email') &&
      lodash.get(this.state, 'initialFormData.email') !=
        lodash.get(initialFormData, 'email')
    ) {
      this.setState({ initialFormData: initialFormData });
      initializeForm(initialFormData);
    }

    if (sendingRequest || updatingOwnProfile) {
      this.setState({ sendingRequest: true });
    } else {
      if (this.state.sendingRequest) {
        // browserHistory.replace(`/register/personal/create/payment`);
        browserHistory.replace(`/register/personal/check/voucher`);
      }
    }
  }

  handleCreateProfile(values, someFunc, form) {
    const { createProfile, updateProfile, params, user } = this.props;

    if (form && form.valid) {
      if (lodash.get(user, 'completed')) {
        const formData = dissoc('email', values);
        updateProfile(formData);
      } else {
        const formData = convertToFormData(dissoc('email', values));
        if (['business', 'centre'].indexOf(params.account_type) >= 0) {
          formData.append('is_business', 1);
        } else {
          formData.append('is_business', 0);
        }
        createProfile(formData, params.account_type);
      }
    }
  }

  render() {
    const { user, sendingRequest, updatingOwnProfile } = this.props;

    return (
      <div className="register container has-text-centered">
        <UISteps
          step={1}
          count={3}
          labels={['create_account', 'provide_details', 'begin_membership']}
          padding={60}
          width="100%"
          showLabel
        />
        {lodash.get(user, 'completed') && (
          <CreateInvitationPersonalProfile
            onRegisterStep={this.handleCreateProfile}
            sendingRequest={sendingRequest || updatingOwnProfile}
            user={user}
          />
        )}
        {user && !lodash.get(user, 'completed') && (
          <CreatePersonalProfile
            onRegisterStep={this.handleCreateProfile}
            sendingRequest={sendingRequest || updatingOwnProfile}
            user={user}
          />
        )}
      </div>
    );
  }
}

const toString = val => (val ? `${val}` : undefined);

const mapStateToProps = ({ profile, registration }) => ({
  activationData: lodash.get(registration, 'activationData'),
  activated: lodash.get(registration, 'activated'),
  sendingRequest: lodash.get(registration, 'sendingRequest'),
  updatingOwnProfile: lodash.get(profile, 'updatingOwnProfile'),
  user: lodash.get(profile, 'user'),
  initialFormData: {
    email: lodash.get(profile, 'user.email', ''),
    gender: lodash.get(profile, 'user.gender', '1'),
    first_name: lodash.get(profile, 'user.first_name', ''),
    last_name: lodash.get(profile, 'user.last_name', ''),
    // password: lodash.get(user, 'password') || lodash.get(registration, 'activationData.password') || '',
    // confirm_password: lodash.get(user, 'confirm_password') || lodash.get(registration, 'activationData.confirm_password') || '',
    date_of_birth: lodash.get(profile, 'user.date_of_birth', ''),
    uk_mobile_number: lodash.get(profile, 'user.uk_mobile_number', '')
  }
});

const mapDispatchToProps = dispatch => ({
  createProfile: (data, acc_type) =>
    dispatch(Actions.createPersonalProfileAttempt(data, acc_type)),
  updateProfile: data => dispatch(Actions.updateOwnProfileAttempt(data)),
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterPersonalProfileRoute);
