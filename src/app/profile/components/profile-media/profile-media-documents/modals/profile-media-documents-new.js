import React, { useRef } from 'react';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function ProfileMediaDocumentsNew({
  isDocument,
  addDocumentModal,
  closeAddDocumentModal
}) {
  const inputRef = useRef(null);

  const chooseFile = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  return (
    <ContentModalNew
      className="profile-media-documents-new-container"
      size="larger"
      isOpened={addDocumentModal}
      onClose={closeAddDocumentModal}
    >
      <div className="profile-media-documents-new">
        <div className="profile-media-documents-new__circle" />
        {!isDocument && (
          <img src="/assets/images/add-image-video-icon.svg" alt="" />
        )}
        {isDocument && (
          <img src="/assets/images/add-document-icon.png" alt="" />
        )}
        <div className="profile-media-documents-new__title">
          {isDocument && 'Add a document'}
          {!isDocument && 'Add Image or Video'}
        </div>
        <div className="profile-media-documents-new__description">
          {isDocument && (
            <div>
              Drag & Drop your document here <br /> [only one document at a
              time]
            </div>
          )}
          {!isDocument && <div>Drag & Drop your image or video here</div>}
          <p>or</p>
          <label htmlFor="profile-media-documents-new__file-input">
            <button
              className="button profile-media-documents-new__choose-btn"
              onClick={chooseFile}
            >
              Choose File
            </button>
          </label>
          <input
            ref={inputRef}
            type="file"
            id="profile-media-documents-new__file-input"
          />
        </div>
      </div>
    </ContentModalNew>
  );
}

export default ProfileMediaDocumentsNew;
