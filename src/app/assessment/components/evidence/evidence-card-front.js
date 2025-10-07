import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';

import common from 'app/common';
import { Text } from 'app/intl';
import { Roles } from 'app/core/config/constants';
import EvidenceDetailsModal from './evidence-details-modal';
import EvidenceEditModal from './evidence-edit-modal';
import EvidenceRemoveModal from './evidence-remove-modal';

import IconWorkbookActvity from 'images/workbook_activity_icon.png';

const {
  CentreAdmin,
  CentreTutor,
  CentreLearner,
  SuperAdmin,
  SiteAdmin
} = Roles;

const {
  components: {
    CloudinaryMedia,
    UICheckbox,
    ConvertDraftObjectToHtml,
    ContentModalNew
  }
} = common;

class EvidenceCardFront extends Component {
  render() {
    const {
      userRole,
      className,
      evidence,
      memberId,
      qualificationId
    } = this.props;

    const isViewed = lodash.get(evidence, 'evidence_details.is_viewed') || 0;
    const title =
      lodash.get(evidence, 'evidence_details.title') || 'Evidence Title';
    const description =
      lodash.get(evidence, 'evidence_details.description') ||
      'Evidence Description';
    const mediaType =
      lodash.get(evidence, 'evidence_details.cloudinary_file_type') || 'image';
    const cloudinaryId =
      lodash.get(evidence, 'evidence_details.cloudinary_file_id') || '';

    const imageDimesnions = {
      width: 280,
      height: 537
    };

    return (
      <div className={`evidence-card-front ${className}`}>
        <ContentModalNew
          className="assessment-activity-modal"
          ref={e => {
            this.evidenceDetailModal = e;
          }}
        >
          <EvidenceDetailsModal {...{ evidence, memberId, qualificationId }} />
        </ContentModalNew>

        <ContentModalNew
          size="larger"
          className="unit-overview-modal"
          ref={e => {
            this.evidenceEditModal = e;
          }}
        >
          <EvidenceEditModal
            editMode="edit"
            {...{ evidence, memberId, qualificationId }}
          />
        </ContentModalNew>

        <ContentModalNew
          size="larger"
          className="unit-overview-modal"
          ref={e => {
            this.evidenceSuggestModal = e;
          }}
        >
          <EvidenceEditModal editMode="suggest" />
        </ContentModalNew>

        <ContentModalNew
          className="unit-overview-modal"
          ref={e => {
            this.evidenceRemoveModal = e;
          }}
        >
          <EvidenceRemoveModal {...{ evidence }} />
        </ContentModalNew>

        <div className="card-image">
          {cloudinaryId ? (
            <CloudinaryMedia
              style={{ ...imageDimesnions }}
              mediaType={mediaType}
              fileId={cloudinaryId}
              transformations={{
                width: imageDimesnions.width,
                height: imageDimesnions.height,
                crop: 'fill',
                gravity: 'north',
                quality: 100
              }}
            />
          ) : (
            <div
              style={{
                width: imageDimesnions.width,
                height: imageDimesnions.height,
                backgroundImage: `url(${IconWorkbookActvity})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center 100px'
              }}
            />
          )}
        </div>

        <div className="actions">
          <div className="card-content">
            <div className="card-separator">
              <div className="progress-badge">
                <UICheckbox
                  checked={isViewed ? true : false}
                  onChange={e => onChange(e)}
                />
              </div>
            </div>
            <div className="card-title">
              {title.length > 28 ? `${title.slice(0, 25)}...` : title}
            </div>

            <p className="card-text">{description}</p>
          </div>
          <div className="buttons">
            <div className="is-flex space-between">
              <button
                className="button is-small is-outlined is-danger"
                onClick={() => {
                  this.evidenceRemoveModal.open();
                }}
              >
                Remove
              </button>
              <button
                className="button is-small is-success"
                onClick={() => {
                  this.evidenceEditModal.open();
                }}
              >
                Edit
              </button>
              <button
                className="button is-small is-outlined is-primary"
                onClick={() => {
                  this.evidenceDetailModal.open();
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EvidenceCardFront.propTypes = {
  userRole: PropTypes.string,
  className: PropTypes.string,
  memberId: PropTypes.string,
  qualificationId: PropTypes.string,

  evidence: PropTypes.object,

  title: PropTypes.string,
  fileId: PropTypes.string,
  mediaType: PropTypes.string,
  approvedUnits: PropTypes.array,
  approvalUnits: PropTypes.array
};

EvidenceCardFront.defaultProps = {
  userRole: '',
  className: '',

  memberId: '',
  qualificationId: '',
  evidence: {},

  title: 'Evidence Title',
  fileId: 'testing/ye7ktpvfddv2ephaqtbf',
  mediaType: 'image',
  approvedUnits: [],
  approvalUnits: []
};

export default EvidenceCardFront;
