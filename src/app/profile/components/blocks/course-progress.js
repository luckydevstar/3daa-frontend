import React from 'react';
import { path } from 'ramda';
import common from 'app/common';
import isAllowedAccess from '../../helpers/helpers';

const {
  components: { ProgressBadge, QualificationLevel, UILoading },
  util: {
    helpers: { createCloudinaryUrl, getCommunityProfilePhotoUrl }
  }
} = common;

const CourseProgress = ({ bio, profile, user, gettingMember }) => {
  const hasProfileImage = path(['cloudinary_file_id'], profile);
  const hasCentre = profile && profile.centres && profile.centres.length > 0;
  const hasBio = bio && bio.experience && bio.experience.length > 0;
  const profilePhotoUrl = profile && getCommunityProfilePhotoUrl(profile);

  return !gettingMember ? (
    <div className="profile-section course-progress">
      <div
        className={`course-progress__badge progress-badge ${hasProfileImage &&
          'course-progress__badge--is-photo'}`}
      >
        <div
          className="course-progress__avatar"
          style={{
            backgroundImage: `url(${createCloudinaryUrl(
              profilePhotoUrl,
              'image'
            )})`
          }}
        />
        {isAllowedAccess(profile, user, 'CENTRE_LEARNER_ROLE') && (
          <ProgressBadge
            dimensions={180}
            strokeWidth={10}
            percentage={
              profile && profile.current_qualification
                ? profile.current_qualification.progress_percentage
                : 0
            }
            percentageFontSize={61}
          />
        )}
      </div>

      {profile ? (
        <h2 className="course-progress__screen-name">{profile.screen_name}</h2>
      ) : null}

      {path(['current_qualification', 'sector'], profile) && (
        <h3 className="course-progress__qualification">
          <QualificationLevel
            {...{ current_qualification: profile.current_qualification }}
          />
        </h3>
      )}

      <dl className="course-progress__details">
        <dt className="course-progress__details-title semibold">Studying at</dt>
        <dd className="course-progress__details-value">
          {hasCentre ? profile.centres[0].centre_name : 'No centre assigned'}
        </dd>
        <dt className="course-progress__details-title semibold">Worked at</dt>
        <dd className="course-progress__details-value">
          {hasBio ? bio.experience[0].title : 'No past experience'}
        </dd>
        {hasCentre && (
          <dt className="course-progress__details-title semibold">Based in</dt>
        )}
        {hasCentre && (
          <dd className="course-progress__details-value">
            {`${profile.centres[0].city} `}
            {profile.centres[0].postcode &&
              `${profile.centres[0].postcode.toString().toUpperCase()}`}
          </dd>
        )}
      </dl>

      <span className="course-progress__identification semibold">
        Member No. {profile && profile.member_id}
      </span>
    </div>
  ) : (
    <div className="profile-section course-progress">
      <UILoading customClass="m-t-25" />
    </div>
  );
};

export default CourseProgress;
