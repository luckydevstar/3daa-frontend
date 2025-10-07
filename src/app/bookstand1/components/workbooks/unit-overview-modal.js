import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import common from 'app/common';
import { Text } from 'app/intl';
import WorkbookOpenCard from './workbook-open-card';

const {
  components: { ProgressBadge, ConvertDraftObjectToHtml },
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

const UnitOverviewModal = ({
  workbook,
  openWorkbookPreview,
  handleWorkbookSelect,
  selectedWorkbooks
}) => {
  if (!workbook) return null;

  const {
    overview,
    title,
    credit_value,
    cover,
    is_mandatory,
    guided_learning_hours,
    specification,
    mandatory
  } = workbook;

  const isSelected =
    selectedWorkbooks && selectedWorkbooks.includes(workbook.workbook_id);
  const isMandatory = is_mandatory || mandatory;

  return (
    <div>
      <section className="unit-overview-modal-container">
        <div className="sidebar">
          <WorkbookOpenCard
            {...{
              workbook,
              selectedWorkbooks,
              specification,
              mandatory,
              openWorkbookPreview
            }}
          />
        </div>
        <div className="description inner-padding">
          <div className="title">{title}</div>
          <div className="subtitle">
            <Text iKey="workbook_overview" />
          </div>
          <div className="value m-b-5">
            <Text iKey="guided_learning_hours" />:{' '}
            <b>{guided_learning_hours || 0}</b>
          </div>
          <div className="value">
            <Text iKey="credit_value" />: <b>{credit_value || 0}</b>
          </div>
          {overview && (
            <ConvertDraftObjectToHtml className="overview" object={overview} />
          )}
        </div>
      </section>
      {handleWorkbookSelect && (
        <section className="unit-overview-modal-footer">
          {isSelected ? (
            <div className="selected-info">
              {isMandatory
                ? 'Mandatory workbooks can not be removed.'
                : 'This workbook is now added to your qualification'}
            </div>
          ) : (
            <div />
          )}
          <div
            className={cx(
              'button',
              { 'is-success': !isSelected },
              { 'is-danger is-outlined': isSelected }
            )}
            onClick={() => handleWorkbookSelect(workbook)}
            disabled={isMandatory}
          >
            {isSelected ? 'Remove' : 'Add'}
          </div>
        </section>
      )}
    </div>
  );
};

export default UnitOverviewModal;
