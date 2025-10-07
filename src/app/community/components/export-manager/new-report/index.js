import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { path } from 'ramda';
import { Link } from 'react-router';
import moment from 'moment';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';

import CreatedResult from './created-result';
import NewReportActivity from './new-report-activity';
import Reports from './reports';
import NewReportModal from './new-report-modal';
import ReportStatusSelect from './report-status-select';
import CentreSelect from './centre-select';
import { Creators } from '../../../actions';

const {
  components: { UILoading, Pagination }
} = common;

const { SuperAdmin } = Roles;

const ITEMS_PER_PAGE = 10;

const ExportManagerNewReport = ({
  centres,
  user,
  csvData,
  createdDate,
  qualifications,
  qualificationsLoading,
  qualificationsTotal,
  selectedQualifications,
  searchQualificationsAttempt,
  selectQualification,
  reportStatus,
  selectReportStatus,
  selectAllQualifications,
  allQualificationsSelected,
  communityGetAllCentresAttempt,
  selectCentre,
  selectedCentre,
  generateExportManagerReportAttempt,
  generateExportManagerReportSuccess
}) => {
  const [search, setSearch] = useState('');
  const [isActivitiesList, setIsActivitiesList] = useState(true);
  const [createdModal, setCreatedModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [page, setPage] = useState(1);
  const timerRef = useRef();

  const getQualifications = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      searchQualificationsAttempt({
        search,
        limit: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
        get_number_of_learners: 1,
        with_total: 1
      });
    }, 300);
  };

  const createClick = () => {
    if (!selectedCentre) {
      return;
    }
    if (
      isActivitiesList &&
      (selectedQualifications.length > 0 || allQualificationsSelected)
    ) {
      setIsActivitiesList(false);
    } else {
      const previousWeek = moment().subtract(1, 'weeks');
      const previousMonth = moment().subtract(1, 'month');
      let startDateLocal = '';
      let endDateLocal = '';

      if (selectedDateRange === 'Past week') {
        startDateLocal = previousWeek.startOf('isoWeek').format('YYYY-MM-DD');
        endDateLocal = previousWeek.endOf('isoWeek').format('YYYY-MM-DD');
      } else if (selectedDateRange === 'Past month') {
        startDateLocal = previousMonth.startOf('month').format('YYYY-MM-DD');
        endDateLocal = previousMonth.endOf('month').format('YYYY-MM-DD');
      } else if (startDate && endDate) {
        startDateLocal = moment(startDate).format('YYYY-MM-DD');
        endDateLocal = moment(endDate).format('YYYY-MM-DD');
      } else {
        return;
      }

      generateExportManagerReportAttempt(selectedCentre.centre_id, {
        status:
          reportStatus && reportStatus.value
            ? reportStatus.value
            : 'not_completed',
        qualification_ids: allQualificationsSelected
          ? []
          : selectedQualifications.map(
              qualification => qualification.qualification_id
            ),
        date_start: startDateLocal || '',
        date_end: endDateLocal || ''
      });
    }
  };

  useEffect(() => {
    if (search) {
      getQualifications();
    }
  }, [search]);

  useEffect(() => {
    if (csvData) {
      setCreatedModal(true);
    }
  }, [csvData]);

  useEffect(() => {
    getQualifications();
  }, [page]);

  useEffect(() => {
    communityGetAllCentresAttempt(null, SuperAdmin);
  }, []);

  return (
    <div className="community-export-manager__body">
      <div className="community-export-manager-new">
        <div className="community-export-manager-new__sidebar">
          <div className="community-export-manager-new__sidebar__logo">
            <img src="/assets/images/logo.png" alt="logo" />
          </div>
          <div className="community-export-manager-new__sidebar__fields">
            <div className="community-export-manager-new__sidebar__fields__search">
              <i className="fa fa-search" aria-hidden="true" />
              <input
                placeholder="Search Qualification"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div
              className="community-export-manager-new__sidebar__fields__checkbox"
              onClick={selectAllQualifications}
            >
              <input type="checkbox" checked={allQualificationsSelected} />
              <lable>All Qualifications</lable>
            </div>
            <div>
              <ReportStatusSelect
                title="Status"
                selectedItem={reportStatus}
                onSelect={selectReportStatus}
              />
              {centres && centres.length > 0 && (
                <CentreSelect
                  title="Centre"
                  centres={centres.filter(centre => centre.screen_name)}
                  selectedItem={selectedCentre}
                  onSelect={selectCentre}
                />
              )}
            </div>
          </div>
          <div className="community-export-manager-new__sidebar__buttons">
            <button
              className="community-export-manager-new__sidebar__buttons__cancel"
              onClick={() => {
                setIsActivitiesList(true);
              }}
            >
              Cancel
            </button>
            <button
              className="community-export-manager-new__sidebar__buttons__create"
              onClick={createClick}
            >
              Create
            </button>
          </div>
          <div className="community-export-manager-new__main__reports__generate">
            <Link to="/community/export_manager">
              <button
                onClick={() => {
                  generateExportManagerReportSuccess(null, null);
                  selectAllQualifications();
                }}
              >
                Generate a New Report
              </button>
            </Link>
          </div>
        </div>
        <div className="community-export-manager-new__main">
          <div className="community-export-manager-new__main__path">
            {`Reports Activity  >  New Report`}
          </div>
          {qualificationsLoading && <UILoading />}
          {isActivitiesList && !qualificationsLoading && (
            <div className="community-export-manager-new__main__activities">
              {qualifications.map(qualification => {
                const selectedQualification = selectedQualifications.find(
                  item =>
                    item.qualification_id === qualification.qualification_id
                );
                return (
                  <NewReportActivity
                    key={qualification.qualification_id}
                    numberOfLearners={qualification.number_of_learners}
                    title={qualification.title}
                    reference={qualification.reference.toString()}
                    selected={!!selectedQualification}
                    onSelect={() => selectQualification(qualification)}
                  />
                );
              })}
              {qualificationsTotal && qualifications.length > 0 && (
                <Pagination
                  itemsLength={qualificationsTotal}
                  itemsPerPage={ITEMS_PER_PAGE}
                  maxPagesDisplayed={3}
                  initialPage={page - 1}
                  onPageChange={setPage}
                  forcePage={page - 1}
                />
              )}
            </div>
          )}
          {!isActivitiesList &&
            selectedQualifications &&
            !qualificationsLoading && (
              <Reports
                {...{
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
                }}
              />
            )}
        </div>
      </div>
      {csvData && (
        <CreatedResult
          {...{
            csvData,
            createdDate,
            user
          }}
        />
      )}
      {createdModal && (
        <NewReportModal
          onClose={() => {
            setCreatedModal(false);
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  ...state.exportManager,
  centres: path(['community', 'centres'])(state),
  user: path(['profile', 'user'])(state)
});

const {
  searchQualificationsAttempt,
  selectQualification,
  selectReportStatus,
  selectAllQualifications,
  getAllCentresAttempt,
  communityGetAllCentresAttempt,
  generateExportManagerReportAttempt,
  generateExportManagerReportSuccess,
  selectCentre
} = Creators;

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      searchQualificationsAttempt,
      selectQualification,
      selectReportStatus,
      selectAllQualifications,
      getAllCentresAttempt,
      selectCentre,
      communityGetAllCentresAttempt,
      generateExportManagerReportAttempt,
      generateExportManagerReportSuccess
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportManagerNewReport);
