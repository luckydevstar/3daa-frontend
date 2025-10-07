import React, { useState, useEffect } from 'react';

function UIDropdownContainer({ defaultTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="ui-dropdown-container">
      <div className="ui-dropdown__select">
        <span>{defaultTitle}</span>
        <i className="fa fa-angle-down" />
      </div>
    </div>
  );
}

export default UIDropdownContainer;
