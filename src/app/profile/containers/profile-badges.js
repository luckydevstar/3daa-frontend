import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { path } from 'ramda';
import common from 'app/common';

const {
  components: { CloudinaryMedia }
} = common;

const ProfileBadges = ({ profile, isLoggedInUser, badges }) => {
  return (
    <div className="profile-badges column content-middle">
      <ul className="columns is-multiline">
        {/* isLoggedInUser &&
          <li className="profile-badges__item profile-badges__item--discover column is-one-third">
            <div className="profile-badges__item-body">
              <h3 className="profile-badges__title">New projects to conquer</h3>
              <p className="profile-badges__description">
                Gain recognition for every aspect of your learning and boost your career profile with project achievements.
              </p>
              <Link
                to={`/workbooks`}
                className="profile-badges__discover-btn button is-outlined is-success"
              >
                Discover more projects
              </Link>
            </div>
          </li>*/}

        {path(['completed'], profile) && (
          <li className="profile-badges__item column is-4-desktop is-6-tablet">
            <button
              onClick={() => console.log('click badge')}
              className="profile-badges__item-body"
            >
              <figure className="profile-badges__badge profile-badges__badge--profile" />
            </button>
          </li>
        )}

        {badges &&
          badges.digital_badges &&
          badges.digital_badges.map(badge => (
            <li
              className="profile-badges__item column is-4-desktop is-6-tablet"
              key={`digital-badge-${badge.digital_badge_id}`}
            >
              <div className="card">
                <div className="badge">
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
                <div className="badge-title">{badge.title}</div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

const mapStateToProps = ({ profileBio }) => ({
  ...profileBio
});

// const mapDispatchToProps = dispatch => ({

// });

export default connect(
  mapStateToProps,
  null
)(ProfileBadges);
