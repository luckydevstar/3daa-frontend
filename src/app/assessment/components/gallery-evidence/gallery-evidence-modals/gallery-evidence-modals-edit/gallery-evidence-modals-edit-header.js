import React from 'react';
import moment from 'moment';
import { path } from 'ramda';

function GalleryEvidenceModalsEditHeader({
  title,
  selectedEvidence,
  selectedEvidenceIndex,
  member
}) {
  const created = path(['created'], selectedEvidence) || '';
  return (
    <div className="gallery-evidence-modal-edit__header">
      <div className="gallery-evidence-modal-edit__header__title">{title}</div>
      <div className="gallery-evidence-modal-edit__header__evidence">
        {selectedEvidence && selectedEvidence.title && (
          <div className="gallery-evidence-modal-edit__header__evidence__name">
            {selectedEvidence.title}
          </div>
        )}
        {selectedEvidence && selectedEvidence.title && (
          <div className="gallery-evidence-modal-edit__header__evidence__item">
            <span>Evidence Tag:</span> {selectedEvidence.title} #
            {selectedEvidenceIndex}
          </div>
        )}
        {member && (
          <div className="gallery-evidence-modal-edit__header__evidence__item">
            <span>Added by:</span> {path(['screen_name'], member)}
          </div>
        )}
        {created && (
          <div className="gallery-evidence-modal-edit__header__evidence__item">
            <span>Date Added:</span> {moment(created).format('DD/MM/YYYY')}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryEvidenceModalsEditHeader;
