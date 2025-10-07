import React, { useState, useEffect } from 'react';
import cx from 'classnames';

function UISwitch({ isActive, onChange }) {
  const [active, setActive] = useState(false);

  const switchClick = () => {
    if (onChange) {
      onChange(!active);
    }
    setActive(!active);
  };

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  return (
    <div
      className={cx('ui-switch', { 'ui-switch--active': active })}
      onClick={switchClick}
    >
      <div className="ui-switch__inner">
        <div className="ui-switch__inner__circle" />
      </div>
    </div>
  );
}

export default UISwitch;
