import React from 'react';
import PropTypes from 'prop-types';

import CalendarHeader from './calendar-header';
import CalendarWidget from './calendar-widget';

const Calendar = ({ year, month, onBack, onNext }) => (
  <div className="calendar">
    <CalendarHeader
      {...{
        month,
        onBack,
        onNext
      }}
    />
    <CalendarWidget
      {...{
        year,
        month
      }}
    />
  </div>
);

Calendar.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  onBack: PropTypes.func.isRequired
};

Calendar.defaultProps = {
  year: new Date().getFullYear(),
  month: new Date().getMonth()
};

export default Calendar;
