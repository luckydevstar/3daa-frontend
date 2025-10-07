import React, { useRef } from 'react';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function ProfileMediaAddModal({
  progress,
  uploading,
  isDocument,
  isOpen,
  onClose,
  onFileChange
}) {
  const inputRef = useRef(null);

  const chooseFile = () => {
    if (inputRef) {
      inputRef.current.click();
    }
  };

  const fileChange = e => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const onDrop = e => {
    e.preventDefault();
    const dataTransferFirst = e.dataTransfer.items && e.dataTransfer.items[0];
    const file = dataTransferFirst && dataTransferFirst.getAsFile();
    onFileChange(file);
    setMediaFile(file);
  };

  const onDragOver = e => {
    e.preventDefault();
  };

  return (
    <ContentModalNew
      className="profile-media-documents-new-container"
      size="larger"
      isOpened={isOpen}
      onClose={onClose}
    >
      <div
        className="profile-media-documents-new"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
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
        {progress === 0 && (
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
              onChange={fileChange}
              type="file"
              id="profile-media-documents-new__file-input"
            />
          </div>
        )}
        {progress > 0 && (
          <div>
            <div className="profile-media-documents-new__progress__description">
              {progress > 0 &&
                progress < 100 &&
                'We are just uploading your media this may take moment'}
              {progress === 100 && 'Your media has been added'}
            </div>
            <div className="profile-media-documents-new__progress-track">
              <div className="profile-media-documents-new__progress__title">
                {`Uploading  ${progress}%`}
              </div>
              <div
                className="profile-media-documents-new__progress"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </ContentModalNew>
  );
}

export default ProfileMediaAddModal;
