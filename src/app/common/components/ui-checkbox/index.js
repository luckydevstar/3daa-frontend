import React from 'react';
import cx from 'classnames';

const UICheck = ({ checked, onChange }) => {
  const cname = cx('ui-component-check', { checked });

  return (
    <span className={cname} onClick={onChange}>
      <i className="fa fa-check" aria-hidden="true" />
    </span>
  );
};

export default UICheck;
