import React, { useEffect, useRef } from 'react';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function GalleryEvidenceModalsAddType({ isOpen, onClose, myDriveClick }) {
  const modalRef = useRef(null);

  const handleMyDriveClick = () => {
    onClose();
    if (myDriveClick) {
      myDriveClick();
    }
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current.open();
    } else {
      modalRef.current.close();
    }
  }, [isOpen]);

  return (
    <ContentModalNew size="medium" onClose={onClose} ref={modalRef}>
      <div className="gallery-evidence-modals-add-type">
        <div className="gallery-evidence-modals-add-type__title">
          Choose where you want to select the Evidence from
        </div>
        <div className="gallery-evidence-modals-add-type__items">
          <div className="gallery-evidence-modals-add-type__item">
            <img src="/assets/images/my-media-icon.png" />
            <div>My Media</div>
          </div>
          <div className="gallery-evidence-modals-add-type__item">
            <img src="/assets/images/learner-media-icon.png" />
            <div>Learner Media</div>
          </div>
          <div
            className="gallery-evidence-modals-add-type__item"
            onClick={handleMyDriveClick}
          >
            <img src="/assets/images/drive-media-icon.png" />
            <div>My Drive</div>
          </div>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default GalleryEvidenceModalsAddType;
