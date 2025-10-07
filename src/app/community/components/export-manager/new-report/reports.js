import React, { useState } from 'react';
import moment from 'moment';
import cx from 'classnames';
import Calendar from 'react-calendar';

const Select = ({
  title,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSelectedDateRange,
  selectedDateRange
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [customDatePicker, setCustomDatePicker] = useState(false);

  const changeDropdownState = () => {
    if (customDatePicker) {
      setCustomDatePicker(false);
      return;
    }
    setDropdownActive(!dropdownActive);
  };

  const openDatePicker = () => {
    setCustomDatePicker(true);
    setDropdownActive(false);
  };

  const selectPastWeek = () => {
    setSelectedDateRange('Past week');
    setStartDate(null);
    setEndDate(null);
    setDropdownActive(false);
  };

  const selectPastMonth = () => {
    setSelectedDateRange('Past month');
    setStartDate(null);
    setEndDate(null);
    setDropdownActive(false);
  };

  return (
    <div className="community-export-manager-new__sidebar__fields__select">
      <div>{title}</div>
      <div
        className={cx('dropdown', {
          'is-active': dropdownActive
        })}
      >
        <div className="dropdown-trigger">
          <button
            onClick={changeDropdownState}
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>
              {!startDate &&
                !endDate &&
                !selectedDateRange &&
                'Select date range'}
              {(startDate || endDate) && (
                <React.Fragment>
                  {startDate ? moment(startDate).format('ddd DD MMM YYYY') : ''}
                  {' - '}
                  {endDate ? moment(endDate).format('ddd DD MMM YYYY') : ''}
                </React.Fragment>
              )}
              {!startDate && !endDate && (selectedDateRange || '')}
            </span>
            <span className="icon is-small">
              <i className="fa fa-angle-down" aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content">
            <a className="dropdown-item" onClick={selectPastWeek}>
              Past week
            </a>
            <a className="dropdown-item" onClick={selectPastMonth}>
              Past month
            </a>
            <a className="dropdown-item" onClick={openDatePicker}>
              Custom date range
            </a>
          </div>
        </div>
      </div>
      {customDatePicker && (
        <div className="community-export-manager-new__sidebar__fields__select__date">
          <div>
            <Calendar
              locale="en-US"
              onChange={value => {
                setStartDate(value);
              }}
              value={startDate}
            />
            <div className="community-export-manager-new__sidebar__fields__select__date__result">
              from:{' '}
              <span>
                {startDate && moment(startDate).format('DD MMMM YYYY')}
              </span>
            </div>
          </div>
          <div>
            <Calendar
              locale="en-US"
              onChange={value => {
                setEndDate(value);
              }}
              value={endDate}
            />
            <div className="community-export-manager-new__sidebar__fields__select__date__result">
              to:{' '}
              <span>{endDate && moment(endDate).format('DD MMMM YYYY')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Reports = ({
  selectedQualifications,
  reportStatus,
  selectQualification,
  selectReportStatus,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSelectedDateRange,
  selectedDateRange
}) => {
  return (
    <React.Fragment>
      <div className="community-export-manager-new__main__reports">
        <div className="community-export-manager-new__main__report">
          <div className="community-export-manager-new__main__report__tags">
            {selectedQualifications.map(qualification => (
              <React.Fragment>
                <div className="community-export-manager-new__main__report__tag">
                  <span>{qualification.title}</span>
                  <div onClick={() => selectQualification(qualification)}>
                    &times;
                  </div>
                </div>
                <div className="community-export-manager-new__main__report__tag">
                  <span>LARA Unit Ref: {qualification.reference}</span>
                  <div onClick={() => selectQualification(qualification)}>
                    &times;
                  </div>
                </div>
              </React.Fragment>
            ))}
            {reportStatus && (
              <div className="community-export-manager-new__main__report__tag">
                <span>{reportStatus.label}</span>
                <div onClick={selectReportStatus}>&times;</div>
              </div>
            )}
            {!reportStatus && (
              <div className="community-export-manager-new__main__report__tag">
                <span>All Learners</span>
                <div />
              </div>
            )}
          </div>
          <div className="community-export-manager-new__main__report__select-wrapper">
            <div className="community-export-manager-new__main__report__select">
              <div className="community-export-manager-new__main__report__select__title">
                Select a date range to create a report
              </div>
              <Select
                {...{
                  startDate,
                  endDate,
                  setStartDate,
                  setEndDate,
                  setSelectedDateRange,
                  selectedDateRange
                }}
              />
            </div>
            <img src="/assets/images/csv_file.png" alt="" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Reports;
