import React from 'react';
import { Field, reduxForm } from 'redux-form';
import ExImage from 'images/avatar_example.png';
import common from 'app/common';
import util from 'app/user/util/';

const { FormUtil } = util;

const {
  Form: { dateform: FormDate }
} = common.components;
const { createCloudinaryUrl } = common.util.helpers;

const FORM_NAME = 'declineForm';

const JobsAdminDeclineForm = ({
  declineApplication,
  changeMessage,
  selectedApplication
}) => (
  <div className="jobs-interview-decline">
    {console.log(selectedApplication)}
    <form onSubmit={declineApplication}>
      <div className="i-title">Decline Jamie MaFee Application</div>
      <div className="i-sub-title">
        Please feel free to provide any feedback to the candidate
      </div>
      <div className="m-t-20">
        <b>Applicant</b>
      </div>
      <div className="user-infos m-t-10">
        <span className="photo">
          <img
            src={
              selectedApplication && selectedApplication.cloudinary_file_id
                ? createCloudinaryUrl(selectedApplication.cloudinary_file_id)
                : ExImage
            }
            alt="user avatar"
          />
        </span>
        <span className="name p-l-10">
          {selectedApplication && <p>{selectedApplication.screen_name}</p>}
          <p>Bartender</p>
        </span>
      </div>
      <div className="email-title m-t-30">
        Email title:<p>Private & Confidential</p>
      </div>
      <div className="cover-letter">
        <textarea
          className="textarea"
          name="cover"
          type="text"
          placeholder="Please insert your Cover Letter"
          onChange={changeMessage}
        />
      </div>
      <div className="btns m-t-30">
        <button className="button is-outlined">Cancel</button>
        <button className="button is-primary is-outlined">Skip / Remove</button>
        <button type="submit" className="button is-primary">
          Send
        </button>
      </div>
    </form>
  </div>
);

const JobsAdminDecline = props => {
  return (
    <section className="decline-form">
      <ConnectedForm {...props} />
    </section>
  );
};

const ConnectedForm = reduxForm({ form: FORM_NAME })(JobsAdminDeclineForm);

export default JobsAdminDecline;
