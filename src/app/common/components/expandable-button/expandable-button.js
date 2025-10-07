import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'app/intl';

const ExpandableButton = ({ mainButtonText, expandableButtons }) =>
  <div className="expandable-button">
    <div className="expandable">
      {expandableButtons.map((button, key) =>
        <div
          key={key}
          className="button ex is-primary is-outlined"
          onClick={button[1]}
          disabled={Boolean(button[2])}
        >
          {button[0]}
        </div>
      )}
    </div>
    <div className="button is-primary is-outlined">
      <div className="inner">
        <i className="icon-options" aria-hidden="true" />
        <div className="text">
          <Text iKey={mainButtonText} />
        </div>
      </div>
    </div>
  </div>;

ExpandableButton.propTypes = {
  expandableButtons: PropTypes.array.isRequired,
  mainButtonText: PropTypes.string.isRequired
};

export default ExpandableButton;
