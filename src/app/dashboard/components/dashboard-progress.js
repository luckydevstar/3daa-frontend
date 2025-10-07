import React from 'react';
import common from 'app/common';
import { Text } from 'app/intl';

const { components: { ProgressBadge } } = common;

const DashboardProgress = props => {
  const { centreProfile } = props;
  const {
    learners,
    learners_slots,
    learners_progress,
    qualifications_complete
  } = centreProfile;

  return !Object.keys(centreProfile).length
    ? <div className="not-found-message">
        <Text iKey="msg_could_not_find_profile_data" />
      </div>
    : <div className="inner">
        <div className="active-users progress-badge">
          <ProgressBadge
            dimensions={250}
            strokeWidth={10}
            percentage={learners / learners_slots * 100}
            strokeColorSecondary="rgba(0, 0, 0, .1)"
            strokeColor="#9d0b7b"
            percentageFontSize={76}
            label="msg_of_your_learners_have_onboarded"
            labelFontSize={14}
          />
        </div>
        <div className="progress-badge">
          <ProgressBadge
            dimensions={250}
            strokeWidth={10}
            percentage={learners_progress}
            strokeColorSecondary="rgba(0, 0, 0, .1)"
            strokeColor="#84bc02"
            percentageFontSize={86}
            label="msg_average_progress_of_your_learners"
            labelFontSize={14}
          />
        </div>
        <div className="progress-badge">
          <ProgressBadge
            dimensions={250}
            strokeWidth={10}
            percentage={qualifications_complete}
            strokeColorSecondary="rgba(0, 0, 0, .1)"
            strokeColor="#e97716"
            percentageFontSize={86}
            label="msg_average_completeness_of_your_qualifications"
            labelFontSize={14}
          />
        </div>
      </div>;
};

export default DashboardProgress;
