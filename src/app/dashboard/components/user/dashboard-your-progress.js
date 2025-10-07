import React from 'react';
import PropTypes from 'prop-types';
import { filter, propEq } from 'ramda';
import cx from 'classnames';
import common from 'app/common';

const {
  components: { ProgressBadge },
  util: {
    helpers: { noop }
  }
} = common;

const ProgressItem = ({
  title,
  credit_value,
  progress_percentage,
  mandatory,
  selected,
  onSelect
}) => (
  <div className={cx('progress-list', { active: selected })} onClick={onSelect}>
    <div className="inner">
      <div className="info">
        <div className="progress-title">{title}</div>
        <div className="progress-values">
          <span>Mandatory Unit: {mandatory}</span>
          <span>Credit Value: {credit_value}</span>
        </div>
      </div>
      <div className="badge">
        <ProgressBadge
          dimensions={50}
          strokeWidth={3}
          percentage={progress_percentage}
          strokeColorSecondary="rgba(0, 0, 0, .1)"
          percentageFontSize={18}
        />
      </div>
    </div>
  </div>
);

const DashboardYourProgress = ({ workbooks, selected, onItemSelect }) => (
  <div className="your-progress">
    {workbooks &&
      workbooks.map((workbook, i) => {
        return (
          <ProgressItem
            key={`pi-${workbook.workbook_id}`}
            {...workbook}
            selected={selected === i}
            onSelect={() => onItemSelect(i)}
          />
        );
      })}
  </div>
);

DashboardYourProgress.propTypes = {
  workbooks: PropTypes.array,
  onItemSelect: PropTypes.func,
  selected: PropTypes.number
};

DashboardYourProgress.defaultProps = {
  workbooks: [],
  onItemSelect: noop,
  selected: 0
};

export default DashboardYourProgress;
