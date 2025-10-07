import React from 'react';
import moment from 'moment';
import common from 'app/common';
import ExImage from 'images/avatar_example.png';
import ExBg from 'images/bg_registration.png';

const { createCloudinaryUrl } = common.util.helpers;

const JobsAdminProfileView = ({
  toggleProfileView,
  openDeclineModal,
  openInterviewModal,
  selectedApplication
}) => (
  <div className="jobs-admin-profile-view">
    <div className="top-nav-bar" onClick={toggleProfileView}>
      <i className="fa fa-chevron-left p-r-15 p-l-20" />
      Back
    </div>
    <div className="media">
      <img src={ExBg} alt="media" />
    </div>
    <div className="main-infos">
      <div className="user-infos p-b-20">
        <div className="photo">
          <img
            src={
              selectedApplication && selectedApplication.cloudinary_file_id
                ? createCloudinaryUrl(selectedApplication.cloudinary_file_id)
                : ExImage
            }
            alt="avatar"
          />
        </div>
        <div className="user-info-and-btns">
          {selectedApplication && (
            <div className="name">{selectedApplication.screen_name}</div>
          )}
          <div>Health and Social Care | Level 2</div>
          <div className="dob m-t-50">
            <p className="p-r-50">15/09 1982</p>
            <p>Based in: Edinburgh</p>
          </div>
          <div className="btns m-t-10">
            {selectedApplication.declined === 0 &&
              selectedApplication.interview_requested === 0 && (
                <button
                  className="button is-outlined m-r-30"
                  onClick={openDeclineModal}
                >
                  Decline
                </button>
              )}
            {selectedApplication.declined === 0 &&
              selectedApplication.interview_requested === 0 && (
                <button
                  className="button is-primary"
                  onClick={openInterviewModal}
                >
                  Request Interview
                </button>
              )}
            {selectedApplication.declined === 1 && (
              <div className="jobs-admin-profile-view__declined">Declined</div>
            )}
            {selectedApplication.interview_requested === 1 && (
              <div className="jobs-admin-profile-view__declined">
                Interview Requested:{' '}
                {moment(selectedApplication.interview_requested_date).format(
                  'YYYY MMMM DD'
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="summary p-b-20">
        <div className="i-title">Personal Statement</div>
        <div className="i-content">
          From studying for my GCSE’s it has always been an ambition of mine to
          study a course that I love and believe in. I have a creative flare and
          enjoy all things that involve digital design through the web and
          applications ever since early secondary school. My work experience
          taught me a lot about the computer industry especially the processes
          that are involved in designing and implementing a web site. I also
          worked as part of the full-time design team and produced work that was
          used in a final product of a brief from a client.
        </div>
      </div>
    </div>
  </div>
);

export default JobsAdminProfileView;
