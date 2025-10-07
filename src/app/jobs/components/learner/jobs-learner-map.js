import React from 'react';
import GoogleMapReact from 'google-map-react';
import Isvg from 'react-inlinesvg';

import IconMapMakerRed from 'images/icon_map_maker_red.svg';
import IconMapMakerGreen from 'images/icon_map_maker_green.svg';
import IconMapMakerBlue from 'images/icon_map_maker_blue.svg';

const JobMarker = ({ text, iconSrc }) => (
  <div className="map-marker">
    <Isvg src={iconSrc} />
    {text}
  </div>
);

const JobsLearnerMap = ({ close, jobs, viewerJob }) => (
  <div className="google-map" onClick={close}>
    <GoogleMapReact
      bootstrapURLKeys={{ key: 'AIzaSyBpUgQiH-C1JHPtX4uYesIUqjvPgou9d80' }}
      defaultCenter={{ lat: jobs[0].lat, lng: jobs[0].lng }}
      defaultZoom={12}
      center={{
        lat: viewerJob ? viewerJob.lat : jobs[0].lat,
        lng: viewerJob ? viewerJob.lng : jobs[0].lng
      }}
    >
      {jobs.map(job => (
        <JobMarker
          key={job.job_id}
          lat={job.lat}
          lng={job.lng}
          iconSrc={IconMapMakerBlue}
        />
      ))}
    </GoogleMapReact>
  </div>
);

export default JobsLearnerMap;
