import React from 'react';
import PropTypes from 'prop-types';

import SideCalendarHeader from './side-calendar-header';
import CalendarWidget from './calendar-widget';

const SideCalendar = ({ year, month, onBack }) =>
  <div className="side-calendar">
    <SideCalendarHeader
      {...{
        month,
        onBack
      }}
    />
    <CalendarWidget
      {...{
        year,
        month
      }}
    />
    <div className="plugin-data">
      <span>No events</span>
      <h1>PLUGIN DATA - TBA</h1>
    </div>
    <div className="item">
      <span className="date">Today</span>
      <span>Inbox</span>
    </div>
  </div>;

SideCalendar.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  onBack: PropTypes.func.isRequired
};

SideCalendar.defaultProps = {
  year: new Date().getFullYear(),
  month: new Date().getMonth()
};

export default SideCalendar;
