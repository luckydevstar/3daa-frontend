import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { UIProgressCircle } = common.components;

const BuildCourseDetails = ({
  mandatory,
  optional,
  credits,
  learningHours
}) => (
  <div className="build-course-details">
    <div className="build-course-progress">
      <UIProgressCircle
        percentage={100}
        strokeWidth={5}
        diameter={200}
        blurSize={10}
      />
      <div className="text">
        <span>100</span>
        <span>%</span>
      </div>
    </div>
    <div>
      <div className="row">
        <span>Mandatory Units</span>
        <span className="value">{mandatory}</span>
      </div>
      <div className="row">
        <span>Optional Units</span>
        <span className="value">{optional}</span>
      </div>
      <div className="row">
        <span>Credits</span>
        <span className="value">{credits}</span>
      </div>
      <div className="row">
        <span>Notional learning hours</span>
        <span className="value">{learningHours}</span>
      </div>
    </div>
  </div>
);

BuildCourseDetails.propTypes = {
  mandatory: PropTypes.number,
  optional: PropTypes.number,
  credits: PropTypes.number,
  learningHours: PropTypes.number
};

BuildCourseDetails.defaultProps = {
  mandatory: 0,
  optional: 0,
  credits: 0,
  learningHours: 0
};

export default BuildCourseDetails;
