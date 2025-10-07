import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SingleQualificationView = ({ view, card, unitSeparatorClass }) => {
  const cx = classNames(
    'content-section container single-qualification-view',
    unitSeparatorClass
  );
  return (
    <div className={cx}>
      <div className="columns is-mobile">
        <div className="column is-narrow qualification-card-container">
          <div className="card-container">{card}</div>
        </div>
        <div className="column book-items-container">{view}</div>
      </div>
    </div>
  );
};

SingleQualificationView.propTypes = {
  card: PropTypes.element,
  view: PropTypes.element
};

SingleQualificationView.defaultProps = {
  card: null,
  view: null
};

export default SingleQualificationView;
