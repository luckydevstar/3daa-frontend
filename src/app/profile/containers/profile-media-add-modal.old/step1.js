import React from 'react';

const ProfileMediaAddModalStep1 = ({
  mediaFile,
  isImage,
  isVideo,
  changeFile,
  onDrop,
  onDragOver,
  onNext
}) => (
  <div>
    <div className="profile-media-add-modal__title">Add Media</div>
    <label htmlFor="profile-media-add-modal-input">
      <div
        className="profile-media-add-modal__dropzone"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {!mediaFile && (
          <span>
            <div className="profile-media-add-modal__dropzone__title">
              Drop file here
            </div>
            <p>or</p>
            <a>Select media</a>
          </span>
        )}
        {mediaFile && isImage && (
          <img src={URL.createObjectURL(mediaFile)} alt="" />
        )}
        {mediaFile && isVideo && (
          <video controls>
            <source src={URL.createObjectURL(mediaFile)} />
          </video>
        )}
        {mediaFile && <a>Select a different media</a>}
      </div>
      <input
        type="file"
        id="profile-media-add-modal-input"
        onChange={changeFile}
      />
    </label>
    <div className="profile-media-add-modal__footer">
      <button
        type="button"
        className="media-upload__pagination-btn button is-link animate fade-in media-upload__pagination--next init"
        disabled={!mediaFile}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  </div>
);

export default ProfileMediaAddModalStep1;
