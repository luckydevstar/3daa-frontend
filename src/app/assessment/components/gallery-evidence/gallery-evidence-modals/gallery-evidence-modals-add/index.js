import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';
import { includes, prop, propEq, find, map } from 'ramda';

import common from 'app/common';
import GalleryEvidenceModalsAddSlider from './gallery-evidence-modals-add-slider';
import GalleryEvidenceModalsAddUpload from './gallery-evidence-modals-add-upload';
import GalleryEvidenceModalsSuggestedAccordion from '../gallery-evidence-modals-suggested/gallery-evidence-modals-suggested-accordion';

const {
  components: { ContentModalNew }
} = common;

function GalleryEvidenceModalsAdd({
  evidences,
  units,
  allCriterias,
  isOpen,
  attemptingPostAssessmentEvidence,
  onClose,
  onSubmit
}) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Video');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [criterias, setCriterias] = useState([]);
  const [activePage, setActivePage] = useState(0);

  const evidenceAddModal = useRef(null);
  const unit = units && units.length > 0 && units[activePage];

  const isImageFile = includes(
    'image',
    file && file.data ? file.data.type : ''
  );
  const isVideoFile = includes(
    'video',
    file && file.data ? file.data.type : ''
  );
  const isWebLink = type === 'Web Link';
  const isDocumentFile = !isImageFile && !isVideoFile && !isWebLink;

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

  const handleSetFile = f => {
    if (!f || !f.type) return;
    if (includes('image', f.type) && type === 'Image') {
      setFile({ preview: URL.createObjectURL(f), data: f });
    } else if (includes('video', f.type) && type === 'Video') {
      setFile({ preview: URL.createObjectURL(f), data: f });
    } else if (type === 'Document') {
      setFile({ preview: URL.createObjectURL(f), data: f });
    }
    return;
  };

  const handleSubmit = () => {
    // if (criterias.length === 0) {
    //   return;
    // }
    onSubmit({
      title,
      description,
      file: file ? file.data : null,
      // assessment_criteria: map(prop('assessment_criteria_id'))(criterias),
      assessment_criteria: [],
      evidence_type: 'media'
    });
  };

  useEffect(() => {
    if (isOpen) {
      evidenceAddModal.current.open();
    } else {
      evidenceAddModal.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!attemptingPostAssessmentEvidence) {
      onClose();
    }
  }, [attemptingPostAssessmentEvidence]);

  return (
    <ContentModalNew
      size="larger"
      className="unit-overview-modal"
      onClose={onClose}
      ref={evidenceAddModal}
    >
      <div className="gallery-evidence-modal-add">
        <div className="gallery-evidence-modal-add__header">
          <div className="gallery-evidence-modal-add__header__title">
            Add Evidence
          </div>
          <div className="gallery-evidence-modal-add__header__sub-title">
            Please provide a title, description and resouce for the evidence
          </div>
          <div className="gallery-evidence-modal-add__header__evidences-count">
            {evidences.length} Evidences been added
          </div>
        </div>
        <GalleryEvidenceModalsAddSlider {...{ evidences }} />
        <GalleryEvidenceModalsAddUpload
          {...{
            isImageFile,
            isVideoFile,
            isWebLink,
            isDocumentFile,
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
        {unit && (
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

        <div className="gallery-evidence-modal-add__footer">
          <button
            className={cx('button', {
              'is-loading': attemptingPostAssessmentEvidence
            })}
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </div>
    </ContentModalNew>
  );
}

export default GalleryEvidenceModalsAdd;
