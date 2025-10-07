import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import classNames from 'classnames';
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

const JobsAdminAdvertLivePreview = ({
  values,
  jobLocationCoords,
  media,
  openJobPostModal,
  user,
  qualifications,
  saveJob,
  jobToEdit,
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
          <p className="l-title">
            {values && values.title ? values.title : 'Job Title'}
          </p>
          <p>
            {values && values.address ? values.address : 'Location Address'}
          </p>
          <p className="m-title">
            {values && values.salary_min && values.salary_max
              ? `£${values.salary_min} ~ £${values.salary_max}`
              : '£ Salary'}
          </p>
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
          {/* <div className="map" /> */}
        </div>
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
          <p>
            {qualification ? qualification.title : 'Qualification required'}
          </p>
        </div>
        <div className="content">
          <p>{(values && values.contact_role) || 'The Role'}</p>
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
          <p>{(values && values.reference) || 'Job Reference'}</p>
        </div>
        <div className="content">
          <p>{(values && values.website) || 'Company Website'}</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  values: getFormValues('jobsAddForm')(state)
});

export default connect(mapStateToProps, null)(JobsAdminAdvertLivePreview);
