import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { UICheckbox } = common.components;
const { noop } = common.util.helpers;

const CourseUnitSelector = ({ title, units, checked, onCourseSelect }) => (
  <div className="course-unit-selector">
    <h3 className="p-b-20">{title}</h3>
    <ul>
      {units.map((unit, i) => (
        <li key={i}>
          <UICheckbox
            {...{
              checked: checked[i],
              onChange: () => onCourseSelect(i, unit)
            }}
          />
          <div className="p-l-10">
            <span>{unit.title}</span>
            <br />
            <span className="is-primary">{unit.credit_value} credit</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

CourseUnitSelector.propTypes = {
  title: PropTypes.string,
  units: PropTypes.array,
  checked: PropTypes.object,
  onCourseSelect: PropTypes.func
};

CourseUnitSelector.defaultProps = {
  title: '',
  units: [],
  checked: PropTypes.object,
  onCourseSelect: noop
};

export default CourseUnitSelector;
