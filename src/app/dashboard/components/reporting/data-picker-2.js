import React from 'react';
import PropTypes from 'prop-types';
import ISvg from 'react-inlinesvg';
import common from 'app/common';

const { UISelectDropdown, UIFixedColorPicker } = common.components;
const { noop } = common.util.helpers;

const DataPicker2 = ({
  options,
  optionPlaceholder,
  icon,
  title,
  color,
  onColorChange,
  onSectorChange,
  onDataChange
}) =>
  <div className="data-picker-2 p-30">
    <div className="columns">
      <div className="column is-4">
        <div className="box">
          <ISvg src={icon} />
          <span>
            {title}
          </span>
        </div>
      </div>
      <div className="column">
        <div className="columns">
          <div className="column is-3">
            <UIFixedColorPicker color={color} onChange={onColorChange} />
          </div>
          <div className="column">
            <div className="label m-b-5">Select Sector</div>
            <UISelectDropdown
              dropdownList={options}
              defaultTxt={optionPlaceholder}
              onChange={onSectorChange}
            />
            <div className="label m-t-15 m-b-5">Select data to display</div>
            <div className="control">
              <UISelectDropdown
                dropdownList={options}
                defaultTxt={optionPlaceholder}
                onChange={onDataChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;

DataPicker2.propTypes = {
  options: PropTypes.array,
  optionPlaceholder: PropTypes.string,
  icon: PropTypes.any.isRequired,
  title: PropTypes.string,
  color: PropTypes.string,
  onColorChange: PropTypes.func,
  onSectorChange: PropTypes.func,
  onDataChange: PropTypes.func
};

DataPicker2.defaultProps = {
  options: [
    {
      key: 'a',
      name: 'A'
    },
    {
      key: 'b',
      name: 'B'
    }
  ],
  optionPlaceholder: 'Select',
  title: 'Gauge',
  color: '#00AEA6',
  onColorChange: noop,
  onSectorChange: noop,
  onDataChange: noop
};

export default DataPicker2;
