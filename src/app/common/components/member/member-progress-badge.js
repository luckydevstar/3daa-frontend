import React from 'react';
import Isvg from 'react-inlinesvg';

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';

import ProgressBadge from '../progress-badge/progress-badge';

const MemberProgressBadge = ({
  cloudinary_file_id,
  profilePhotoId,
  canSeeOthersProgress,
  progress_percentage,
  isLearner,
  gender,
  dimensions,
  visibleNoPhoto
}) => (
  <div className="user-badge">
    <ProgressBadge
      dimensions={dimensions}
      strokeWidth={2}
      percentage={canSeeOthersProgress && isLearner ? progress_percentage : 0}
      innerMargin={2}
      percentageFontSize={20}
      image={profilePhotoId}
      hasHover={canSeeOthersProgress && isLearner && true}
    />
    {!cloudinary_file_id && visibleNoPhoto && (
      <div className="no-photo">
        {gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />}
      </div>
    )}
  </div>
);

export default MemberProgressBadge;
