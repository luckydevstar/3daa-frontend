import React, { useState } from 'react';
import Isvg from 'react-inlinesvg';
import cx from 'classnames';
import { equals, cond, T, always, path } from 'ramda';

import IconInfo from 'images/icon-info.svg';
import GalleryEvidenceInfoFeedback from './gallery-evidence-info-feedback';
import GalleryEvidenceInfoMapping from './gallery-evidence-info-mapping';
import GalleryEvidenceInfoQa from './gallery-evidence-info-qa';

function GalleryEvidenceInfo({
  selectedEvidence,
  allCriterias,
  units,
  unitsTags,
  member,
  user,
  evidenceComments,
  criteriaClick,
  isCriteriaAdded,
  isInfoOpen,
  setIsInfoOpen,
  postAssessmentEvidenceComment,
  attemptingPostAssessmentEvidenceComment
}) {
  const [activeState, setActiveState] = useState('mapping');

  const approved = path(['approved'], selectedEvidence);

  const setMappingState = () => {
    setActiveState('mapping');
  };

  const setFeedbackState = () => {
    setActiveState('feedback');
  };

  const setQAState = () => {
    setActiveState('qa');
  };

  return (
    <div
      className={cx('gallery-evidence__info', {
        'gallery-evidence__info--open': isInfoOpen
      })}
    >
      <div
        className="gallery-evidence__info__open-button"
        onClick={() => {
          setIsInfoOpen(!isInfoOpen);
        }}
      >
        <Isvg className="small" src={IconInfo} />
      </div>
      <div className="gallery-evidence__info__content">
        {approved && (
          <div className="gallery-evidence__info__approved">
            <div className="gallery-evidence__info__approved__icon">
              <i className="fa fa-check" />
            </div>
            <div className="gallery-evidence__info__approved__title">
              Approved
            </div>
          </div>
        )}
        {!approved && (
          <div className="gallery-evidence__info__required-approval-container">
            <div className="gallery-evidence__info__required-approval">
              <div className="gallery-evidence__info__required-approval__inner">
                !
              </div>
            </div>
            <span>Required Approval</span>
          </div>
        )}
        <div className="gallery-evidence__info__tabs">
          <div
            className={cx('gallery-evidence__info__tab', {
              'gallery-evidence__info__tab--active': equals(
                activeState,
                'mapping'
              )
            })}
            onClick={setMappingState}
          >
            Mapping
          </div>
          <div
            className={cx('gallery-evidence__info__tab', {
              'gallery-evidence__info__tab--active': equals(
                activeState,
                'feedback'
              )
            })}
            onClick={setFeedbackState}
          >
            Feedback & Comments
          </div>
          <div
            className={cx('gallery-evidence__info__tab', {
              'gallery-evidence__info__tab--active': equals(activeState, 'qa')
            })}
            onClick={setQAState}
          >
            QA Comments
          </div>
        </div>
        <div className="gallery-evidence__info__body">
          {cond([
            [
              equals('feedback'),
              always(
                <GalleryEvidenceInfoFeedback
                  {...{
                    evidenceComments,
                    postAssessmentEvidenceComment,
                    member,
                    user,
                    selectedEvidence,
                    attemptingPostAssessmentEvidenceComment
                  }}
                />
              )
            ],
            [
              equals('qa'),
              always(
                <GalleryEvidenceInfoQa
                  {...{
                    selectedEvidence
                  }}
                />
              )
            ],
            [
              T,
              always(
                <GalleryEvidenceInfoMapping
                  {...{
                    units,
                    unitsTags,
                    criteriaClick,
                    isCriteriaAdded,
                    allCriterias
                  }}
                />
              )
            ]
          ])(activeState)}
        </div>
      </div>
    </div>
  );
}

export default GalleryEvidenceInfo;
