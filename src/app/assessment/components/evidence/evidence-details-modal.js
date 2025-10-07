import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as lodash from 'lodash';
import moment from 'moment';
import ImgsViewer from 'react-images';
import { Icon, InlineIcon } from '@iconify/react';
import expandIcon from '@iconify/icons-fa-solid/expand';

import common from 'app/common';
import IconWorkbookActvity from 'images/workbook_activity_icon.png';

const {
  components: { CloudinaryMedia },
  util: {
    helpers: { createCloudinaryUrl }
  }
} = common;

const imageDimesnions = {
  width: 325,
  height: 325
};

class EvidenceDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enlargeImage: false,
      activeUnit: null,
      mappedOutcome: null
    };

    this.onClickEvidenceTag = this.onClickEvidenceTag.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {} = this.props;
  }

  componentDidMount() {}

  onEnlargeImage(mediaType) {
    if (mediaType == 'image') this.setState({ enlargeImage: true });
  }

  onClickEvidenceTag(unit, mapped_outcome) {
    let temp = {};

    if (this.state.mappedOutcome == mapped_outcome) {
      temp = {
        activeUnit: null,
        mappedOutcome: null
      };
    } else {
      temp = {
        activeUnit: unit,
        mappedOutcome: mapped_outcome
      };
    }
    this.setState(temp);
  }

  render() {
    const { assessmentEvidenceDetails } = this.props;

    const { enlargeImage, activeUnit, mappedOutcome } = this.state;

    const title =
      lodash.get(assessmentEvidenceDetails, 'evidence_details.title') ||
      'Evidence Title';
    const learning_progress_evidence_id =
      lodash.get(assessmentEvidenceDetails, 'learning_progress_evidence_id') ||
      '';
    const description =
      lodash.get(assessmentEvidenceDetails, 'evidence_details.description') ||
      '';
    const created =
      lodash.get(assessmentEvidenceDetails, 'evidence_details.created') || '';

    const mediaType =
      lodash.get(
        assessmentEvidenceDetails,
        'evidence_details.cloudinary_file_type'
      ) || 'image';
    const cloudinaryId =
      lodash.get(
        assessmentEvidenceDetails,
        'evidence_details.cloudinary_file_id'
      ) || '';

    const units_tags = lodash.filter(
      lodash.get(assessmentEvidenceDetails, 'units_tags', []),
      ut => ut.mapped_outcomes && ut.mapped_outcomes.length > 0
    );

    const imgUrl = createCloudinaryUrl(cloudinaryId, 'image');

    return (
      <div className="evidence-edit p-t-30">
        {mediaType == 'image' && imgUrl && (
          <ImgsViewer
            images={[{ src: imgUrl }]}
            isOpen={enlargeImage}
            onClose={() => this.setState({ enlargeImage: false })}
          />
        )}
        <div className="title has-text-centered">
          {title.length > 28 ? `${title.slice(0, 25)}...` : title} &nbsp; #
          {learning_progress_evidence_id}
        </div>

        <div
          className="evidence-image"
          style={{
            position: 'relative',
            width: `${imageDimesnions.width}px`,
            height: `${imageDimesnions.height}px`,
            margin: 'auto'
          }}
        >
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
                backgroundPosition: 'center',
                margin: 'auto'
              }}
            />
          )}

          {mediaType == 'image' && imgUrl && (
            <div
              className="evidence-image-expand-icon"
              onClick={() => this.onEnlargeImage(mediaType)}
            >
              <Icon icon={expandIcon} width="30" height="30" />
            </div>
          )}
        </div>

        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          <hr />

          <div>
            <div className="semibold m-b-15">Description</div>
            <div>{description}</div>
          </div>

          <hr />

          <div>
            <div className="semibold m-b-10">Evidence Tags</div>
            <div className="m-b-15">
              {units_tags.map((u, i) => {
                return (
                  <div key={`unit_tag${i}`} className="is-flex">
                    <div
                      className="semibold p-r-10"
                      style={{ minWidth: '120px', color: '#636363' }}
                    >
                      {lodash.get(u, 'reference') || 'Reference'}
                    </div>
                    <div className="is-flex">
                      {(lodash.get(u, 'mapped_outcomes') || []).map((mo, j) => {
                        return (
                          <div
                            key={`mapped_outcome${i}${j}`}
                            className="evidence-tag"
                            onClick={() => this.onClickEvidenceTag(u, mo)}
                          >
                            {lodash.get(mo, 'outcome_number')}.
                            {lodash.get(mo, 'criteria_number')}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={classNames('evidence-detail-unit m-b-15', {
                active: !!activeUnit
              })}
            >
              <div className="semibold m-b-10">
                <span>Title of Unit:</span>
                &nbsp;&nbsp;
                <span>{lodash.get(activeUnit, 'title') || 'Unit Title'}</span>
              </div>
              <div>
                <div className="is-flex">
                  <span
                    className="semibold"
                    style={{ color: '#636363', whiteSpace: 'nowrap' }}
                  >
                    Lara reference number:&nbsp;&nbsp;
                  </span>
                  <span>{lodash.get(activeUnit, 'reference') || ''}</span>
                </div>
                <div className="is-flex">
                  <span
                    className="semibold"
                    style={{ color: '#636363', whiteSpace: 'nowrap' }}
                  >
                    Outcome title:&nbsp;&nbsp;
                  </span>
                  <span>
                    {lodash.get(mappedOutcome, 'outcome_title') || ''}
                  </span>
                </div>
                <div className="is-flex">
                  <span
                    className="semibold"
                    style={{ color: '#636363', whiteSpace: 'nowrap' }}
                  >
                    Element Criteria:&nbsp;&nbsp;
                  </span>
                  <span>
                    {lodash.get(mappedOutcome, 'element_title') || ''}
                  </span>
                </div>
              </div>
            </div>

            <div className="semibold m-b-10">Evidence Date</div>
            <div className="semibold" style={{ color: '#636363' }}>
              {created &&
                moment(created)
                  .tz('Europe/London')
                  .format('L')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ assessment }) => {
  return {
    assessmentEvidenceDetails: lodash.get(
      assessment,
      'assessmentEvidenceDetails'
    )
  };
};

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvidenceDetailsModal);
