import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import classNames from 'classnames';
import { Text } from 'app/intl';

const {
  components: { ProgressBadge },
  util: {
    helpers: { excerpt }
  }
} = common;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const WorkbookCard = ({
  workbook,
  contentManagerMode,
  isSelected,
  isMandatory,
  progressView,
  onClickBookItem
}) => {
  return (
    <div className="workbook-card" onClick={e => onClickBookItem(e)}>
      <div className="fallback-background">
        <div
          className="inner-image"
          style={{
            backgroundImage:
              workbook && workbook.cover
                ? "url('" + workbook.cover + "')"
                : null
          }}
        />
      </div>

      {isSelected && (
        <div className="book-item-ribbon">
          <Text iKey="selected" />
        </div>
      )}
      {isMandatory && (
        <div className="book-item-ribbon">
          <Text iKey="mandatory" />
        </div>
      )}

      <div className="card-content actions">
        <div className="card-separator">
          {contentManagerMode ? (
            !isMandatory && (
              <div className="progress-badge">
                <div
                  className={classNames('content-manager-badge', {
                    selected: isSelected(workbook)
                  })}
                >
                  <i className="fa fa-check check" aria-hidden="true" />
                </div>
              </div>
            )
          ) : progressView && workbook.progress_percentage !== 'undefined' ? (
            <div className="progress-badge">
              <ProgressBadge
                dimensions={40}
                strokeWidth={3}
                percentage={workbook.progress_percentage}
                percentageFontSize={15}
                innerMargin={0}
              />
            </div>
          ) : null}
        </div>

        <div className="title">
          {workbook.title && excerpt(workbook.title, 40)}
        </div>

        <div className="description">
          <div className="learning-hours">
            <Text iKey="guided_learning_hours" />{' '}
            {workbook.guided_learning_hours || 0}
          </div>
          <div className="credit-value">
            <Text iKey="credit_value" /> {workbook.credit_value || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

WorkbookCard.propTypes = {
  workbook: PropTypes.object,
  contentManagerMode: PropTypes.bool,
  isSelected: PropTypes.bool,
  isMandatory: PropTypes.bool,
  onClickBookItem: PropTypes.func
};

WorkbookCard.defaultProps = {
  workbook: {
    cover: null,
    title: '',
    progress_percentage: 0,
    credit_value: 0
  },
  contentManagerMode: false,
  isSelected: false,
  isMandatory: false,
  progressView: true,
  onClickBookItem: e => {}
};

export default WorkbookCard;
