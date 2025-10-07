import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import { includes, path, find, propEq, prop, map } from 'ramda';

import common from 'app/common';
import { createAmazonS3Url } from 'app/common/util/helpers';
import GalleryEvidenceModalsEditHeader from '../gallery-evidence-modals-edit/gallery-evidence-modals-edit-header';
import GalleryEvidenceModalsAddUpload from '../gallery-evidence-modals-add/gallery-evidence-modals-add-upload';
import GalleryEvidenceModalsSuggestedAccordion from './gallery-evidence-modals-suggested-accordion';

const {
  components: { ContentModalNew }
} = common;

function GalleryEvidenceModalsSuggested({
  selectedEvidence,
  selectedEvidenceIndex,
  member,
  units,
  allCriterias,
  attemptingPostUpdateAssessmentEvidence,
  isOpen,
  onSubmit,
  onClose
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Video');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [criterias, setCriterias] = useState([]);
  const [activePage, setActivePage] = useState(0);

  const evidenceSuggestedModal = useRef(null);

  const isImageFile = includes(
    'image',
    file && file.data ? file.data.type : ''
  );
  const isVideoFile = includes(
    'video',
    file && file.data ? file.data.type : ''
  );

  const isCriteriaAdded = criteria => {
    const findedCriteria = find(
      propEq('assessment_criteria_id', prop('assessment_criteria_id', criteria))
    )(criterias);
    return !!findedCriteria;
  };

  const criteriaClick = criteria => {
    if (!isCriteriaAdded(criteria)) {
      setCriterias([...criterias, criteria]);
    } else {
      const filteredCriterias = criterias.filter(c => {
        return !propEq(
          'assessment_criteria_id',
          prop('assessment_criteria_id', criteria)
        )(c);
      });
      setCriterias(filteredCriterias);
    }
  };

  const handleSetFile = file => {
    if (includes('image', file.type) && type === 'Image') {
      setFile({ preview: URL.createObjectURL(file), data: file });
    } else if (includes('video', file.type) && type === 'Video') {
      setFile({ preview: URL.createObjectURL(file), data: file });
    }
    return;
  };

  const handleSave = () => {
    onSubmit({
      assessment_criteria: map(prop('assessment_criteria_id'))(criterias)
    });
  };

  useEffect(() => {
    if (!attemptingPostUpdateAssessmentEvidence) {
      onClose();
    }
  }, [attemptingPostUpdateAssessmentEvidence]);

  useEffect(() => {
    if (isOpen) {
      evidenceSuggestedModal.current.open();
    } else {
      evidenceSuggestedModal.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEvidence) {
      if (units && units.length > 0) {
        units.forEach(unit => {
          if (unit.outcomes && unit.outcomes.length > 0) {
            unit.outcomes.forEach(outcome => {
              if (
                outcome.assessment_criteria &&
                outcome.assessment_criteria.length > 0
              ) {
                outcome.assessment_criteria.forEach(crit => {
                  if (crit.evidence && crit.evidence.length > 0) {
                    crit.evidence.forEach(ev => {
                      const selectedEvidenceId =
                        selectedEvidence.learning_progress_evidence_id;
                      if (ev.toString() === selectedEvidenceId.toString()) {
                        setCriterias([...criterias, crit]);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }

      setTitle(selectedEvidence.title || '');
      setDescription(selectedEvidence.description || '');
      setFile(
        selectedEvidence.cloudinary_file_id
          ? {
              preview: createAmazonS3Url(selectedEvidence.cloudinary_file_id),
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
      ref={evidenceSuggestedModal}
    >
      <div className="gallery-evidence-modal-suggested">
        <GalleryEvidenceModalsEditHeader
          {...{
            title: 'Suggested Mapping',
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
            onDrop: file => handleSetFile(file),
            readOnly: true
          }}
        />
        {allCriterias && (
          <GalleryEvidenceModalsSuggestedAccordion
            {...{
              allCriterias,
              isCriteriaAdded,
              criteriaClick,
              activePage,
              setActivePage
            }}
          />
        )}
        <div className="gallery-evidence-modal-suggested__footer">
          <button
            className={cx(
              'button',
              'gallery-evidence-modal-suggested__footer__close-button'
            )}
            onClick={onClose}
          >
            Close
          </button>
          <button
            className={cx(
              'button',
              'gallery-evidence-modal-suggested__footer__save-button',
              { 'is-loading': attemptingPostUpdateAssessmentEvidence }
            )}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default GalleryEvidenceModalsSuggested;
