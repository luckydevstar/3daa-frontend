// CORE
import React from 'react';
import { Link } from 'react-router';
import Isvg from 'react-inlinesvg';

import IconLock from 'images/icon_lock_1.svg';
import IconRemove from 'images/icon_remove.svg';

// Render Signle unit panel
const UnitElement = ({
  unit_id,
  reference,
  title,
  status,
  confirmDeleteUnit,
  level,
  credits,
  guided_learning_hours
}) => {
  return (
    <div className="column is-6">
      <div className="unit-box">
        <div className="columns">
          <div className="column is-9">
            <Link className="unit-link" to={`/units/${unit_id}`}>
              {reference} - {title}{' '}
            </Link>
          </div>
          <div className="column">
            <div className="unit-alert">
              {status === 1 ? (
                <Isvg src={IconLock} />
              ) : (
                <div onClick={() => confirmDeleteUnit(unit_id)}>
                  <Isvg src={IconRemove} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column unit-level is-7">Unit details</div>
          <div className="column is-5 has-text-right">
            <div>Level: {level}</div>
            <div>Credits: {credits}</div>
            <div>Guided Learning Hours: {guided_learning_hours}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitElement;
