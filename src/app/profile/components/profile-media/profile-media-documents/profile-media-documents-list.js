import React from 'react';
import { cond, equals, always, T } from 'ramda';

function ProfileMediaDocumentsList({
  documents,
  selectedDocument,
  setSelectedDocument
}) {
  return (
    <div className="profile-media-documents-list">
      {documents.map(document => (
        <div
          className="profile-media-documents-list__item"
          onClick={() => {
            setSelectedDocument(document);
          }}
        >
          <input
            type="radio"
            checked={selectedDocument.id === document.id}
            readOnly
          />
          {cond([
            [
              equals('xls'),
              always(
                <img
                  className="profile-media-documents-list__item__format-icon"
                  src="/assets/images/xls-doc-icon.png"
                  alt=""
                />
              )
            ],
            [
              equals('pdf'),
              always(
                <img
                  className="profile-media-documents-list__item__format-icon"
                  src="/assets/images/pdf-doc-icon.png"
                  alt=""
                />
              )
            ],
            [
              T,
              always(
                <img
                  className="profile-media-documents-list__item__format-icon"
                  src="/assets/images/word-doc-icon.png"
                  alt=""
                />
              )
            ]
          ])(document.format)}
          <div className="profile-media-documents-list__item__info">
            <div className="profile-media-documents-list__item__info__title">
              {document.title}
            </div>
            <div className="profile-media-documents-list__item__info__description">
              {document.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfileMediaDocumentsList;
