import React, { useState, useEffect, useRef } from 'react';
import { path, find, propEq, prop, map, findIndex, toString } from 'ramda';

import common from 'app/common';
import GalleryEvidencePreview from './gallery-evidence-preview';
import GalleryEvidencePreviewFooter from './gallery-evidence-preview/gallery-evidence-preview-footer';
import GalleryEvidenceItems from './gallery-evidence-items';
import {
  GalleryEvidenceModalsAddType,
  GalleryEvidenceModalsAdd,
  GalleryEvidenceModalsEdit,
  GalleryEvidenceModalsSuggested,
  GalleryEvidenceModalsProgress
} from './gallery-evidence-modals';

const {
  components: { ContentModalConfirm }
} = common;

function GalleryEvidence({
  evidences = [],
  member,
  user,
  units = [],
  allCriterias = [],
  assessmentActivities = [],
  assessmentEvidenceDetails,
  attemptingPostUpdateAssessmentEvidence,
  attemptingPostAssessmentEvidence,
  attemptingGetAssessmentMemberEvidences,
  attemptingDeleteAssessmentEvidence,
  attemptingPostAssessmentEvidenceComment,
  postAssessmentEvidence,
  postAssessmentUpdateEvidence,
  deleteAssessmentEvidenceAttempt,
  getAssessmentMediaComments,
  getAssessmentMemberEvidenceDetails,
  postAssessmentEvidenceComment,
  getWorkbookActivities
}) {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidence_rating, setEvidenceRating] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [addEvidenceProgress, setAddEvidenceProgress] = useState(0);
  const [evidenceAddModal, setEvidenceAddModal] = useState(false);
  const [evidenceEditModal, setEvidenceEditModal] = useState(false);
  const [evidenceSuggestedModal, setEvidenceSuggestedModal] = useState(false);
  const [evidenceSelectTypeModal, setEvidenceSelectTypeModal] = useState(false);
  const [
    evidenceUploadProgressModal,
    setEvidenceUploadProgressModal
  ] = useState(true);

  const deleteConfirmModalRef = useRef(null);

  const unitsTags = path(['units_tags'], assessmentEvidenceDetails) || [];
  const evidenceComments =
    path(['evidence_comments'], assessmentEvidenceDetails) || [];

  const handleSetSelectedEvidence = evidence => {
    setSelectedEvidence(evidence);
    setTitle(path(['title'], evidence));
    setDescription(path(['description'], evidence));
    setEvidenceRating(toString(path(['evidence_rating'], evidence)));
  };

  const handleSave = () => {
    let criterias = [];
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    allCriterias.forEach(criteria => {
      if (selectedUnits.find(unit => unit.unit_id === criteria.unit_id)) {
        criterias.push(criteria.assessment_criteria_id);
      }
    });
    getWorkbookActivities(
      selectedUnits,
      member_id,
      qualification_id,
      criterias
    );
  };

  const selectedEvidenceIndex =
    selectedEvidence &&
    findIndex(
      propEq(
        'learning_progress_evidence_id',
        selectedEvidence.learning_progress_evidence_id
      ),
      evidences
    ) + 1;

  const isCriteriaAdded = criteria => {
    const findedCriteria = find(propEq('unit_id', prop('unit_id', criteria)))(
      selectedUnits
    );
    return !!findedCriteria;
  };

  const criteriaClick = criteria => {
    if (!isCriteriaAdded(criteria)) {
      setSelectedUnits([...selectedUnits, criteria]);
    } else {
      const filteredCriterias = selectedUnits.filter(c => {
        return !propEq('unit_id', prop('unit_id', criteria))(c);
      });
      setSelectedUnits(filteredCriterias);
    }
  };

  const addEvidence = params => {
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    setEvidenceAddModal(false);
    setEvidenceUploadProgressModal(true);
    postAssessmentEvidence(
      member_id,
      qualification_id,
      progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setAddEvidenceProgress(percentCompleted);
      },
      params
    );
  };

  const editEvidence = params => {
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    const evidence_id = path(
      ['learning_progress_evidence_id'],
      selectedEvidence
    );
    postAssessmentUpdateEvidence(
      member_id,
      qualification_id,
      evidence_id,
      params
    );
  };

  const suggestedEvidence = params => {
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    const evidence_id = path(
      ['learning_progress_evidence_id'],
      selectedEvidence
    );
    postAssessmentUpdateEvidence(
      member_id,
      qualification_id,
      evidence_id,
      params
    );
  };

  const deleteEvidence = () => {
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    const evidence_id = path(
      ['learning_progress_evidence_id'],
      selectedEvidence
    );
    deleteAssessmentEvidenceAttempt(member_id, qualification_id, evidence_id);
  };

  useEffect(() => {
    if (evidences && evidences.length > 0 && !selectedEvidence) {
      const firstEvidence = evidences[0];
      handleSetSelectedEvidence(firstEvidence);
    }
  }, [evidences]);

  useEffect(() => {
    const member_id = path(['member_id'], member);
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    const evidence_id = path(
      ['learning_progress_evidence_id'],
      selectedEvidence
    );
    if (selectedEvidence) {
      // For Testing
      getAssessmentMemberEvidenceDetails(
        member_id,
        qualification_id,
        evidence_id
      );
    }
  }, [selectedEvidence]);

  return (
    <div className="gallery-evidence">
      <div className="gallery-evidence__grid">
        <div>
          <GalleryEvidencePreview
            {...{
              selectedEvidence,
              allCriterias,
              member,
              user,
              units,
              unitsTags,
              title,
              description,
              evidenceComments,
              isInfoOpen,
              isCriteriaAdded,
              setTitle,
              setDescription,
              setEvidenceEditModal,
              setEvidenceSuggestedModal,
              deleteConfirmModalRef,
              criteriaClick,
              setIsInfoOpen,
              getAssessmentMediaComments,
              postAssessmentEvidenceComment,
              attemptingPostAssessmentEvidenceComment
            }}
          />
        </div>
        <div className="gallery-evidence__body">
          <GalleryEvidenceItems
            {...{
              evidences,
              units,
              allCriterias,
              isInfoOpen,
              member,
              unitsTags,
              assessmentActivities,
              attemptingDeleteAssessmentEvidence,
              attemptingGetAssessmentMemberEvidences,
              selectedEvidence,
              selectedEvidenceIndex,
              setEvidenceSelectTypeModal,
              setEvidenceAddModal,
              setSelectedEvidence: handleSetSelectedEvidence
            }}
          />
        </div>
      </div>
      {isInfoOpen && (
        <GalleryEvidencePreviewFooter
          {...{
            selectedEvidence,
            evidence_rating,
            evidences,
            attemptingPostUpdateAssessmentEvidence,
            setEvidenceRating,
            handleSave,
            setIsInfoOpen,
            setSelectedEvidence: handleSetSelectedEvidence
          }}
        />
      )}
      <GalleryEvidenceModalsAdd
        {...{
          evidences,
          units,
          allCriterias,
          attemptingPostAssessmentEvidence,
          isOpen: evidenceAddModal,
          onSubmit: addEvidence,
          onClose: () => {
            setEvidenceAddModal(false);
          }
        }}
      />
      <GalleryEvidenceModalsEdit
        {...{
          member,
          selectedEvidence,
          evidences,
          selectedEvidenceIndex,
          attemptingPostUpdateAssessmentEvidence,
          isOpen: evidenceEditModal,
          onSubmit: editEvidence,
          onClose: () => {
            setEvidenceEditModal(false);
          }
        }}
      />
      <GalleryEvidenceModalsSuggested
        {...{
          selectedEvidenceIndex,
          selectedEvidence,
          member,
          units,
          allCriterias,
          attemptingPostUpdateAssessmentEvidence,
          isOpen: evidenceSuggestedModal,
          onSubmit: suggestedEvidence,
          onClose: () => {
            setEvidenceSuggestedModal(false);
          }
        }}
      />
      <ContentModalConfirm
        callback={deleteEvidence}
        ref={deleteConfirmModalRef}
      >
        <h3>Are you sure you want to delete the evidence?</h3>
      </ContentModalConfirm>
      <GalleryEvidenceModalsAddType
        {...{
          isOpen: evidenceSelectTypeModal,
          onClose: () => {
            setEvidenceSelectTypeModal(false);
          },
          myDriveClick: () => {
            setEvidenceAddModal(true);
          }
        }}
      />
      <GalleryEvidenceModalsProgress
        {...{
          addEvidenceProgress,
          attemptingPostAssessmentEvidence,
          isOpen: evidenceUploadProgressModal,
          onClose: () => {
            setEvidenceUploadProgressModal(false);
          }
        }}
      />
    </div>
  );
}

export default GalleryEvidence;
