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

const FORM_NAME = 'interviewForm';

const JobsAdminInterviewForm = ({
  changeMessage,
  interviewApplication,
  selectedApplication
}) => (
  <div className="jobs-interview-decline">
    <form onSubmit={interviewApplication}>
      <div className="i-title">Request interview Jamie MaFee</div>
      <div className="i-sub-title">
        Your request will be sent to the candidate
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
          {selectedApplication && selectedApplication.screen_name && (
            <p>{selectedApplication.screen_name}</p>
          )}
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
      <div className="i-label m-t-30">Interview Date Request</div>
      <div className="i-date">
        <Field
          id="interview_date"
          name="interview_date"
          minDate="1970-01-01"
          maxDate="2099-12-31"
          component={FormDate}
        />
      </div>
      <div className="btns m-t-30">
        <button className="button is-outlined">Cancel</button>
        <button type="submit" className="button is-primary">
          Send
        </button>
      </div>
    </form>
  </div>
);

const JobsAdminInterview = props => {
  return (
    <section className="interview-form">
      <ConnectedForm {...props} />
    </section>
  );
};

const validate = values => {
  const errors = {};
  FormUtil.validate(values, errors, 'interview_date').validDate();
  return errors;
};

const ConnectedForm = reduxForm({ form: FORM_NAME, validate })(
  JobsAdminInterviewForm
);

export default JobsAdminInterview;
