import React from 'react';

function ProfileMediaDocumentsPreview({ selectedDocument }) {
  return (
    <div className="profile-media-documents-preview">
      <div className="profile-media-documents-preview__info">
        <div className="profile-media-documents-preview__info__head">
          <img
            className="profile-media-documents-preview__info__head__format-icon"
            src="/assets/images/xls-doc-icon.png"
            alt=""
          />
          <div className="profile-media-documents-preview__info__head__title-container">
            <div className="profile-media-documents-preview__info__head__title">
              {selectedDocument.title}
            </div>
            <div className="profile-media-documents-preview__info__head__sub-title">
              {selectedDocument.format.toUpperCase()} 3MB
            </div>
          </div>
        </div>
        <div className="profile-media-documents-preview__info__created-approved">
          <div className="profile-media-documents-preview__info__created-approved__title">
            Information
          </div>
          <div className="profile-media-documents-preview__info__created">
            <div>Created</div>
            <span>Date uploaded</span>
          </div>
          <div className="profile-media-documents-preview__info__created">
            <div>Approved</div>
            <span>Date approved by tutor</span>
          </div>
          <div className="profile-media-documents-preview__info__created-approved__border" />
        </div>
        <div className="profile-media-documents-preview__info__criteria">
          <div className="profile-media-documents-preview__info__criteria__title">
            Added to criteria
          </div>
          <div className="profile-media-documents-preview__info__criteria__portfolio">
            <span>Add to portfolio</span>
            <input type="radio" readOnly checked disabled />
          </div>
          <div className="profile-media-documents-preview__info__criteria__portfolio__border" />
        </div>
        <div className="profile-media-documents-preview__info__title-description">
          <div className="profile-media-documents-preview__info__title">
            {selectedDocument.title}
          </div>
          <div className="profile-media-documents-preview__info__description">
            {selectedDocument.description}
          </div>
          <div className="profile-media-documents-preview__info__title-description__border" />
        </div>
        <i className="fa fa-trash-o trash-icon" />
      </div>
      <div className="profile-media-documents-preview__img-container">
        <label htmlFor="profile-media-documents-preview__img">
          <div className="profile-media-documents-preview__img">
            <div className="profile-media-documents-preview__img__edit">
              <i className="fa fa-pencil" />
            </div>
            <div className="profile-media-documents-preview__img__placeholder">
              Image of document contents here
            </div>
          </div>
        </label>
        <input type="file" id="profile-media-documents-preview__img" />
        <div className="profile-media-documents-preview__img__add-cv">
          <span>Add to CV</span>
          <input type="radio" readOnly checked disabled />
        </div>
      </div>
    </div>
  );
}

export default ProfileMediaDocumentsPreview;
