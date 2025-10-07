import React from 'react';
import { connect } from 'react-redux';
import { Creators as Actions } from 'app/user/actions';
import common from 'app/common';
import SettingsForm from '../../components/settings/settings-org-profile';

const Footer = common.components.Footer;
const {
  util: {
    helpers: { extractUserCentre }
  }
} = common;

class SettingsRoute extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmitAttempt = this.handleSubmitAttempt.bind(this);

    this.state = {};
  }

  handleSubmitAttempt(values, someFunc, form) {
    const { centre, user } = this.props;
    const params = { ...values };
    let { centre_id } = extractUserCentre(user);

    if (centre.profile) {
      centre_id = centre.profile.centre_id;
    }

    if (form && form.valid) {
      if (params.cloudinary_file_id && params.cloudinary_file_id.length > 0) {
        params.cloudinary_file_id = params.cloudinary_file_id[0];
      }
      if (params.logo && params.logo.length > 0) {
        params.logo = params.logo[0];
      }
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      this.props.attemptCenterUpdate(centre_id, params);
    }
  }

  render() {
    const { attempting, success, failure, centre, user } = this.props;
    let centreProfile = extractUserCentre(user);
    if (centre.profile) {
      centreProfile = centre.profile;
    }
    return (
      <div className="settings-container">
        <section className="section">
          <div className="container">
            <SettingsForm
              centre={centreProfile}
              onSubmitAttempt={this.handleSubmitAttempt}
              attempting={attempting}
              success={success}
              failure={failure}
            />
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  attempting: state.centre.attemptingCentreUpdate,
  success: state.centre.centreUpdateSuccess,
  failure: state.centre.centreUpdateFailure,
  user: state.profile.user,
  centre: state.centre
});

const mapDispatchToProps = dispatch => ({
  attemptCenterUpdate: (centre_id, formData) => {
    dispatch(Actions.updateCentreAttempt(formData, centre_id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsRoute);
