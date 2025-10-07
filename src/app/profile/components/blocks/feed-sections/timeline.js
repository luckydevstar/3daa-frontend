import React from 'react';
import { prop } from 'ramda';

import Bio from './bio-element';

const Timeline = ({
  bio,
  toggleNewBio,
  toggleEditBio,
  hasEditPermissions,
  onBioDelete
}) => {
  const { experience, education } = bio;

  return (
    <div className="timeline">
      <div className="experience">
        <div className="timeline__title-row">
          <h3 className="timeline__title section-title">Experience</h3>
          {hasEditPermissions && (
            <button
              onClick={() => toggleNewBio({ type: 'experience' })}
              className="button timeline__add-btn"
            >
              Add new &nbsp; <i className="fa fa-plus timeline__add-btn-icon" />
            </button>
          )}
        </div>

        {prop('experience', bio) ? (
          experience.map((item, key) => (
            <Bio
              key={key}
              {...{
                bio: item,
                hasEditPermissions,
                toggleEditBio,
                onBioDelete
              }}
            />
          ))
        ) : (
          <p>No work places added</p>
        )}
      </div>

      <div className="education">
        <div className="timeline__title-row">
          <h3 className="timeline__title section-title">Education</h3>
          {hasEditPermissions && (
            <button
              onClick={() => toggleNewBio({ type: 'education' })}
              className="button timeline__add-btn"
            >
              Add new &nbsp; <i className="fa fa-plus timeline__add-btn-icon" />
            </button>
          )}
        </div>

        {prop('education', bio) ? (
          education.map((item, key) => (
            <Bio
              key={key}
              {...{
                bio: item,
                hasEditPermissions,
                toggleEditBio,
                onBioDelete
              }}
            />
          ))
        ) : (
          <p>No educational centres added</p>
        )}
      </div>
    </div>
  );
};

export default Timeline;
