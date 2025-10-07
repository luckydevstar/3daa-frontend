import React from 'react';
import { connect } from 'react-redux';
import { path } from 'ramda';

import { FORM_NAME } from './index';

const CommunityModalInviteIqaResult = ({ reset }) => {
  return (
    <div className="modal-invite-iqa__result">
      <div className="modal-invite-iqa__result__title">
        Your IQA has been added
      </div>
      <div className="modal-invite-iqa__result__description">
        Notifications have been sent to the IQA and the Centre
      </div>
      <div>
        <img src="/assets/images/email-sent.svg" alt="" />
      </div>
      <div className="modal-invite-iqa__result__status">
        Emails and notifications have been sent
      </div>
      <button onClick={reset} className="button is-primary">
        Add another IQA
      </button>
    </div>
  );
};

const mapStateToProps = ({ form }) => ({
  formValues: path([FORM_NAME, 'values'], form)
});

export default connect(mapStateToProps)(CommunityModalInviteIqaResult);
