import React, { useEffect, useRef } from 'react';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function GalleryEvidenceModalsProgress({
  addEvidenceProgress,
  attemptingPostAssessmentEvidence,
  isOpen,
  onClose
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current.open();
    } else {
      modalRef.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!attemptingPostAssessmentEvidence) {
      onClose();
    }
  }, [attemptingPostAssessmentEvidence]);

  return (
    <ContentModalNew
      size="medium"
      onClose={onClose}
      ref={modalRef}
      className="gallery-evidence-modals-progress-container"
    >
      <div className="gallery-evidence-modals-progress">
        <div className="gallery-evidence-modals-progress__title">
          Add Evidence
        </div>
        <div className="gallery-evidence-modals-progress__evidence-progress">
          <img src="/assets/images/evidence-upload-icon.svg" />
          <div className="gallery-evidence-modals-progress__evidence-progress__content">
            <div className="gallery-evidence-modals-progress__evidence-progress__content__title">
              Adding 14 Evidences
              <span>({addEvidenceProgress}%)</span>
            </div>
            <div className="gallery-evidence-modals-progress__evidence-progress__content__line">
              <div
                className="gallery-evidence-modals-progress__evidence-progress__content__line__inner"
                style={{ width: `${addEvidenceProgress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="gallery-evidence-modals-progress__circle" />
      </div>
    </ContentModalNew>
  );
}

export default GalleryEvidenceModalsProgress;
