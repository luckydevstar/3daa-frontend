import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import classNames from 'classnames';
import { Roles } from 'app/core/config/constants';
import WorkbooksEmptyBookstand from './workbooks-empty-bookstand';
import WorkbookCard from './workbook-card';

const {
  SuperAdmin,
  SiteAdmin,
  // CentreAdmin,
  CentreTutor,
  CentreLearner
} = Roles;

const WorkbookCardView = ({
  contentManagerMode,
  workbooks,
  selectedWorkbooks,
  loading,
  searchPhrase,
  onClickBookItem,
  centre_contact_email,
  role
}) => {
  const isSelected = ({ workbook_id, is_mandatory }) =>
    (contentManagerMode && is_mandatory) ||
    selectedWorkbooks.includes(workbook_id);

  const isMandatory = ({ is_mandatory, mandatory }) =>
    !!is_mandatory || !!mandatory;

  let filterResults = workbooks;

  if (searchPhrase) {
    filterResults = filterResults.filter(element =>
      element.title.toLowerCase().includes(searchPhrase.trim().toLowerCase())
    );
  }

  return (
    <div className="workbooks-card-view">
      {loading && <UILoading isLoadingOverlay alignMiddle />}

      {/* Display workbooks or empty view if necessary */}
      {filterResults &&
        (filterResults.length ? (
          filterResults.map((workbook, key) => (
            <WorkbookCard
              key={key}
              workbook={workbook}
              contentManagerMode={contentManagerMode}
              isSelected={isSelected(workbook)}
              isMandatory={isMandatory(workbook)}
              progressView={role != SuperAdmin}
              onClickBookItem={e => onClickBookItem(e, workbook)}
            />
          ))
        ) : (
          <WorkbooksEmptyBookstand
            {...{ role, loading, searchPhrase }}
            centreEmail={centre_contact_email}
          />
        ))}
    </div>
  );
};

WorkbookCardView.propTypes = {
  contentManagerMode: PropTypes.bool,
  workbooks: PropTypes.array,
  selectedWorkbooks: PropTypes.array,
  loading: PropTypes.bool,
  searchPhrase: PropTypes.string
};

WorkbookCardView.defaultProps = {
  contentManagerMode: false,
  workbooks: [],
  selectedWorkbooks: [],
  loading: false,
  searchPhrase: '',
  centre_contact_email: ''
};

export default WorkbookCardView;
