import React from 'react';
import cx from 'classnames';

const GalleryEvidenceItem = ({
  evidence,
  selectedEvidence,
  setSelectedEvidence
}) => (
  <div
    className={cx('gallery-evidence__items__block__slide__item', {
      'gallery-evidence__items__block__slide__item--active':
        selectedEvidence &&
        selectedEvidence.learning_progress_evidence_id ===
          evidence.learning_progress_evidence_id
    })}
    onClick={() => {
      setSelectedEvidence(evidence);
    }}
  >
    {evidence.cloudinary_file_id &&
      evidence.cloudinary_file_type === 'image' && (
        <img
          className="gallery-evidence__items__block__slide__item__img"
          src={evidence.cloudinary_file_id}
          alt=""
        />
      )}
    {evidence.cloudinary_file_id && evidence.cloudinary_file_type === 'video' && (
      <video>
        <source src={evidence.cloudinary_file_id} />
      </video>
    )}

    {evidence.cloudinary_file_id && evidence.cloudinary_file_type === 'file' && (
      <div className="gallery-evidence__items__block__slide__item__file">
        <div className="gallery-evidence__items__block__slide__item__file__inner">
          <img src="/assets/images/document-icon.svg" />
        </div>
        <div className="gallery-evidence__items__block__slide__item__file__title">
          {evidence.title}
        </div>
      </div>
    )}

    {!evidence.cloudinary_file_id && (
      <div className="gallery-evidence__items__block__slide__item__img-placeholder" />
    )}
  </div>
);

export default GalleryEvidenceItem;
