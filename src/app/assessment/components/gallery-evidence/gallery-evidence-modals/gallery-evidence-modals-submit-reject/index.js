import React, { useEffect, useRef } from 'react';

import common from 'app/common';

const {
  components: { ContentModalNew }
} = common;

function galleryEvidenceModalsSubmitReject(isOpen, onClose) {
  return (
    <ContentModalNew
      size="larger"
      onClose={onClose}
      ref={modalRef}
      className="gallery-evidence-modals-submit-reject"
    >
      <div>
        <div>Activity</div>
        <div>
          <button>Submit</button>
          <button>Reject</button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default galleryEvidenceModalsSubmitReject;
