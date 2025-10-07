import React, { Component } from 'react';
import { connect } from 'react-redux';
import common from 'app/common';
import * as lodash from 'lodash';
import config from 'brand/config';

import CreateBusinessProfile from '../../components/registration/create-business-profile';
import { Creators as Actions } from '../../actions';

const UISteps = common.components.UISteps;
const convertToFormData = common.util.helpers.convertToFormData;

class RegisterBusinessProfileRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      registrationFlow: config.registrationFlow
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  handleSubmit(values, someFunc, form) {
    const { createProfile, user } = this.props;

    if (lodash.get(form, 'valid')) {
      const file = lodash.get(values, ['cloudinary_file_id', '0']);

      if (file) {
        values.cloudinary_file_id = file;
      }

      const formData = convertToFormData(values);
      createProfile(user, formData);
    }
  }

  render() {
    const { sendingRequest, user } = this.props;
    const { membership_completed } = user;
    const { registrationFlow } = this.state;
    const labels = membership_completed
      ? ['create_account', 'provide_details']
      : ['create_account', 'provide_details', 'begin_membership'];
    const count = labels.length;
    const centre = lodash.get(user, ['centres', '0']);

    return (
      <div className="register container has-text-centered">
        <UISteps
          step={2}
          count={count}
          labels={labels}
          padding={60}
          width="100%"
          showLabel
        />
        <CreateBusinessProfile
          centre={centre}
          loading={sendingRequest}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ form, registration, profile }) => ({
  sendingRequest: lodash.get(registration, 'sendingRequest'),
  user: lodash.get(profile, ['user'])
});

const mapDispatchToProps = dispatch => ({
  createProfile: (user, data) =>
    dispatch(Actions.createBusinessProfileAttempt(user, data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterBusinessProfileRoute);
