import React from 'react';
import Isvg from 'react-inlinesvg';

import IconMan from 'images/icon_male_profile.svg';
import IconWoMen from 'images/icon_female_profile.svg';
import IconCentreDefault from 'images/icon_centre_default.svg';

import ProgressBadge from '../../common/components/progress-badge/progress-badge';

const CommunityProgressBadge = ({
  cloudinary_file_id,
  profilePhotoId,
  canSeeOthersProgress,
  progress_percentage,
  isLearner,
  gender,
  isCentreCard
}) => (
  <div className="user-badge">
    <ProgressBadge
      dimensions={60}
      strokeWidth={2}
      percentage={canSeeOthersProgress && isLearner ? progress_percentage : 0}
      innerMargin={2}
      percentageFontSize={20}
      image={profilePhotoId}
      hasHover={canSeeOthersProgress && isLearner && true}
    />
    {!cloudinary_file_id && (
      <div className="no-photo">
        {isCentreCard ? (
          <Isvg src={IconCentreDefault} />
        ) : (
          <div>
            {gender == 1 ? <Isvg src={IconMan} /> : <Isvg src={IconWoMen} />}
          </div>
        )}
      </div>
    )}
  </div>
);

export default CommunityProgressBadge;
