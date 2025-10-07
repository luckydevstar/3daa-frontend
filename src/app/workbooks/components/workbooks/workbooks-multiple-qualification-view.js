import React from 'react';
import PropTypes from 'prop-types';
import QualificationsCarousel from '../qualifications-carousel';
import classNames from 'classnames';
import common from 'app/common';

const UILoading = common.components.UILoading;

const MultipleQualificationView = ({
  qualificationDetails,
  qualifications,
  onQualificationChange,
  managerProgress,
  view,
  loadingQualification,
  activePathwayCta,
  qualManager,
  initialQualificationId,
  onPathwayChange,
  groups,
  qualificationID,
  unitSeparatorClass,
  currentQualificationCard
}) => {
  const cx = classNames(
    'content-section container multiple-qualification-view',
    unitSeparatorClass
  );
  return (
    <div className={cx}>
      <div className="qualification-fixed">
        <div className="card-container">{currentQualificationCard}</div>
      </div>
      <QualificationsCarousel
        {...{
          qualifications,
          onQualificationChange,
          managerProgress,
          activePathwayCta,
          qualManager,
          initialQualificationId,
          onPathwayChange,
          qualificationDetails,
          groups,
          qualificationID
        }}
      />
      <div className="separator">
        {loadingQualification ? <UILoading /> : view}
      </div>
    </div>
  );
};

MultipleQualificationView.defaultProps = {
  qualificationDetails: null,
  view: null
};

MultipleQualificationView.propTypes = {
  qualifications: PropTypes.array.isRequired,
  onQualificationChange: PropTypes.func.isRequired,
  view: PropTypes.element,
  qualificationDetails: PropTypes.object
};
export default MultipleQualificationView;
