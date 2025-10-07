import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from 'redux-form';
import { path, omit, clone } from 'ramda';
import common from 'app/common';
import { browserHistory } from 'react-router';
import * as lodash from 'lodash';
import CreateOtherProfile from '../../components/registration/create-other-profile';
import CreateInvitationPersonalProfile from '../../components/registration/create-invitation-personal-profile';
import { Creators as Actions } from '../../actions';
import { last } from 'lodash';

const UISteps = common.components.UISteps;
const convertToFormData = common.util.helpers.convertToFormData;

const FORM_NAME = 'register-other-profile';
class RegisterOtherProfileRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialFormData: null,
      sendingRequest: false
    };
  }

  componentDidMount() {
    const { initialFormData, initializeForm, router } = this.props;

    const uln = path(['location', 'query', 'uln'], router);
    const lastName = path(['location', 'query', 'lastname'], router);

    if (!uln || !lastName) {
      router.push('/regiser/profile/uln');
      return;
    }

    if (lodash.get(initialFormData, 'email')) {
      const formData = { ...initialFormData, uln, last_name: lastName };
      this.setState({ initialFormData: formData });
      initializeForm(formData);
    }
  }

  handleSubmitAttempt = (values, someFunc, form) => {
    const { router, setProfileWithUln } = this.props;
    const uln = path(['location', 'query', 'uln'], router);
    if (form && form.valid) {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('gender', parseInt(values.gender));
      formData.append('uk_mobile_number', values.uk_mobile_number);
      if (values.profile_photo) {
        formData.append('photo', values.profile_photo[0]);
      }
      formData.append('date_of_birth', values.date_of_birth);
      formData.append('facebook', values.facebook);
      formData.append('twitter', values.twitter);
      formData.append('pinterest', values.pinterest);
      formData.append('linkedin', values.linkedin);
      formData.append('uln', values.uln);
      // const params = {
      //   email: values.email,
      //   first_name: values.first_name,
      //   last_name: values.last_name,
      //   gender: parseInt(values.gender),
      //   uk_mobile_number: values.uk_mobile_number,
      //   date_of_birth: values.date_of_birth,
      //   facebook: values.facebook,
      //   twitter: values.twitter,
      //   pinterest: values.pinterest,
      //   linkedin: values.linkedin
      // };
      // if (values.profile_photo) {
      //   params.photo = values.profile_photo;
      // }
      // if (uln) {
      //   params.uln = uln;
      // }

      const user = clone(
        omit(['birth_year', 'birth_month', 'birth_day', 'photo'], values)
      );

      Object.assign(user, { date_of_birth: values.date_of_birth });

      setProfileWithUln(formData);
    }
  };

  render() {
    const { user, sendingRequest, updatingOwnProfile } = this.props;

    return (
      <div className="register container has-text-centered">
        <CreateOtherProfile
          onRegisterStep={this.handleSubmitAttempt}
          // sendingRequest={sendingRequest || updatingOwnProfile}
          user={user}
        />
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
  updateSettings: (member_id, values) =>
    dispatch(Actions.updateSettingsAttempt(member_id, values)),
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  setProfileWithUln: user => dispatch(Actions.setProfileWithUlnAttempt(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterOtherProfileRoute);
