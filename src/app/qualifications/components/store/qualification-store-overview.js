import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { UIProgressCircle } = common.components;

const QualificationStoreOverView = ({
  mandatory,
  optional,
  credits,
  learningHours,
  credits_percent,
  learningHours_percent
}) => (
  <div className="columns">
    <div className="column">
      <div>
        <div className="columns is-centered p-t-10">
          <div className="column">
            <span>Mandatory Units: </span>
            <span className="value" style={{ float: 'right' }}>
              {mandatory}
            </span>
          </div>
          <div className="column" />
        </div>

        <div className="columns is-centered p-t-10">
          <div className="column">
            <span>Optional Units: </span>
            <span className="value" style={{ float: 'right' }}>
              {optional}
            </span>
          </div>
          <div className="column" />
        </div>

        <div className="columns is-centered p-t-10">
          <div className="column">
            <span>Credits: </span>
            <span className="value" style={{ float: 'right' }}>
              {credits}
            </span>
          </div>
          <div className="column" style={{ position: 'relative' }}>
            <UIProgressCircle
              percentage={credits_percent}
              strokeWidth={3}
              diameter={60}
              blurSize={5}
            />
            <div
              className="text"
              style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                textAlign: 'center',
                fontSize: '8px'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                {credits_percent.toFixed()}
              </span>
              <span style={{ fontSize: '14px' }}>%</span>
              <br />
              <span>Complete</span>
            </div>
          </div>
        </div>

        <div className="columns is-centered p-t-10">
          <div className="column">
            <span>Guided learning hours: </span>
            <span className="value" style={{ float: 'right' }}>
              {learningHours}
            </span>
          </div>
          <div className="column" style={{ position: 'relative' }}>
            <UIProgressCircle
              percentage={learningHours_percent}
              strokeWidth={3}
              diameter={60}
              blurSize={5}
            />
            <div
              className="text"
              style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                textAlign: 'center',
                fontSize: '8px'
              }}
            >
              <span style={{ fontSize: '14px' }}>
                {learningHours_percent.toFixed()}
              </span>
              <span style={{ fontSize: '14px' }}>%</span>
              <br />
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

QualificationStoreOverView.propTypes = {
  mandatory: PropTypes.number,
  optional: PropTypes.number,
  credits: PropTypes.number,
  learningHours: PropTypes.number
};

QualificationStoreOverView.defaultProps = {
  mandatory: 0,
  optional: 0,
  credits: 0,
  learningHours: 0,
  credits_percent: 0,
  learningHours_percent: 0
};

export default QualificationStoreOverView;
