import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { months } = common.util.helpers;

const SideCalendarHeader = ({ month, onBack }) => (
  <div className="side-calendar-header">
    <div className="back-btn" onClick={onBack}>
      <i className="fa fa-arrow-left" />
    </div>
    <span className="month">{months[month]}</span>
    <div className="spacer" />
  </div>
);

SideCalendarHeader.propTypes = {
  month: PropTypes.number,
  onBack: PropTypes.func.isRequired
};

SideCalendarHeader.defaultProps = {
  month: 0
};

export default SideCalendarHeader;
