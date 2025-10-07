import React from 'react';
import Isvg from 'react-inlinesvg';
import moment from 'moment';

import IconMessage from 'images/icon_message.svg';
import IconProfilePerson from 'images/icon_profile_person.svg';

const JobsAdminList = ({
  name,
  declined,
  interview_requested,
  interview_requested_date,
  avatarUrl,
  openInterviewModal,
  openDeclineModal,
  toggleProfileView
}) => (
  <div className="jobs-admin-list">
    <div className="photo">
      <img src={avatarUrl} alt="ex" />
    </div>
    <div className="name">{name}</div>
    <div className="icon">
      <Isvg src={IconMessage} />
    </div>
    <div className="icon" onClick={toggleProfileView}>
      <Isvg src={IconProfilePerson} />
    </div>
    <div className="btns">
      {declined === 0 && interview_requested === 0 && (
        <button className="button is-outlined" onClick={openDeclineModal}>
          Decline
        </button>
      )}
      {declined === 0 && interview_requested === 0 && (
        <button
          className="button is-primary is-outlined"
          onClick={openInterviewModal}
        >
          Interview
        </button>
      )}
      {declined === 1 && <div>Declined</div>}
      {interview_requested === 1 && (
        <div>
          Interview Requested:{' '}
          {moment(interview_requested_date).format('YYYY MMMM DD')}
        </div>
      )}
    </div>
  </div>
);

export default JobsAdminList;
