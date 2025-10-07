import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';

import IconCentres from 'images/icon_centres.svg';
import IconGroup from 'images/icon_group.svg';

const CentreSummary = ({ title, userSummary }) => {
  return (
    <div className="dashboard-total-centres box chart-block">
      <div className="block-header">
        <h4 className="opensans-semibold">{title}</h4>
      </div>
      <div className="block-content">
        <div className="n-card">
          <Isvg src={IconCentres} /> {userSummary && userSummary.centres}
        </div>
      </div>
      <div className="block-header">
        <h4 className="opensans-semibold">Total Learners</h4>
      </div>
      <div className="block-content">
        <div className="n-card">
          <Isvg src={IconGroup} /> {userSummary && userSummary.learners}
        </div>
      </div>
    </div>
  );
};

CentreSummary.propTypes = {
  title: PropTypes.string
};

CentreSummary.defaultProps = {
  title: 'Total Centres'
};

export default CentreSummary;
