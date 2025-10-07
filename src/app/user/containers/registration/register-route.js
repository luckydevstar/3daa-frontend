// TODO
// distinguish from where showUploadModal was tiggered

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';
import config from 'brand/config';

import SocialAuthentication from '../../components/login/social-authentication';
import RegisterTerms from '../../components/registration/register-terms';
import RegisterFormLearner from '../../components/registration/learner/register-form-learner';
import RegisterFormEducator from '../../components/registration/educator/register-form-educator';
import RegisterFormOther from '../../components/registration/other/register-form-other';
import UserRole from '../../enums/user-role';

import { Text } from 'app/intl';

import iPhoneVideo from 'brand/videos/iphone.mp4';

import common from 'app/common';

const {
  components: { CloudinaryMedia, Footer, ContentModal }
} = common;

class RegisterRoute extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeForm: UserRole.EDUCATOR_ROLE_ID,
      registrationFlow: config.registrationFlow,
      userData: {}
    };

    this.openTermsModal = this.openTermsModal.bind(this);
    this.closeTermsModal = this.closeTermsModal.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }
  /**
   * Record user details and open terms
   * and conditions modal so the user can accept and be signed up.
   */
  openTermsModal(values, someFunc, form) {
    if (form && form.valid) {
      this.setState({ userData: values });
      this.registerTermsModal.open();
    }
  }

  closeTermsModal() {
    this.registerTermsModal.close();
  }

  /**
   * Switch UI tabs
   */
  handleTabClick(tab) {
    this.setState({ activeForm: tab });
  }

  render() {
    const { activeForm, userData, registrationFlow } = this.state;

    let videoUrl =
      'https://res.cloudinary.com/' +
      config.CLOUD_NAME +
      '/video/upload/registration_cloud_business.mp4';
    if (activeForm === UserRole.LEARNER_ROLE_ID) {
      videoUrl =
        'https://res.cloudinary.com/' +
        config.CLOUD_NAME +
        '/video/upload/registration_cloud_personal.mp4';
    }
    if (config.title === 'CFC') {
      videoUrl =
        'https://cfc-testing.s3.eu-west-1.amazonaws.com/testing/THE+FA+ACADEMY+BANNER+SF.mp4';
    }
    console.log('__STAGING__', __STAGING__);
    return (
      <div className="registration-container">
        <section className="content-section hero no-border">
          <div className="hero-bg">
            <video width="100%" autoPlay loop muted src={videoUrl} />
          </div>
          <div className="hero-overlay" />
          <div className="hero-body">
            <div className="container">
              <div className="columns">
                <div className="column is-7">
                  <h1 className="title">
                    {activeForm === UserRole.LEARNER_ROLE_ID && (
                      <Text
                        iKey="msg_welcome"
                        vals={['title']}
                        translateValue
                      />
                    )}
                    {activeForm !== UserRole.LEARNER_ROLE_ID && (
                      <Text
                        iKey="msg_welcome"
                        vals={['businessTitle']}
                        translateValue
                      />
                    )}
                  </h1>
                  <h2 className="subtitle">
                    {activeForm === UserRole.LEARNER_ROLE_ID && (
                      <React.Fragment>
                        <Text vals={['subPersonalTitle']} translateValue />
                        <br />
                        <Text vals={['subPersonalSubTitle']} translateValue />
                      </React.Fragment>
                    )}
                    {activeForm !== UserRole.LEARNER_ROLE_ID && (
                      <React.Fragment>
                        <Text vals={['subBusinessTitle']} translateValue />
                        <br />
                        <Text vals={['subBusinessSubTitle']} translateValue />
                      </React.Fragment>
                    )}
                  </h2>
                  <div className="app-stores">
                    <Text iKey="download_learner_application" />
                    <div className="align-left">
                      <div className="google" />
                      <div className="apple" />
                    </div>
                  </div>
                </div>
                {config.uiIsBannerVideo && (
                  <div className="column is-5 iphone">
                    <video autoPlay loop>
                      <source src={iPhoneVideo} type="video/mp4" />
                    </video>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="form-tabs">
          {!__STAGING__ && (
            <div
              className={classNames('tab', {
                active: activeForm === UserRole.EDUCATOR_ROLE_ID
              })}
              onClick={() => this.handleTabClick(UserRole.EDUCATOR_ROLE_ID)}
            >
              <Text vals={['regBusinessTab']} translateValue />
            </div>
          )}
          {config.uiIsPersonalRegistration && (
            <div
              className={classNames('tab', {
                active: activeForm === UserRole.LEARNER_ROLE_ID
              })}
              onClick={() => this.handleTabClick(UserRole.LEARNER_ROLE_ID)}
            >
              <Text vals={['regPersonalTab']} translateValue />
            </div>
          )}
        </div>
        <div className="content-section form p-b-50">
          <div className="container">
            <div className="description separated">
              {activeForm === UserRole.LEARNER_ROLE_ID ? (
                <div className="fs-16">
                  <Text vals={['regPersonalDesc1']} translateValue />
                  <p className="m-t-20">
                    <Text vals={['regPersonalDesc2']} translateValue />
                  </p>
                  <p className="m-t-20">
                    <Text vals={['regPersonalDesc3']} translateValue />
                  </p>
                  <p className="m-t-20">
                    <Text vals={['regPersonalDesc4']} translateValue />
                  </p>
                </div>
              ) : (
                <div className="fs-16">
                  <Text vals={['regBusinessDesc1']} translateValue />
                  <p className="m-t-20">
                    <Text vals={['regBusinessDesc2']} translateValue />
                  </p>
                  <p className="m-t-20">
                    <Text vals={['regBusinessDesc3']} translateValue />
                  </p>
                  <p className="m-t-20">
                    <Text vals={['regBusinessDesc4']} translateValue />
                  </p>
                </div>
              )}
            </div>

            {!__STAGING__ && registrationFlow !== '2' && (
              <div>
                {activeForm === UserRole.LEARNER_ROLE_ID ? (
                  <RegisterFormLearner
                    onRegisterAttempt={this.openTermsModal}
                  />
                ) : null}
                {activeForm === UserRole.EDUCATOR_ROLE_ID ? (
                  <RegisterFormEducator
                    initialValues={{ is_business: 1 }}
                    onRegisterAttempt={this.openTermsModal}
                  />
                ) : null}
              </div>
            )}
            {registrationFlow === '2' && (
              <RegisterFormOther onRegisterAttempt={this.openTermsModal} />
            )}

            {/* Social link(s) */}
            {activeForm === UserRole.LEARNER_ROLE_ID &&
            config.uiIsSocialLogin ? (
              <div>
                <div className="or">
                  <Text iKey="or" />
                </div>
                <h3>
                  <Text iKey="sign_up_with_social_media" />
                </h3>
                <SocialAuthentication mode="signup" />
              </div>
            ) : null}
            {/* <p>
              <Text
                iKey="by_clicking_on_sign_in_you_agree"
                vals={['title']}
                translateValue
              />
              <br />
              <Link to="/terms-and-use">
                <Text iKey="terms_and_conditions" />
              </Link>
              {', '}
              <Link to="/privacy">
                <Text iKey="privacy_policy" />
              </Link>{' '}
              <Text iKey="and" />{' '}
              <Link to="/cookie">
                <Text iKey="cookie_policy" />
              </Link>
            </p> */}
          </div>
        </div>
        <ContentModal
          className="register-terms-modal"
          ref={el => {
            this.registerTermsModal = el;
          }}
        >
          <RegisterTerms
            closePanel={this.closeTermsModal}
            activeForm={activeForm}
            userData={userData}
          />
        </ContentModal>
        <Footer />
      </div>
    );
  }
}

RegisterRoute.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RegisterRoute;
