import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { includes, path } from 'ramda';

import common from 'app/common';
import GalleryEvidenceModalsEditHeader from './gallery-evidence-modals-edit-header';
import GalleryEvidenceModalsAddUpload from '../gallery-evidence-modals-add/gallery-evidence-modals-add-upload';

const {
  components: { ContentModalNew }
} = common;

function GalleryEvidenceModalsEdit({
  member,
  selectedEvidence,
  selectedEvidenceIndex,
  attemptingPostUpdateAssessmentEvidence,
  isOpen,
  onClose,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Video');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const evidenceEditModal = useRef(null);

  const isImageFile = includes(
    'image',
    file && file.data ? file.data.type : ''
  );
  const isVideoFile = includes(
    'video',
    file && file.data ? file.data.type : ''
  );

  const handleSetFile = file => {
    if (includes('image', file.type) && type === 'Image') {
      setFile({ preview: URL.createObjectURL(file), data: file });
    } else if (includes('video', file.type) && type === 'Video') {
      setFile({ preview: URL.createObjectURL(file), data: file });
    }
    return;
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      file: file ? file.data : null
    });
  };

  useEffect(() => {
    if (isOpen) {
      evidenceEditModal.current.open();
    } else {
      evidenceEditModal.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEvidence) {
      setTitle(selectedEvidence.title || '');
      setDescription(selectedEvidence.description || '');
      setFile(
        selectedEvidence.cloudinary_file_id
          ? {
              preview: selectedEvidence.cloudinary_file_id,
              data: null
            }
          : null
      );
    }
  }, [selectedEvidence]);

  return (
    <ContentModalNew
      size="larger"
      className="unit-overview-modal"
      onClose={onClose}
      ref={evidenceEditModal}
    >
      <div className="gallery-evidence-modal-edit">
        <GalleryEvidenceModalsEditHeader
          {...{
            title: 'Edit Evidence',
            selectedEvidence,
            selectedEvidenceIndex,
            member
          }}
        />
        <GalleryEvidenceModalsAddUpload
          {...{
            isImageFile:
              isImageFile ||
              path(['cloudinary_file_type'], selectedEvidence) === 'image',
            isVideoFile:
              isVideoFile ||
              path(['cloudinary_file_type'], selectedEvidence) === 'video',
            title,
            description,
            type,
            file,
            setTitle,
            setDescription,
            setType,
            onDrop: file => handleSetFile(file)
          }}
        />
        <div className="gallery-evidence-modal-edit__footer">
          <button
            className="button gallery-evidence-modal-edit__footer__button-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={cx(
              'button',
              'gallery-evidence-modal-edit__footer__button-save',
              { 'is-loading': attemptingPostUpdateAssessmentEvidence }
            )}
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default GalleryEvidenceModalsEdit;
