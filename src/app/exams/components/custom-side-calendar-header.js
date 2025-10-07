import React from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import { formatDate } from 'app/common/util/helpers';

import CalenderIcon from 'images/calendar-view.svg';

const CustomSideCalendarHeader = ({
  date,
  toggle,
  handleChange,
  isYearView,
  toggleYearView
}) => (
  <div className="side-calendar-header">
    <div className="sc-left">
      <div
        className="back-btn"
        onClick={() => {
          if (!isYearView) {
            handleChange('left');
          }
        }}
      >
        <i className="fa fa-arrow-left" />
      </div>
      <span className="month" onClick={toggle}>
        {formatDate(date, 'DD MMMM YYYY')}
      </span>
      <div
        className="back-btn next-btn"
        onClick={() => {
          if (!isYearView) {
            handleChange('right');
          }
        }}
      >
        <i className="fa fa-arrow-right" />
      </div>
      <div
        className="side-calendar-icon side-desktop-icon"
        onClick={toggleYearView}
      >
        <Isvg src={CalenderIcon} />
      </div>
    </div>
    <div className="sc-right">
      <div className="side-calendar-icon side-plus-btn">
        <i className="fa fa-plus" />
      </div>
      <div className="side-calendar-icon side-search-btn">
        <i className="fa fa-search" />
      </div>
      <div className="side-calendar-icon side-ellipsis-btn">
        <i className="fa fa-ellipsis-v" />
      </div>
    </div>
  </div>
);

CustomSideCalendarHeader.propTypes = {
  handleChange: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired
};

export default CustomSideCalendarHeader;
