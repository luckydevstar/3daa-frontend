import React from 'react';
import * as lodash from 'lodash';

import common from 'app/common';

const { CloudinaryMedia } = common.components;

const DashboardBusinessHeader = ({
  bannerPadding,
  centreProfile,
  isVideoBanner
}) => (
  <section className="dashboard-business-header">
    <div className="hero-bg is-centered">
      {/* <img
        src={centreProfile.cloudinary_file_id}
        // style={{ objectPosition: `0px ${bannerPadding}px` }}
      /> */}
      {lodash.get(centreProfile, 'cloudinary_file_id') ? (
        isVideoBanner ? (
          <video
            className="dashboard-business-header__video"
            muted
            autoPlay
            playsInline
            loop
          >
            <source src={centreProfile.cloudinary_file_id} />
          </video>
        ) : (
          <CloudinaryMedia
            alt={centreProfile.screen_name}
            mediaType="image"
            fileId={centreProfile.cloudinary_file_id}
          />
        )
      ) : (
        <p className="has-text-white is-size-3 has-text-centered">
          Please put your banner image
        </p>
      )}
    </div>
    <div
      className="container content-section"
      style={{ paddingTop: bannerPadding }}
    >
      <h1 className="title">{lodash.get(centreProfile, 'screen_name', '')}</h1>
      <h2 className="subtitle">
        {lodash.get(centreProfile, 'centre_number', '')} <br />
        {`${lodash.get(centreProfile, 'centre_contact_first_name') ||
          ''} ${lodash.get(centreProfile, 'centre_contact_last_name') || ''}`}
      </h2>
    </div>
  </section>
);

export default DashboardBusinessHeader;
