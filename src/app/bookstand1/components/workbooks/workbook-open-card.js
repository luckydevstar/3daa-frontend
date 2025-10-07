import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import common from 'app/common';
import { Text } from 'app/intl';

const {
  components: { ProgressBadge, ConvertDraftObjectToHtml },
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

const WorkbookOpenCard = ({
  workbook,
  selectedWorkbooks,
  specification,
  openWorkbookPreview
}) => {
  if (!workbook) return null;

  const { cover, is_mandatory, mandatory } = workbook;

  const isSelected =
    selectedWorkbooks && selectedWorkbooks.includes(workbook.workbook_id);
  const isMandatory = is_mandatory || mandatory;
  const specificationUrl =
    specification && createCloudinaryUrl(specification, 'pdf');

  return (
    <div className="workbook-open-card">
      <div
        className={cx('book', { 'default-cover': !cover })}
        style={
          cover && {
            backgroundImage: "url('" + cover + "')"
          }
        }
      >
        {isSelected ? (
          <div className="book-item-ribbon">
            <Text iKey="selected" />
          </div>
        ) : null}
        {isMandatory && !isSelected ? (
          <div className="book-item-ribbon">
            <Text iKey="mandatory" />
          </div>
        ) : null}
        <div className="progress-badge">
          <ProgressBadge
            dimensions={70}
            strokeWidth={5}
            percentage={workbook.progress_percentage}
          />
        </div>
      </div>
      <Link onClick={openWorkbookPreview} className="button is-primary">
        <Text iKey="open_workbook" />
      </Link>
      {specificationUrl && (
        <Link
          className="button is-primary is-outlined"
          to={specificationUrl}
          target="_blank"
        >
          <Text iKey="specification_pdf" />
        </Link>
      )}
    </div>
  );
};

export default WorkbookOpenCard;
