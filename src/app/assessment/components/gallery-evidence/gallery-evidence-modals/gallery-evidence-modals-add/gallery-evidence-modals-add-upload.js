import React from 'react';
import { find, propEq } from 'ramda';

import common from 'app/common';

const {
  components: {
    UIDropdown: { UIDropdownSelect }
  }
} = common;

const evidenceTypes = [
  { key: 1, name: 'Video' },
  { key: 2, name: 'Image' },
  { key: 3, name: 'Document' },
  { key: 4, name: 'Web Link' }
];

function GalleryEvidenceModalsAddUpload({
  file,
  isImageFile,
  isVideoFile,
  isWebLink,
  isDocumentFile,
  title,
  description,
  type,
  setTitle,
  setDescription,
  setType,
  onDrop,
  readOnly
}) {
  const dropHandler = e => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
    if (readOnly || isWebLink) return;
    if (e.dataTransfer.items) {
      const file = e.dataTransfer.items[0].getAsFile();
      onDrop(file);
    }
  };

  const dragOverHandler = e => {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  };

  return (
    <div className="gallery-evidence-modal-add__upload">
      <label htmlFor="gallery-evidence-modal-add__upload__file">
        <div
          className="gallery-evidence-modal-add__upload__dropzone"
          onDrop={dropHandler}
          onDragOver={dragOverHandler}
        >
          {!file && !isWebLink && (
            <div className="gallery-evidence-modal-add__upload__dropzone__upload-image">
              <img src="/assets/images/evidence-upload-image.png" alt="" />
              <div>Select Evidence</div>
            </div>
          )}
          {!file && isWebLink && (
            <div className="gallery-evidence-modal-add__upload__dropzone__upload-image">
              <input type="text" placeholder="Type web link here..." />
            </div>
          )}
          {file && isImageFile && (
            <img
              className="gallery-evidence-modal-add__upload__dropzone__image"
              src={file.preview}
              alt=""
            />
          )}
          {file && isVideoFile && (
            <video playsInline autoPlay muted loop>
              <source src={file.preview} />
            </video>
          )}
          {file && isDocumentFile && (
            <div className="gallery-evidence-modal-add__upload__dropzone__upload-image">
              <img src="/assets/images/document-icon.svg" width="125" />
              {file.data && file.data.name && <div>{file.data.name}</div>}
            </div>
          )}
        </div>
        {!readOnly && !isWebLink && (
          <input
            type="file"
            id="gallery-evidence-modal-add__upload__file"
            onChange={e => {
              onDrop(e.target.files[0]);
            }}
          />
        )}
      </label>
      <div className="gallery-evidence-modal-add__upload__inputs">
        <div className="gallery-evidence-modal-add__upload__input">
          <div className="gallery-evidence-modal-add__upload__input__label">
            <label htmlFor="gallery-evidence-modal-add__title">
              Evidence Title
            </label>
          </div>
          <input
            id="gallery-evidence-modal-add__title"
            className="input"
            placeholder="Provide a title for the Evidence"
            value={title}
            onChange={e => setTitle(e.target.value)}
            readOnly={readOnly}
          />
        </div>
        <div className="gallery-evidence-modal-add__upload__input">
          <div className="gallery-evidence-modal-add__upload__input__label">
            <label>Evidence Type</label>
          </div>
          <UIDropdownSelect
            items={evidenceTypes}
            defaultTitle="Select Type"
            onChange={key => {
              const type = find(propEq('key', key))(evidenceTypes);
              setType(type ? type.name : 'video');
            }}
          />
        </div>
        <div className="gallery-evidence-modal-add__upload__input">
          <div className="gallery-evidence-modal-add__upload__input__label">
            <label htmlFor="gallery-evidence-modal-add__description">
              Evidence Description
            </label>
          </div>
          <textarea
            id="gallery-evidence-modal-add__description"
            className="textarea"
            placeholder="Provide a title for the Evidence"
            value={description}
            onChange={e => setDescription(e.target.value)}
            readOnly={readOnly}
          />
        </div>
      </div>
    </div>
  );
}

export default GalleryEvidenceModalsAddUpload;
