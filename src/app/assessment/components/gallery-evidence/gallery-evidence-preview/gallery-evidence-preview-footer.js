import React from 'react';
import cx from 'classnames';
import { equals, findIndex, propEq } from 'ramda';

import frownIcon from '@iconify/icons-fa-regular/frown';
import mehIcon from '@iconify/icons-fa-regular/meh';
import smileIcon from '@iconify/icons-fa-regular/smile';
import grinIcon from '@iconify/icons-fa-regular/grin';

import GalleryEvidencePreviewFooterRatingItem from './gallery-evidence-preview-footer-rating-item';

function GalleryEvidencePreviewFooter({
  evidence_rating,
  evidences,
  selectedEvidence,
  attemptingPostUpdateAssessmentEvidence,
  setIsInfoOpen,
  setEvidenceRating,
  handleSave
}) {
  const selectedEvidenceIndex =
    selectedEvidence &&
    findIndex(
      propEq(
        'learning_progress_evidence_id',
        selectedEvidence.learning_progress_evidence_id
      ),
      evidences
    ) + 1;
  return (
    <div className="gallery-evidence__info__footer">
      <div className="gallery-evidence__info__footer__controls">
        <div className="gallery-evidence__info__footer__controls__name">
          Evidence No.{selectedEvidenceIndex}
        </div>
        <div className="gallery-evidence__info__footer__controls__buttons">
          <button
            className={cx(
              'button',
              'gallery-evidence__info__footer__controls__buttons__save',
              {
                'is-loading': attemptingPostUpdateAssessmentEvidence
              }
            )}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="button gallery-evidence__info__footer__controls__buttons__cancel"
            onClick={() => {
              setIsInfoOpen(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <div className="gallery-evidence__info__footer__rating">
        <div className="gallery-evidence__info__footer__rating__title">
          Evidence Rating
        </div>
        <div className="gallery-evidence__info__footer__rating__buttons">
          <GalleryEvidencePreviewFooterRatingItem
            {...{
              title: 'Unsatisfactory',
              isActive: equals(evidence_rating, '1'),
              icon: frownIcon,
              onClick: () => {
                setEvidenceRating('1');
              }
            }}
          />
          <GalleryEvidencePreviewFooterRatingItem
            {...{
              title: 'Satisfactory',
              isActive: equals(evidence_rating, '2'),
              icon: mehIcon,
              onClick: () => {
                setEvidenceRating('2');
              }
            }}
          />
          <GalleryEvidencePreviewFooterRatingItem
            {...{
              title: 'Good',
              isActive: equals(evidence_rating, '3'),
              icon: smileIcon,
              onClick: () => {
                setEvidenceRating('3');
              }
            }}
          />
          <GalleryEvidencePreviewFooterRatingItem
            {...{
              title: 'Outstanding',
              isActive: equals(evidence_rating, '4'),
              icon: grinIcon,
              onClick: () => {
                setEvidenceRating('4');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default GalleryEvidencePreviewFooter;
