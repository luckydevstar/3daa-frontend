import React from 'react';
import common from 'app/common';
import DashboardProgress from './dashboard-progress';
import DashboardBody from './dashboard-body';
import { Text } from 'app/intl';

const {
  components: { CloudinaryMedia, UILoading },
  util: {
    helpers: { extractUserRole }
  }
} = common;

const CentreDashboard = ({
  user,
  centreSeats,
  centreLearners,
  centreProfile,
  centreQualifications,
  currentSectorTitle
}) => {
  const role = extractUserRole(user);

  return (
    <div className="centre-admin-dashboard-container">
      <div className="dashboard">
        <section className="content-section hero">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">
                <Text iKey="hi" /> {user.first_name}
              </h1>
              <h2 className="subtitle">
                <Text iKey="you_are_browsing" /> {currentSectorTitle}{' '}
                <Text iKey="sector" />
              </h2>
            </div>
          </div>
        </section>
        <div className="dashboard-progress-container">
          <div className="dashboard-progress multiple">
            {!centreProfile ? (
              <UILoading />
            ) : (
              <DashboardProgress {...{ centreProfile }} />
            )}
          </div>
        </div>
      </div>
      {/* <div className="dashboard-video">
        <CloudinaryMedia
          mediaType="video"
          fileId="Cloud_Loop_qhov0h"
          transformations={{ crop: 'fill', quality: 100 }}
          attributes={{ autoPlay: true, loop: true }}
        />
      </div> */}
      <DashboardBody
        {...{ centreQualifications, centreLearners, centreSeats, role }}
      />
    </div>
  );
};

export default CentreDashboard;
