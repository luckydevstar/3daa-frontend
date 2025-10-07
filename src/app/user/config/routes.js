import React from 'react';
import { IndexRoute, Route } from 'react-router';

import ProtectedRoute from 'app/user/config/protected-route';

import LoginRoute from '../containers/login/login-route';
import ForgottenPasswordRoute from '../containers/login/forgotten-password-route';
import PasswordResetRoute from '../containers/login/password-reset-route';
import SettingsRoute from '../containers/settings/settings-route';
import SettingsOrganisationRoute from '../containers/settings/settings-organisation-route';
import RegisterRoute from '../containers/registration/register-route';
import RegisterResendVerifyEmailRoute from '../containers/registration/register-resend-verify-email-route';
import RegisterValidationProgresingRoute from '../containers/registration/register-validation-progresing-route';
import RegisterOtherUln from '../containers/registration/register-other-uln';

import RegisterPersonalProfileRoute from '../containers/registration/register-personal-profile-route';
import RegisterBusinessProfileRoute from '../containers/registration/register-business-profile-route';
import RegisterOtherProfileRoute from '../containers/registration/register-other-profile-router';
import RegisterPaymentVourcherCheckRoute from '../containers/registration/register-payment-voucher-check-route';
import RegisterPaymentRoute from '../containers/registration/register-payment-route';
import RegisterPaymentConfirmRoute from '../containers/registration/register-payment-confirm-route';
import RegisterSocialConfirmRoute from '../containers/registration/register-social-confirm-route';

import RegisterActivationRoute from '../containers/registration/register-activation-route';

const UserRoutes = (
  <Route>
    <Route path="login" component={LoginRoute} />
    <Route component={ProtectedRoute}>
      <Route path="user/settings" component={SettingsRoute} />
      <Route
        path="organisation/settings"
        component={SettingsOrganisationRoute}
      />
      <Route
        path="register/other/create/profile"
        component={RegisterOtherProfileRoute}
      />
      <Route
        path="register/business/create/business-profile"
        component={RegisterBusinessProfileRoute}
      />

      <Route
        path="register/:account_type/create/payment"
        component={RegisterPaymentRoute}
      />
      <Route
        path="register/:account_type/payment/confirm"
        component={RegisterPaymentConfirmRoute}
      />
      <Route
        path="register/social/confirmed"
        component={RegisterSocialConfirmRoute}
      />
    </Route>
    <Route
      path="register/:account_type/resend"
      component={RegisterResendVerifyEmailRoute}
    />
    <Route path="password/forgotten" component={ForgottenPasswordRoute} />
    <Route path="password/reset" component={PasswordResetRoute} />
    <Route path="password/reset/:reset_code" component={PasswordResetRoute} />

    <Route path="regiser/profile/uln" component={RegisterOtherUln} />
    <Route
      path="register/:account_type/verify/:verification_key" // account_type: centre, admin, member, business
      component={RegisterValidationProgresingRoute}
    />
    <Route
      path="register/:account_type/activate" // account_type: admin, centre, member
      component={RegisterActivationRoute}
    />
    <Route
      path="register/learner/create/profile"
      component={RegisterOtherProfileRoute}
    />
    <Route
      path="register/:account_type/create/profile"
      component={RegisterPersonalProfileRoute}
    />
    <Route
      path="register/:account_type/check/voucher"
      component={RegisterPaymentVourcherCheckRoute}
    />
  </Route>
);
export default UserRoutes;

// <Route path="centre/verify/:verification_code" component={CentreVerificationRoute} />
