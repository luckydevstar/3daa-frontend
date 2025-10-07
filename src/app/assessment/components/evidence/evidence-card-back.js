import React from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';
import moment from 'moment';

import IconMapMakerRed from 'images/icon_map_maker_red.svg';

const JobMarker = ({ text, iconSrc }) => (
  <div className="map-marker">
    <Isvg src={iconSrc} />
    {text}
  </div>
);

const EvidenceCardBack = props => {
  const { evidence } = props;

  const lat = lodash.get(evidence, 'evidence_details.lat');
  const lng = lodash.get(evidence, 'evidence_details.lng');
  const address = lodash.get(evidence, 'evidence_details.address');
  const center = { lat: lat, lng: lng };
  const created = lodash.get(evidence, 'evidence_details.created') || '';
  const createdBy =
    lodash.get(evidence, 'evidence_details.created_by.screen_name') || '';
  const ip = lodash.get(evidence, 'evidence_details.ip');

  return (
    <div className="evidence-card-back">
      {/* Qualification details */}

      <div className="details-table">
        <ul>
          <li>
            <span>
              <span className="text-head">IP Address: &nbsp;&nbsp;&nbsp;</span>
              <span>{ip}</span>
            </span>
          </li>
          <li style={{ flexDirection: 'column' }}>
            <span className="text-head">Evidence Location:</span>
            <span>{address}</span>
          </li>
          <li style={{ height: '200px' }}>
            {lat && lng && (
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyBpUgQiH-C1JHPtX4uYesIUqjvPgou9d80'
                }}
                center={center}
                defaultZoom={11}
              >
                <JobMarker lat={lat} lng={lng} iconSrc={IconMapMakerRed} />
              </GoogleMapReact>
            )}
          </li>
          <li>
            <span className="text-head">Date Added:</span>
            <span>
              {created &&
                moment(created)
                  .tz('Europe/London')
                  .format('L')}
            </span>
          </li>
          <li>
            <span className="text-head">Added By</span>
            <span>{createdBy}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

EvidenceCardBack.propTypes = {
  evidence: PropTypes.object
};

EvidenceCardBack.defaultProps = {
  evidence: {}
};

export default EvidenceCardBack;
