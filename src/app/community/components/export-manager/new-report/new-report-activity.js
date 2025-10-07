import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const NewReportActivity = ({
  title,
  numberOfLearners,
  selected,
  reference,
  onSelect
}) => (
  <div className="community-export-manager-new__main__activity">
    <div className="community-export-manager-new__main__activity__title">
      {title}
    </div>
    <div className="community-export-manager-new__main__activity__unit">
      LARA Unit Ref: {reference}
    </div>
    <div className="community-export-manager-new__main__activity__info">
      <div className="community-export-manager-new__main__activity__info__assigned">
        <span>Total Learners Assigned</span>
        <span>{numberOfLearners}</span>
      </div>
      <div
        onClick={onSelect}
        className="community-export-manager-new__main__activity__info__select"
      >
        {!selected && <span>Select</span>}
        <div
          className={cx(
            'community-export-manager-new__main__activity__info__select__icon',
            {
              'community-export-manager-new__main__activity__info__select__icon--selected': selected
            }
          )}
        >
          <i className="fa fa-check" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
);

NewReportActivity.propTypes = {
  title: PropTypes.string.isRequired,
  reference: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default NewReportActivity;
