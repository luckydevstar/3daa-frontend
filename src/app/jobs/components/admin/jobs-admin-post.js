import React from 'react';

const JobsAdminPost = ({ closeJobPostModal, postJob, form }) => (
  <div className="jobs-admin-post">
    <div className="p-title">
      <p>Ready to post your Advert</p>
    </div>
    <div className="p-s-title">
      <p>You are only a click away from posting your advert</p>
    </div>
    <div className="columns contents">
      <div className="column is-5">
        <div className="map" />
      </div>
      <div className="column is-7 align-items-center">
        <div className="infos">
          <div className="info">
            <p className="i-t">Job Title:</p>
            <p className="i-c">{form.values.title}</p>
          </div>
          {form.values.address && (
            <div className="info">
              <p className="i-t">Venue:</p>
              <p className="i-c">{form.values.address}</p>
            </div>
          )}
          {form.values.salary_min && form.values.salary_max && (
            <div className="info">
              <p className="i-t">Salary:</p>
              <p className="i-c">{`£${form.values.salary_min} to £${
                form.values.salary_max
              }`}</p>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="m-b-20">Click Post to confirm and upload your advert</div>
    <div className="btns">
      <button className="button is-outlined m-10" onClick={closeJobPostModal}>
        Cancel
      </button>
      <button
        className="button is-primary is-outlined m-10"
        onClick={closeJobPostModal}
      >
        Edit
      </button>
      <button className="button is-primary m-10" onClick={postJob}>
        Post
      </button>
    </div>
  </div>
);

export default JobsAdminPost;
