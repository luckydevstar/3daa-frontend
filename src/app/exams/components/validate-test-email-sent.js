import React from 'react';

import common from 'app/common';

const { ProfileAvatar } = common.components;

const ValidateTestEmailSent = () =>
  <div className="validate-test-email-sent has-text-centered">
    <h1 className="m-b-20">Verification Email Sent</h1>
    <p className="m-b-30">
      A Validation email has been sent to: t.briason@googlemail.com
    </p>
    <div className="avatar">
      <ProfileAvatar avatarSize={160} title={'Profile'} />
    </div>
    <p className="m-t-30 m-b-20">
      Please ask your candidate to check their email to validate the test and
      continue:
    </p>
    <p className="help-block">
      Not received an email - <a>re-send email</a>
    </p>
  </div>;

export default ValidateTestEmailSent;
