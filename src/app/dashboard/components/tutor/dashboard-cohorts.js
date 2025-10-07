import React from 'react';
import PropTypes from 'prop-types';
import { filter, propEq } from 'ramda';
import cx from 'classnames';
import common from 'app/common';

import IconCentreDefault from 'images/icon_centre_default.svg';

const {
  components: { ProgressBadge },
  util: {
    helpers: { noop }
  }
} = common;

const ProgressItem = ({
  title,
  qualification_title,
  member_count,
  credit_value,
  progress_percentage,
  mandatory,
  selected,
  onSelect,
  cloudinary_file_id
}) => (
  <div className={cx('progress-list', { active: selected })} onClick={onSelect}>
    <div className="inner border-bottom">
      <div className="p-5">
        <img
          src={cloudinary_file_id || IconCentreDefault}
          style={{ width: '55px' }}
        />
      </div>
      <div className="students b">{member_count}</div>
      <div className="course b">{title}</div>
    </div>
  </div>
);

const DashboardCohorts = ({ centreGroups, selected, onItemSelect }) => (
  <div className="cohorts">
    <div
      className={cx('progress-list')}
      style={{ height: '40px', borderBottom: '0' }}
    >
      <div className="inner">
        <div style={{ minWidth: '64px' }} />
        <div className="students b">Students</div>
        <div className="course b">Course</div>
      </div>
    </div>
    {centreGroups &&
      centreGroups.map((group, i) => (
        <ProgressItem
          key={`pi-${group.group_id}`}
          {...group}
          selected={selected === i}
          onSelect={() => onItemSelect(i)}
        />
      ))}
  </div>
);

DashboardCohorts.propTypes = {
  centreGroups: PropTypes.array,
  onItemSelect: PropTypes.func,
  selected: PropTypes.number
};

DashboardCohorts.defaultProps = {
  centreGroups: [],
  onItemSelect: noop,
  selected: 0
};

export default DashboardCohorts;
