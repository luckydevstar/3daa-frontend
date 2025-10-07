import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import Isvg from 'react-inlinesvg';
import common from 'app/common';

import IconMapMakerBlue from 'images/icon_map_maker_blue.svg';

const { createCloudinaryUrl } = common.util.helpers;

const JobMarker = ({ text, iconSrc }) => (
  <div className="map-marker">
    <Isvg src={iconSrc} />
    {text}
  </div>
);

const JobsAdminApprenticeshipLivePreview = ({
  values,
  jobLocationCoords,
  media,
  openJobPostModal,
  user,
  jobToEdit,
  qualifications,
  saveJob,
  jobDeleteClick
}) => {
  const qualification =
    values &&
    values.qualifications &&
    qualifications.find(q => q.qualification_id === +values.qualifications);
  return (
    <div className="jobs-admin-live-preview">
      <div className="fixed-controls-bar">
        <div className="b-title">Live Preview</div>
        <div
          className="btn align-right p-r-20 cursor-pointer"
          onClick={saveJob}
        >
          Save
        </div>
        {jobToEdit && (
          <div
            className="btn align-left p-l-20 border-left cursor-pointer"
            onClick={jobDeleteClick}
          >
            Delete
          </div>
        )}
        <div className="place">
          <button className="button is-primary" onClick={openJobPostModal}>
            Place Advert
          </button>
        </div>
      </div>
      <div className="contents">
        <div className="content">
          <p className="l-title">{(values && values.title) || 'Job Title'}</p>
          <p>{(values && values.address) || 'Location Address'}</p>
        </div>
        <div className="map-zone">
          <div className="map">
            <div
              className={classNames('map-container', {
                'map--hidden': !jobLocationCoords
              })}
            >
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyBpUgQiH-C1JHPtX4uYesIUqjvPgou9d80'
                }}
                defaultCenter={{ lat: 51.509865, lng: -0.118092 }}
                center={jobLocationCoords}
                defaultZoom={11}
                yesIWantToUseGoogleMapApiInternals
              >
                {jobLocationCoords && (
                  <JobMarker
                    lat={jobLocationCoords.lat}
                    lng={jobLocationCoords.lng}
                    iconSrc={IconMapMakerBlue}
                  />
                )}
              </GoogleMapReact>
            </div>
          </div>
        </div>
        {media.length === 0 && (
          <div className="content">
            <p className="m-title">Media:</p>
          </div>
        )}
        {media.length > 0 && (
          <div className="media-zone">
            <div className="media-list">
              {media.map((m, i) => (
                <div className="one" key={i}>
                  <div className="media">
                    <img src={m.url} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="content">
          <p className="m-title">
            {(values && values.salary) || 'Salary / Weekly wage'}
          </p>
        </div>
        <div className="content">
          <p>
            {values &&
            values.apprenticeship_week_start &&
            values.apprenticeship_week_end
              ? `${values.apprenticeship_week_start} - ${values.apprenticeship_week_end}`
              : 'Working week'}
          </p>
        </div>
        <div className="content">
          <p>
            {(values && values.apprenticeship_working_week_details) ||
              'Additional Details'}
          </p>
        </div>
        <div className="content">
          <p>
            {values && values.working_hours_per_week
              ? `${values.working_hours_per_week} Hrs`
              : 'Total hours per week'}
          </p>
        </div>
        <div className="content">
          <p>
            {values && values.apprenticeship_duration
              ? `${values.apprenticeship_duration} Yrs`
              : 'Apprenticeship duration'}
          </p>
        </div>
        <div className="content">
          <p>
            {values &&
            (values.possibleStartDay ||
              (values.possibleStartMonth && values.possibleStartYear))
              ? `${values.possibleStartDay || ''} ${
                  values.possibleStartMonth
                    ? moment()
                        .month(values.possibleStartMonth)
                        .format('MMMM')
                    : ''
                } ${values.possibleStartYear || ''}`
              : 'Possible Start date'}
          </p>
        </div>
        <div className="content">
          <p>
            {(values && values.apprenticeship_level) || 'Apprenticeship Level'}
          </p>
        </div>
        <div className="content">
          <p>
            {values && values.experience_min && values.experience_max
              ? `${values.experience_min} Yrs - ${values.experience_max} Yrs`
              : 'Experience Required'}
          </p>
        </div>
        <div className="content">
          <p>{(values && values.description) || 'Additional Details'}</p>
        </div>
        <div className="content">
          <p>{(values && values.desired_skills) || 'Desired skills'}</p>
        </div>
        <div className="content">
          <p>{(values && values.personal_qualities) || 'Personal qualities'}</p>
        </div>
        <div className="content">
          <p>
            {qualification ? qualification.title : 'Qualification required'}
          </p>
        </div>
        <div className="content">
          <p>
            {(values && values.additional_qualifications_required) ||
              'Additional Qualifications required'}
          </p>
        </div>
        <div className="content">
          <p>{(values && values.future_prospects) || 'Future prospects'}</p>
        </div>
        <div className="content">
          <p>{(values && values.about_employer) || 'About the employer'}</p>
        </div>
        <div className="content">
          <p>Address</p>
        </div>
        <div className="content">
          <p>Training provider</p>
        </div>
        <div className="content">
          <p>
            {(values && values.apprenticeship_framework) ||
              'Apprenticeship framework'}
          </p>
        </div>
        <div className="content">
          <p>{(values && values.contact) || 'Contact'}</p>
        </div>
        <div className="message-zone">
          <div className="columns">
            <div className="column is-3 photo">
              <img src={createCloudinaryUrl(user.photo)} />
            </div>
            <div className="column is-4 desc">
              {`This job is advertised by ${user.first_name} ${user.last_name}`}
            </div>
          </div>
        </div>
        <div className="content">
          <p>{(values && values.website) || 'Company Website'}</p>
        </div>
        <div className="content">
          <p>{(values && values.reference) || 'Job Reference'}</p>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = state => ({
  values: getFormValues('jobsAddForm')(state)
});

export default connect(
  mapStateToProps,
  null
)(JobsAdminApprenticeshipLivePreview);
