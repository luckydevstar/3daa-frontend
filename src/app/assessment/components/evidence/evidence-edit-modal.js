import React, { Component } from 'react';
import common from 'app/common';
import { connect } from 'react-redux';
import {
  Field,
  FormSection,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';
import Slider from 'react-slick';
import Collapsible from 'react-collapsible';
import ImgsViewer from 'react-images';
import classNames from 'classnames';
import * as lodash from 'lodash';
import moment from 'moment';
import { Icon, InlineIcon } from '@iconify/react';
import expandIcon from '@iconify/icons-fa-solid/expand';

import util from 'app/user/util/';
import { Text, Input } from 'app/intl';
import { Creators as AssessmentActions } from '../../actions';

import IconWorkbookActvity from 'images/workbook_activity_icon.png';
import { units } from '../../mockup/mock-data';

const {
  components: {
    CloudinaryMedia,
    ContentModalNew,
    Form: { field, select, radio, textarea },
    Pagination,
    UILoading
  },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      elementAboveHeader,
      UserAccess,
      createCloudinaryUrl
    }
  }
} = common;

const FormField = field;
const FormSelect = select;
const TextareaField = textarea;

const { FormUtil } = util;
const FORM_NAME = 'evidenceEdit';
const errorMesage = "Data doesn't exist";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1
};

const imageDimesnions = {
  width: 92,
  height: 92
};

const dimensions = 380;

class EvidenceEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evidence: null,
      currentPage: 2,
      activeEvidenceIndex: 0,
      enlargeImage: false,
      searchPhrase: ''
    };

    this.initForm = this.initForm.bind(this);
    this.isValid = this.isValid.bind(this);
    this.onEnlargeImage = this.onEnlargeImage.bind(this);
    this.setPage = this.setPage.bind(this);
    this.renderUnits = this.renderUnits.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.filterResults = this.filterResults.bind(this);
    this.onSaveEvidence = this.onSaveEvidence.bind(this);
  }

  componentDidMount() {
    const { evidence } = this.props;
    this.initForm(evidence);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { evidence } = nextProps;
    this.initForm(evidence);
  }

  initForm(evidence) {
    const { editMode, initializeForm } = this.props;

    if (this.state.evidence != evidence) {
      this.setState({ evidence: evidence });

      const data = {
        title: lodash.get(evidence, 'evidence_details.title', ''),
        cloudinary_file_type: lodash.get(
          evidence,
          'evidence_details.cloudinary_file_type',
          'image'
        ),
        description: lodash.get(evidence, 'evidence_details.description', '')
      };

      switch (editMode) {
        case 'suggest':
      }

      initializeForm(data);
    }
  }

  onEnlargeImage(mediaType) {
    if (mediaType == 'image') this.setState({ enlargeImage: true });
  }

  isValid() {
    const { evidenceEdit, evidence } = this.props;

    return (
      lodash.get(evidence, 'evidence_details.title') !=
        (lodash.get(evidenceEdit, 'title') || null) ||
      lodash.get(evidence, 'evidence_details.description') !=
        (lodash.get(evidenceEdit, 'description') || null)
    );
  }

  setPage(pageNo) {
    this.setState({ currentPage: pageNo });
  }

  onSearchChange(e) {
    this.setState({ searchPhrase: e });
  }

  filterResults(elements) {
    const { searchPhrase } = this.state;
    return elements.filter(element =>
      element.title.toLowerCase().includes(searchPhrase.trim().toLowerCase())
    );
  }

  onSaveEvidence() {
    if (!this.isValid()) return;

    const {
      memberId,
      qualificationId,
      evidence,
      evidenceEdit,
      postAssessmentUpdateEvidenceAttempt
    } = this.props;

    postAssessmentUpdateEvidenceAttempt(
      memberId,
      qualificationId,
      lodash.get(evidence, [
        'evidence_details',
        'learning_progress_evidence_id'
      ]) || '',
      {
        assessment_criteria: evidence.mapped_criteria.map(
          c => c.assessment_criteria_id
        ),
        evidence_rating:
          lodash.get(evidence, ['evidence_details', 'evidence_rating']) || null,
        title: lodash.get(evidenceEdit, ['title']) || null,
        description: lodash.get(evidenceEdit, ['description']) || null
      }
    );
  }

  renderUnits() {
    const { userRole, searchPhrase, lang } = this.props;
    const { currentPage } = this.state;
    const total = 1234;

    // if (uiGettingQualifications || uiGettingAssessLearner) {
    //   return <UILoading isLoadingOverlay alignMiddle />;
    // }
    const unit = units[currentPage] || {};
    const outcomes = this.filterResults(lodash.get(unit, 'outcomes', []));

    return (
      <div className="suggested-unit" style={{ padding: '0 10px' }}>
        <div className="unit-title border-top border-bottom">
          <span>Unit 3</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{lodash.get(unit, 'reference')}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{lodash.get(unit, 'title')}</span>
        </div>
        <div className="outcomes">
          {outcomes.map((outcome, j) => {
            return (
              <Collapsible
                trigger={
                  'Activity No. ' + (j + 1) + '\xa0\xa0\xa0' + outcome.title
                }
                key={j}
                classParentString="is-border-bottom Collapsible text-emphasis p-l-45"
              >
                <div>
                  {lodash.get(outcome.criterias, 'length', 0) > 0 && (
                    <div className="p-l-30">
                      {outcome.criterias.map((criteria, k) => {
                        return (
                          <div
                            key={k}
                            className="columns is-marginless p-t-10 p-b-10"
                          >
                            <div className="column is-paddingless">
                              Criteria&nbsp;No.&nbsp;{j + 1}.{k + 1}&nbsp;&nbsp;
                              {criteria.title}
                            </div>
                            <div className="criteria-approved is-flex is-paddingless no-grow">
                              <label className="custom checkbox m-l-10 m-r-0">
                                <input type="checkbox" onChange={() => {}} />
                                <span className="ui m-r-0" />
                              </label>
                              <div>&nbsp;Approved</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Collapsible>
            );
          })}
        </div>
        <div className="has-text-centered p-t-15 p-b-15">
          24 Suggested Mappings
        </div>
        <div>
          <Pagination
            forcePage={currentPage - 1}
            itemsLength={total}
            itemsPerPage={1}
            maxPagesDisplayed={14}
            onPageChange={pageNo => this.setPage(pageNo)}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      editMode,
      evidence,
      evidences,
      handleSubmit,
      attemptingPostUpdateAssessmentEvidence
    } = this.props;
    const { enlargeImage } = this.state;

    const title =
      lodash.get(evidence, 'evidence_details.title') || 'Evidence Title';
    const created = lodash.get(evidence, 'evidence_details.created') || '';
    const createdBy =
      lodash.get(evidence, 'evidence_details.created_by.screen_name') || '';
    const mediaType =
      lodash.get(evidence, 'evidence_details.cloudinary_file_type') || 'image';
    const cloudinaryId =
      lodash.get(evidence, 'evidence_details.cloudinary_file_id') || '';

    const imgUrl = createCloudinaryUrl(cloudinaryId, 'image');
    const outcomes = lodash.get(units[0], 'outcomes', []);
    // const evidences = lodash.get(outcomes[0], 'evidences', []);

    return (
      <form onSubmit={handleSubmit(() => {})}>
        <div className="evidence-edit p-t-30">
          {mediaType == 'image' && imgUrl && (
            <ImgsViewer
              images={[{ src: imgUrl }]}
              isOpen={enlargeImage}
              onClose={() => this.setState({ enlargeImage: false })}
            />
          )}

          <div className="title has-text-centered">
            {editMode == 'edit' && 'Edit Evidence'}
            {editMode == 'add' && 'Add Evidence'}
            {editMode == 'suggest' && 'Map to the Criteria'}
          </div>
          {editMode == 'add' && (
            <div>
              <div className="has-text-centered m-b-15">
                Please provide a title, description, and resource for the
                evidence
              </div>
              <div className="has-text-centered m-b-15">
                {evidences.length} evidences have beed added
              </div>
              <div />
            </div>
          )}
          {editMode != 'add' && (
            <div
              className="is-flex border-top border-bottom"
              style={{
                padding: '15px 30px',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div className="subtitle">
                {title.length > 28 ? `${title.slice(0, 25)}...` : title}
              </div>
              <div>
                <b>Evidence Tag : &nbsp;&nbsp;</b>
                <span>Evidence #56</span>
              </div>
              <div>
                <b>Added By : &nbsp;&nbsp;</b>
                <span>{createdBy}</span>
              </div>
              <div>
                <b>Date Added : &nbsp;&nbsp;</b>
                <span>
                  {created &&
                    moment(created)
                      .tz('Europe/London')
                      .format('L')}
                </span>
              </div>
            </div>
          )}

          {editMode == 'add' && (
            <div className="evidence-slider">
              <Slider {...settings}>
                {lodash.map(evidences, (item, i) => (
                  <div
                    key={`unit-item-${i}`}
                    onClick={() => {
                      this.setState({ activeEvidenceIndex: i });
                    }}
                  >
                    {lodash.get(item, 'learning_progress_evidence_type_id', 3) <
                    3 ? (
                      <CloudinaryMedia
                        style={{ ...imageDimesnions }}
                        mediaType={
                          lodash.get(item, 'cloudinary_file_type') || 'image'
                        }
                        fileId={lodash.get(item, 'cloudinary_file_id', '')}
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
                ))}
              </Slider>
            </div>
          )}

          <div
            className="columns"
            style={{ background: '#f9f9f9', padding: '15px', margin: '0' }}
          >
            <div
              className="column evidence-image"
              style={{ position: 'relative', padding: '0' }}
            >
              {cloudinaryId ? (
                <CloudinaryMedia
                  mediaType={mediaType}
                  fileId={cloudinaryId}
                  transformations={{
                    width: dimensions,
                    height: dimensions,
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

              {mediaType == 'image' && imgUrl && (
                <div
                  className="evidence-image-expand-icon"
                  onClick={() => this.onEnlargeImage(mediaType)}
                >
                  <Icon icon={expandIcon} width="30" height="30" />
                </div>
              )}
            </div>
            <div className="column">
              {editMode == 'suggest' && (
                <div className="m-b-10">
                  <div>
                    <Input
                      onChange={e => onSearchChange(e.target.value)}
                      type="text"
                      className="input"
                      placeholder="Search Keyword"
                    />
                  </div>
                </div>
              )}
              <div className="m-b-10">
                <div className="m-b-10">Evidence Title</div>
                <div>
                  <Field
                    placeholder="Evidence Title"
                    name="title"
                    type="text"
                    component={FormField}
                    className="control"
                  />
                </div>
              </div>
              <div className="m-b-10">
                <div className="m-b-10">Evidence Type</div>
                <div>
                  <Field
                    id="cloudinary_file_type"
                    name="cloudinary_file_type"
                    className="control"
                    component={FormSelect}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </Field>
                </div>
              </div>
              {editMode == 'add' && (
                <div className="m-b-10">
                  <div className="m-b-10">Website Link</div>
                  <div>
                    <Field
                      placeholder="Please your website link"
                      name="website"
                      type="text"
                      component={FormField}
                      className="control"
                    />
                  </div>
                </div>
              )}

              <div className="m-b-10">
                <div className="m-b-10">Evidence Description</div>
                <div>
                  <Field
                    name="description"
                    placeholder="Insert description here"
                    component={TextareaField}
                    classForField="textarea"
                  />
                </div>
              </div>
            </div>
          </div>

          {editMode == 'suggest' && this.renderUnits()}

          <div className="p-30 has-text-right">
            <button
              className={classNames('button is-primary is-rounded', {
                'is-loading': attemptingPostUpdateAssessmentEvidence
              })}
              disabled={!this.isValid()}
              onClick={() => this.onSaveEvidence()}
            >
              {editMode == 'add' ? 'Upload' : 'Save'}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'type').required();
  return errors;
};

const EvidenceEditModalForm = reduxForm({
  form: FORM_NAME,
  validate
})(EvidenceEditModal);

const mapStateToProps = ({ form, profile, assessment, persisted }) => ({
  user: lodash.get(profile, 'user'),
  evidenceEdit: lodash.get(form, `${FORM_NAME}.values`),
  attemptingPostUpdateAssessmentEvidence: lodash.get(
    assessment,
    'attemptingPostUpdateAssessmentEvidence'
  ),
  assessmentEvidenceChangeState: lodash.get(
    assessment,
    'assessmentEvidenceChangeState'
  )
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },

  postAssessmentUpdateEvidenceAttempt: (
    member_id,
    qualification_id,
    evidence_id,
    payload
  ) =>
    dispatch(
      AssessmentActions.postAssessmentUpdateEvidenceAttempt(
        member_id,
        qualification_id,
        evidence_id,
        payload
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvidenceEditModalForm);
