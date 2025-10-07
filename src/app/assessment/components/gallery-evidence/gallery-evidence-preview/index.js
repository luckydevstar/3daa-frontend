import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
import { path } from 'ramda';

import { RoleNameMap } from 'app/core/config/constants';

import GalleryEvidenceInfo from '../gallery-evidence-info';

function GalleryEvidencePreview({
  selectedEvidence,
  allCriterias,
  member,
  user,
  units,
  title,
  description,
  unitsTags,
  evidenceComments,
  isInfoOpen,
  setIsInfoOpen,
  criteriaClick,
  isCriteriaAdded,
  deleteConfirmModalRef,
  setEvidenceEditModal,
  setEvidenceSuggestedModal,
  getAssessmentMediaComments,
  postAssessmentEvidenceComment,
  attemptingPostAssessmentEvidenceComment
}) {
  const [flip, setFlip] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const approved = path(['approved'], selectedEvidence);

  const ipAddress = path(['ip_address'], selectedEvidence) || '';
  const created = path(['created'], selectedEvidence) || '';
  const lat = path(['lat'], selectedEvidence) || '';
  const lng = path(['lng'], selectedEvidence) || '';

  const role = member && member.roles && member.roles[0];
  const roleName = RoleNameMap[role];

  const isImageFile =
    selectedEvidence &&
    selectedEvidence.cloudinary_file_id &&
    selectedEvidence.cloudinary_file_type === 'image';
  const isVideoFile =
    selectedEvidence &&
    selectedEvidence.cloudinary_file_id &&
    selectedEvidence.cloudinary_file_type === 'video';
  const isDocumentFile =
    selectedEvidence &&
    selectedEvidence.cloudinary_file_id &&
    selectedEvidence.cloudinary_file_type === 'file';

  useEffect(() => {
    const scrollBlock = document.querySelector('.content-container');
    if (scrollBlock) {
      scrollBlock.addEventListener('scroll', () => {
        if (scrollBlock.scrollTop >= 161) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      });
    }
  }, []);

  return (
    <div
      className={cx('gallery-evidence__preview-container', {
        'gallery-evidence__preview-container--sticky': isSticky && !isInfoOpen
      })}
      style={{ maxWidth: isInfoOpen ? '100%' : '440px' }}
    >
      <div className="gallery-evidence__preview">
        <GalleryEvidenceInfo
          {...{
            selectedEvidence,
            allCriterias,
            units,
            member,
            user,
            unitsTags,
            evidenceComments,
            criteriaClick,
            isCriteriaAdded,
            isInfoOpen,
            setIsInfoOpen,
            getAssessmentMediaComments,
            postAssessmentEvidenceComment,
            attemptingPostAssessmentEvidenceComment
          }}
        />
        <div className="gallery-evidence__preview__card">
          <div
            className={cx('gallery-evidence__preview__front', {
              'gallery-evidence__preview__front--flip': flip
            })}
          >
            <img
              onClick={() => {
                setFlip(!flip);
              }}
              className="gallery-evidence__preview__flip"
              src="/assets/images/evidence-flip-icon.png"
              alt=""
            />

            {isImageFile && (
              <img
                className="gallery-evidence__preview__front__bg"
                src={selectedEvidence.cloudinary_file_id}
              />
            )}

            {isVideoFile && (
              <video
                className="gallery-evidence__preview__front__bg"
                autoPlay
                playsInline
                muted
                loop
              >
                <source src={selectedEvidence.cloudinary_file_id} />
              </video>
            )}

            {isDocumentFile && (
              <div className="gallery-evidence__preview__front__file-bg">
                <img src="/assets/images/document-icon.svg" />
              </div>
            )}
            <div className="gallery-evidence__preview__content">
              <div className="gallery-evidence__preview__content__warning-container">
                {!approved && (
                  <div className="gallery-evidence__preview__content__warning">
                    !
                  </div>
                )}
                {approved && (
                  <div className="gallery-evidence__preview__content__warning__approved">
                    <i className="fa fa-check" />
                  </div>
                )}
              </div>
              <div className="gallery-evidence__preview__content__title">
                {title}
              </div>
              <div className="gallery-evidence__preview__content__description">
                {description}
              </div>
              <div className="gallery-evidence__preview__content__buttons">
                <button
                  className="button gallery-evidence__preview__content__button gallery-evidence__preview__content__button__remove"
                  onClick={
                    deleteConfirmModalRef &&
                    deleteConfirmModalRef.current &&
                    deleteConfirmModalRef.current.open
                  }
                >
                  Remove
                </button>
                <button
                  className="button gallery-evidence__preview__content__button gallery-evidence__preview__content__button__edit"
                  onClick={() => {
                    setEvidenceEditModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="button gallery-evidence__preview__content__button gallery-evidence__preview__content__button__suggested"
                  onClick={() => {
                    setEvidenceSuggestedModal(true);
                  }}
                >
                  Suggested
                </button>
              </div>
            </div>
          </div>
          <div
            className={cx('gallery-evidence__preview__back', {
              'gallery-evidence__preview__back--flip': flip
            })}
          >
            <img
              onClick={() => {
                setFlip(!flip);
              }}
              className="gallery-evidence__preview__flip__back"
              src="/assets/images/evidence-flip-icon.png"
              alt=""
            />
            <div className="gallery-evidence__preview__back__content">
              {ipAddress && (
                <div className="gallery-evidence__preview__back__content__ip">
                  <div>IP Address:</div>
                  <span>{ipAddress}</span>
                </div>
              )}
              {lat && lng && (
                <div style={{ height: '300px' }}>
                  <GoogleMapReact
                    bootstrapURLKeys={{
                      key: 'AIzaSyDN1TCRKo0VWLZNEjZIAkMlQhA9OJYGJWo',
                      //key: 'AIzaSyBpUgQiH-C1JHPtX4uYesIUqjvPgou9d80',
                      language: 'en'
                    }}
                    options={{
                      scrollwheel: true,
                      draggable: true,
                      disableDefaultUI: true,
                      zoomControl: false
                    }}
                    defaultCenter={{
                      lat: lat,
                      lng: lng
                    }}
                    defaultZoom={11}
                  />
                </div>
              )}
              {created && (
                <div className="gallery-evidence__preview__back__content__date">
                  <div>Date Added:</div>
                  <span>{moment(created).format('DD/MM/YYYY')}</span>
                </div>
              )}
              {member && (
                <div className="gallery-evidence__preview__back__content__added-by">
                  <div>Added by:</div>
                  <span>
                    {path(['screen_name'], member)} <br />
                    {roleName && (
                      <span className="member-type">{`(${roleName})`}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryEvidencePreview;
