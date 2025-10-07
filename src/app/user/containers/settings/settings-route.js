import React from 'react';
import { connect } from 'react-redux';

import { clone, omit, path } from 'ramda';
import { Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import SettingsForm from '../../components/settings/settings-form';

const Footer = common.components.Footer;

class SettingsRoute extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmitAttempt = this.handleSubmitAttempt.bind(this);
    this.state = {};
  }

  handleSubmitAttempt(values, someFunc, form) {
    const { router } = this.props;
    const uln = path(['location', 'query', 'uln'], router);
    if (form && form.valid) {
      const date_of_birth = `${values.birth_year}-${values.birth_month}-${values.birth_day}`;

      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      formData.append('gender', parseInt(values.gender));
      formData.append('uk_mobile_number', values.uk_mobile_number);
      if (values.profile_photo) {
        formData.append('photo', values.profile_photo[0]);
      }
      formData.append('date_of_birth', date_of_birth);
      formData.append('facebook', values.facebook);
      formData.append('twitter', values.twitter);
      formData.append('pinterest', values.pinterest);
      formData.append('linkedin', values.linkedin);
      if (uln) {
        formData.append('uln', uln);
      }
      const member_id = this.props.user.member_id;

      const user = clone(
        omit(['birth_year', 'birth_month', 'birth_day', 'photo'], values)
      );

      Object.assign(user, { date_of_birth });

      this.props.attemptSettingsUpdate(member_id, formData);
    }
  }

  handleUpdatePassword = () => {
    const { settingsForm, updateUser, user } = this.props;
    const { values } = settingsForm;
    const { new_password, confirm_password, current_password } = values;
    updateUser({
      member_id: user.member_id,
      values: {
        password_new: new_password,
        password_confirm: confirm_password,
        password_current: current_password
      }
    });
  };

  render() {
    const {
      user,
      attempting,
      success,
      failure,
      settingsForm,
      passwordResetAttempt
    } = this.props;
    return (
      <div className="settings-container">
        <section className="section">
          <div className="container">
            <SettingsForm
              user={user}
              onSubmitAttempt={this.handleSubmitAttempt}
              updatePassword={this.handleUpdatePassword}
              attempting={attempting}
              success={success}
              failure={failure}
              passwordResetAttempt={passwordResetAttempt}
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

/**
 * Redux mappings
 */
const mapStateToProps = state => ({
  attempting: state.settings.attemptingSettingsUpdate,
  success: state.settings.settingsUpdateSuccess,
  failure: state.settings.settingsUpdateFailure,
  user: state.profile.user,
  settingsForm: state.form.settingsForm,
  passwordResetAttempt: state.profile.passwordResetAttempt
});

const mapDispatchToProps = dispatch => ({
  attemptSettingsUpdate: (member_id, formData) => {
    dispatch(Actions.updateSettingsAttempt(member_id, formData));
  },
  updateProfile: user => {
    dispatch(Actions.updateLocalUser(user));
  },
  updateUser: params => {
    dispatch(Actions.updateProfileAttempt(params));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsRoute);
