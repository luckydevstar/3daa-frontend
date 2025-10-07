import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { components: { ProgressBadge } } = common;

const LearnerCard = props => {
  return (
    <div className="workbooks-learner-card">
      <div className="badge-container">
        <ProgressBadge
          dimensions={60}
          strokeWidth={4}
          innerMargin={1}
          percentage={props.courseProgress}
          percentageFontSize={20}
          image={props.profileImage}
        />
      </div>
      <div className="data-container">
        <div className="top-section">
          <div className="full-name">
            {props.fullName}
          </div>
          <div className="centre-name">
            {props.centreName}
          </div>
        </div>
        <div className="qualification-progress">
          Completed:{' '}
          <b>{`${props.unitsCompleat} of ${props.unitsTotal} Units`}</b>
        </div>
      </div>
      <div className="button-close" onClick={() => props.onClose()} />
    </div>
  );
};

LearnerCard.propTypes = {
  fullName: PropTypes.string,
  centreName: PropTypes.string,
  unitsTotal: PropTypes.number,
  unitsCompleat: PropTypes.number,
  profileImage: PropTypes.string,
  courseProgress: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

LearnerCard.defaultProps = {
  fullName: null,
  centreName: null,
  unitsTotal: 0,
  unitsCompleat: 0,
  profileImage: 'assets/user_card_seat_olhtg1',
  courseProgress: 0
};

export default LearnerCard;
