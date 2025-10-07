import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';

import common from 'app/common';
import util from 'app/user/util/';

import { Creators as AssessmentActions } from '../../actions';

import ImgsViewer from 'react-images';
import IconWorkbookActvity from 'images/workbook_activity_icon.png';

const {
  components: { CloudinaryMedia, UILoading },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      elementAboveHeader,
      UserAccess
    }
  }
} = common;

const imageDimesnions = {
  width: 380,
  height: 380
};

class EvidenceRemoveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enlargeImage: false
    };
    this.onRemoveEvidence = this.onRemoveEvidence.bind(this);
  }

  onRemoveEvidence() {
    const { evidence, deleteAssessmentEvidenceAttempt } = this.props;
  }

  render() {
    const { evidence, attemptingDeleteAssessmentEvidence } = this.props;

    const title = lodash.get(evidence, 'evidence_details.title') || '';
    const mediaType =
      lodash.get(evidence, 'evidence_details.cloudinary_file_type') || 'image';
    const cloudinaryId =
      lodash.get(evidence, 'evidence_details.cloudinary_file_id') || '';

    return (
      <div className="evidence-edit p-t-30">
        <div className="title has-text-centered">Remove Evidence</div>
        <div className="subtitle m-t-15 p-15 border-bottom border-top">
          {title.length > 128 ? `${title.slice(0, 125)}...` : title}
        </div>
        <div
          className="is-flex border-bottom"
          style={{ padding: '15px', margin: '0', marginBottom: '30px' }}
        >
          <div className="p-15" style={{ width: '100%' }}>
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
                  width: 120,
                  height: 120,
                  backgroundImage: `url(${IconWorkbookActvity})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  margin: 'auto',
                  marginTop: '40px'
                }}
              />
            )}
          </div>
          <div
            className="p-15"
            style={{ maxWidth: '300px', minWidth: '300px' }}
          >
            <div
              className="has-text-centered m-t-40"
              style={{ fontSize: '24px' }}
            >
              Are you sure you want to permanently erase this item?
            </div>
            <div
              className="has-text-centered m-t-30"
              style={{ fontSize: '24px' }}
            >
              You can't undo this action.
            </div>
            <div className="m-t-30 has-text-centered">
              <button
                className="button is-outlined is-danger"
                onClick={() => this.onRemoveEvidence()}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  form,
  profile,
  community,
  persisted,
  assessment
}) => ({
  user: lodash.get(profile, 'user'),
  attemptingDeleteAssessmentEvidence: lodash.get(
    assessment,
    'attemptingDeleteAssessmentEvidence'
  )
});

const mapDispatchToProps = dispatch => ({
  deleteAssessmentEvidenceAttempt: (member_id, qualification_id, evidence_id) =>
    dispatch(
      AssessmentActions.deleteAssessmentEvidenceAttempt(
        member_id,
        qualification_id,
        evidence_id
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvidenceRemoveModal);
