import React from 'react';
import PropTypes from 'prop-types';
import util from '../../util';

const { months } = util.helpers;

// console.log(helpers);
// const { months } = helpers;

const CalendarHeader = ({ month, onBack, onNext }) => (
  <div className="calendar-header">
    <div className="back-btn" onClick={onBack}>
      <span className="icon clickable">
        <div className="icon-calendar-arrow" />
      </span>
    </div>
    <span className="month">{months[month]}</span>
    <div className="next-btn" onClick={onNext}>
      <span className="icon clickable">
        <div className="icon-calendar-arrow" />
      </span>
    </div>
  </div>
);

CalendarHeader.propTypes = {
  month: PropTypes.number,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};

CalendarHeader.defaultProps = {
  month: 0
};

export default CalendarHeader;
