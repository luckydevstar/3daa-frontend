import React from 'react';
import { Link } from 'react-router';
import { path } from 'ramda';
import common from 'app/common';

const {
  components: { CloudinaryMedia }
} = common;

const DigitalBadges = ({ profile, badges }) => {
  return path(['completed'], profile) ? (
    <div className="profile-section badges-block">
      <div className="profile-title">
        Digital Badges{' '}
        <Link to={`/profile/${profile.member_id}/badges`}>
          <span className="link">View all</span>
        </Link>
      </div>
      <ul className="badges-block__badge-body">
        {badges &&
          badges.digital_badges &&
          badges.digital_badges.map(badge => (
            <div
              className="columns"
              key={`digital-badge-${badge.digital_badge_id}`}
            >
              <div className="column is-4">
                {badge.cloudinary_file_id && (
                  <CloudinaryMedia
                    fileId={badge.cloudinary_file_id}
                    mediaType="image"
                    transformations={{
                      // width: 120,
                      // height: 120,
                      // crop: 'thumb',
                      gravity: 'face'
                    }}
                  />
                )}
              </div>
              <div className="column is-8 is-centered">{badge.title}</div>
            </div>
          ))}
        {(!badges || !badges.digital_badges) && (
          <div className="column is-12">
            <figure className="profile-badges__badge profile-badges__badge--profile" />
          </div>
        )}
      </ul>
    </div>
  ) : null;
};

export default DigitalBadges;
