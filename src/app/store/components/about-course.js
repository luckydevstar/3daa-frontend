import React from 'react';
import Qualificaion from 'images/qualifications/qualification-scplh.svg';
import common from 'app/common';

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const { ConvertDraftObjectToHtml } = common.components;

const StoreQualificationAboutCourse = ({ qualification }) => (
  <div className="about-course">
    <h2 className="m-b-40">About the course</h2>
    {qualification && (
      <div className="columns m-t-10">
        <div className="column is-4 has-text-centered">
          {/* <img src={course.badge} alt="qaulification" /> */}
          <h3 className="m-t-25">Digital Award</h3>
          <span>{qualification.title}</span>
        </div>
        <div className="column is-8">
          <ConvertDraftObjectToHtml
            object={qualification && qualification.course_overview}
            errorMesage="No summary"
          />
        </div>
      </div>
    )}
  </div>
);

export default StoreQualificationAboutCourse;
