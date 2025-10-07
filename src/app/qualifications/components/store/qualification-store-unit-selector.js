import React from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';

const { UICheckbox } = common.components;
const { noop } = common.util.helpers;

const isChecked = (unitIds, unit) => unitIds.indexOf(unit.unit_id) >= 0;

const QualificationStoreUnitSelector = ({ units, checked, onUnitSelect }) => (
  <div className="course-unit-selector">
    <ul>
      {units.map((unit, i) => (
        <li key={i}>
          <div className="column is-11 p-t-0 p-b-0">
            <span>{unit.title}</span>
            <br />
            <span className="is-primary">{unit.credit_value} credit</span>
          </div>
          <div className="column p-t-0 p-b-0">
            <UICheckbox
              {...{
                checked: isChecked(checked, unit),
                onChange: () => onUnitSelect(unit)
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  </div>
);

QualificationStoreUnitSelector.propTypes = {
  title: PropTypes.string,
  units: PropTypes.array,
  checked: PropTypes.array,
  onUnitSelect: PropTypes.func
};

QualificationStoreUnitSelector.defaultProps = {
  title: '',
  units: [],
  checked: [],
  onUnitSelect: noop
};

export default QualificationStoreUnitSelector;
