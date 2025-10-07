import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'app/intl';

const WorkbooksCoverLabel = props => {
  const {
    title,
    mandatory,
    creditValue,
    dimension,
    width,
    height,
    padding,
    paddingRight,
    zoom
  } = props;
  return (
    <div
      className="workbooks-cover-label"
      style={{
        width: `${width || dimension}px`,
        height: `${height || dimension}px`,
        padding: `${padding}px`,
        paddingRight: `${paddingRight || padding}px`
      }}
    >
      <div
        className="workbooks-cover-label-logo"
        style={{ zoom: `${zoom}%` }}
      />
      <div className="workbooks-cover-label-title">
        {title}
      </div>
      <div className="workbooks-cover-label-description">
        <div className="workbooks-cover-label-mandatory">
          {mandatory ? 'Unit is mandatory' : "Unit isn't mandatory"}
        </div>
        <div className="workbooks-cover-label-credit-value">
          <Text iKey="credit_value" />: {creditValue}
        </div>
      </div>
    </div>
  );
};

WorkbooksCoverLabel.defaultProps = {
  title: 'There is no title',
  mandatory: 0,
  creditValue: 0,
  dimension: 100,
  padding: 26,
  zoom: 100,
  width: 50,
  height: 50,
  paddingRight: 0
};

WorkbooksCoverLabel.propTypes = {
  title: PropTypes.string,
  mandatory: PropTypes.number,
  creditValue: PropTypes.number,
  dimension: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  paddingRight: PropTypes.number
};

export default WorkbooksCoverLabel;
