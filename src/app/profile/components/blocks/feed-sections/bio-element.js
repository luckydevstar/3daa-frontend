import React from 'react';
import common from 'app/common';

const CloudinaryMedia = common.components.CloudinaryMedia;

const Bio = ({ bio, hasEditPermissions, toggleEditBio, onBioDelete }) => {
  return (
    <div key={bio.member_bio_id} className="profile-bio item media">
      {hasEditPermissions && (
        <div className="profile-bio__controls">
          <button
            onClick={() => toggleEditBio(bio)}
            className="button profile-bio__edit-btn"
          >
            <i className="fa fa-pencil" />
          </button>

          <button
            onClick={() => onBioDelete(bio)}
            className="button profile-bio__delete-btn"
          >
            <i className="fa fa-trash" />
          </button>
        </div>
      )}

      {bio.cloudinary_file_id ? (
        <CloudinaryMedia
          className="profile-bio__logo media-left"
          mediaType="image"
          fileId={bio.cloudinary_file_id}
          transformations={{
            width: 50,
            height: 50,
            crop: 'fill',
            gravity: 'center'
          }}
        />
      ) : null}
      <div className="media-content">
        <div className="profile-bio__title title semibold">{bio.title}</div>
        <div className="profile-bio__subtitle subtitle">{bio.subtitle}</div>
        <div className="profile-bio__dates dates">
          ({bio.from_date} - {bio.to_date ? bio.to_date : 'Present'})
        </div>
        {bio.description && (
          <div
            className="profile-bio__description"
            dangerouslySetInnerHTML={{
              __html: bio.description.replace(/\n\r?/g, '<br />')
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Bio;
