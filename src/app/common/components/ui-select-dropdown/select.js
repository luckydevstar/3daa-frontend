import React from 'react';

const Select = ({ selectedTxt, defaultTxt }) =>
  <div className="dropdown-display">
    <span className="display">
      {selectedTxt && selectedTxt.name ? selectedTxt.name : defaultTxt}
    </span>
    <span className="icon">
      <i className="fa fa-angle-down" />
    </span>
  </div>;

export default Select;
