import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'ramda';
import classNames from 'classnames';
import common from 'app/common';
import WorkbooksEmptyBookstand from './workbooks-empty-bookstand';
import { Text } from 'app/intl';

const {
  components: { ProgressBadge, UILoading },
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

const ListView = ({
  workbooks,
  selectedWorkbooks,
  loading,
  searchPhrase,
  onBookItemClick,
  contentManagerMode,
  centre_contact_email,
  role
}) => {
  const isSelected = ({ workbook_id, is_mandatory }) =>
    (contentManagerMode && is_mandatory) ||
    selectedWorkbooks.includes(workbook_id);
  const isMandatory = ({ is_mandatory, mandatory }) =>
    !!is_mandatory || !!mandatory;
  return (
    <div className="workbooks-list-view">
      {loading && <UILoading isLoadingOverlay alignMiddle />}
      {workbooks && !isEmpty(workbooks) ? (
        workbooks.map(workbook => (
          <div
            className="media list-item workbook"
            key={workbook.workbook_id}
            onClick={e => onBookItemClick(e, workbook)}
          >
            <div className="media-left">
              {isSelected(workbook) && (
                <div className="book-item-ribbon">
                  <Text iKey="selected" />
                </div>
              )}
              {!contentManagerMode &&
                isMandatory(workbook) && (
                  <div className="book-item-ribbon">
                    <Text iKey="mandatory" />
                  </div>
                )}
              <div className="fallback-background">
                <div
                  className="book"
                  style={
                    workbook.cover && {
                      backgroundImage: `url(${createCloudinaryUrl(
                        workbook.cover,
                        'image',
                        {
                          width: 156,
                          height: 210,
                          crop: 'fill',
                          gravity: 'center'
                        }
                      )})`
                    }
                  }
                />
              </div>
            </div>
            <div className="media-content">
              <div className="title">{workbook.title}</div>
              <div className="time">
                <Text iKey="guided_learning_hours" />:{' '}
                {workbook.guided_learning_hours || 0}
              </div>
              <div className="value">
                <Text iKey="credit_value" />: {workbook.credit_value || 0}
              </div>
            </div>
            <div className="progress-badge">
              {contentManagerMode ? (
                !isMandatory(workbook) && (
                  <div
                    className={classNames('content-manager-badge', {
                      selected: isSelected(workbook)
                    })}
                  >
                    <i className="fa fa-check check" aria-hidden="true" />
                  </div>
                )
              ) : workbook.progress_percentage !== 'undefined' ? (
                <ProgressBadge
                  dimensions={40}
                  strokeWidth={3}
                  percentage={workbook.progress_percentage}
                  percentageFontSize={16}
                />
              ) : null}
            </div>
          </div>
        ))
      ) : (
        <WorkbooksEmptyBookstand
          {...{ role, loading, searchPhrase }}
          centreEmail={centre_contact_email}
        />
      )}
    </div>
  );
};

ListView.propTypes = {
  workbooks: PropTypes.array,
  selectedWorkbooks: PropTypes.array,
  loading: PropTypes.bool,
  searchPhrase: PropTypes.string,
  centre_contact_email: PropTypes.string
};

ListView.defaultProps = {
  workbooks: [],
  selectedWorkbooks: [],
  loading: false,
  searchPhrase: '',
  centre_contact_email: null
};

export default ListView;
