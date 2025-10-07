import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import Collapsible from 'react-collapsible';
import Slider from 'react-slick';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';
import moment from 'moment';

import { Icon, InlineIcon } from '@iconify/react';
import grinIcon from '@iconify/icons-fa-regular/grin';

import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { _t, _tf, _tLevel } from 'app/intl';

import { Creators as AssessmentActions } from '../actions';

import navTabs from '../config/navs';
import { HeaderView, CriteriaTypeOptions } from '../components';
import EvidenceCard from '../components/evidence/evidence-card';
import EvidenceEditModal from '../components/evidence/evidence-edit-modal';
import EvidenceAddModal from '../components/evidence/evidence-add-modal';

import IconInfo from 'images/icon-info.svg';
import IconWorkbookActvity from 'images/workbook_activity_icon.png';

const {
  components: {
    CloudinaryMedia,
    EmptyView,
    Footer,
    ContentModalNew,
    ConvertDraftObjectToHtml,
    UIExplorerNav,
    UINavigation,
    UILoading,
    Pagination,
    UISearch
  },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      createCloudinaryUrl,
      elementAboveHeader,
      elementReachHeader,
      UserAccess
    }
  }
} = common;

const {
  SuperAdmin,
  SiteAdmin,
  CentreAdmin,
  CentreTutor,
  CentreLearner
} = Roles;

const ImageDimesnions = {
  width: 120,
  height: 120
};

class GalleryEvidenceRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      evidencesPerSlider: 28,
      searchUnitPhrase: '',
      searchEvidencePhrase: '',
      searchCriteriaPhrase: '',
      filterEvidenceTypes: [
        'activity',
        'knowledge',
        'observation',
        'discussion'
      ],
      evidenceDetailView: false,

      commentEditMode: false,
      activeGalleryDetailTab: 'Map to Criteria',

      activeCriteriaPage: 1,
      filteredCriterias: [],

      containerClass: '',
      evidenceCardClass: 'gallery-info',
      evidenceCardHeight: null,
      evidenceCardTop: null,

      activeEvidence: null,
      activeUnit: null,
      activeWorkbook: null,
      activeActivity: null,

      isActiveSave: false
    };
    this.renderUnits = this.renderUnits.bind(this);
    this.renderMedias = this.renderMedias.bind(this);
    this.onSearchUnits = this.onSearchUnits.bind(this);
    this.onSearchEvidences = this.onSearchEvidences.bind(this);
    this.onSetFilterEvidenceTypes = this.onSetFilterEvidenceTypes.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onClickEvidence = this.onClickEvidence.bind(this);
    this.onMapToCriteria = this.onMapToCriteria.bind(this);
    this.onSaveEvidence = this.onSaveEvidence.bind(this);
    this.onCancelEvidence = this.onCancelEvidence.bind(this);
    this.isChangedEvidence = this.isChangedEvidence.bind(this);
    this.onChangeComments = this.onChangeComments.bind(this);
    this.onSetEvidenceRating = this.onSetEvidenceRating.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      getAssessmentMemberEvidencesAttempt,
      getAssessmentAllCriteriasAttempt,
      params,
      users
    } = this.props;

    const member_id = lodash.get(params, 'memberId');
    const qualification_id = lodash.get(params, 'qualificationId');
    const member = lodash.find(users, u => u.member_id == member_id);

    if (!member || qualification_id == 0) {
      browserHistory.replace('/assessment/assessment-progress');
      return;
    }

    getAssessmentMemberEvidencesAttempt(
      params.memberId,
      params.qualificationId
    );

    getAssessmentAllCriteriasAttempt(params.memberId, params.qualificationId);

    // document
    //   .querySelector('.content-container')
    //   .removeEventListener('scroll', this.updateLayout);
    // if (window) {
    //   window.removeEventListener('resize', this.updateLayout);
    // }
  }

  componentDidMount() {
    document
      .querySelector('.content-container')
      .addEventListener('scroll', this.updateLayout);
    if (window) {
      window.addEventListener('resize', this.updateLayout);
    }

    const temp = document.getElementById('gallery-evidence-details');

    if (temp) {
      const width = (temp.clientWidth - 60) * 0.95;
      const num = Math.floor(width / (ImageDimesnions.width + 8));
      this.setState({ evidencesPerSlider: num * 3 });
    }
  }

  componentWillUnmount() {
    document
      .querySelector('.content-container')
      .removeEventListener('scroll', this.updateLayout);
    window.removeEventListener('resize', this.updateLayout);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      assessmentMemberEvidences,
      assessmentEvidenceDetails,
      assessmentCriterias,
      assessmentEvidenceChangeState
    } = nextProps;
    const {
      attemptingGetAssessmentMemberEvidenceDetails,
      attemptingPostAssessmentEvidence,
      attemptingPostUpdateAssessmentEvidence
    } = this.props;

    const currentEvidenceId = lodash.get(this.props, [
      'assessmentEvidenceDetails',
      'evidence_details',
      'learning_progress_evidence_id'
    ]);

    const { searchCriteriaPhrase, isActiveSave } = this.state;

    const evidenceDetails = lodash.get(
      assessmentEvidenceDetails,
      'evidence_details'
    );
    const evidenceId = lodash.get(
      evidenceDetails,
      'learning_progress_evidence_id'
    );

    if (
      !currentEvidenceId &&
      !attemptingGetAssessmentMemberEvidenceDetails &&
      assessmentMemberEvidences
    ) {
      const temp = lodash.get(assessmentMemberEvidences, ['evidences', '0']);

      if (temp) {
        this.onClickEvidence(
          lodash.get(temp, ['learning_progress_evidence_id']),
          null
        );
      }
    }

    if (
      attemptingGetAssessmentMemberEvidenceDetails ||
      (this.state.activeEvidence != assessmentEvidenceDetails &&
        attemptingPostAssessmentEvidence) ||
      (attemptingPostUpdateAssessmentEvidence && assessmentEvidenceChangeState)
    ) {
      this.setState({
        activeEvidence: assessmentEvidenceDetails,
        isActiveSave: false
      });
    }

    if (this.state.criterias !== assessmentCriterias) {
      this.onSearchCriterias(assessmentCriterias, searchCriteriaPhrase);
    }
  }

  updateLayout() {
    let newClass = 'gallery-info';
    let newHeight = null;
    let newTop = null;

    const stepsEle = document.querySelector(
      '.ui-explorer-nav > div:nth-of-type(1)'
    );

    if (stepsEle.className == 'fixed-explorer-nav') {
      const temp = 87 + stepsEle.offsetHeight;
      newClass = 'gallery-info fixed';
      newHeight = document.documentElement.offsetHeight - temp + 'px';
      newTop = temp + 'px';
    }

    this.setState({
      evidenceCardClass: newClass,
      evidenceCardHeight: newHeight,
      evidenceCardTop: newTop
    });
  }

  onSearchUnits(e) {
    this.setState({ searchUnitPhrase: e });
  }

  onSearchEvidences(e) {
    this.setState({ searchEvidencePhrase: e });
  }

  onSetFilterEvidenceTypes(evidenceType, e) {
    const { filterEvidenceTypes } = this.state;
    this.setState({
      filterEvidenceTypes: e.target.checked
        ? filterEvidenceTypes.concat([evidenceType])
        : filterEvidenceTypes.filter(et => et != evidenceType)
    });
  }

  onSearchCriterias(criterias, e) {
    let filteredCriterias = criterias;

    if (e) {
      filteredCriterias = criterias.filter(item => {
        const isTitle = lodash
          .get(item, 'title', '')
          .toLowerCase()
          .includes(e.trim().toLowerCase());
        // const isReference = lodash
        //   .get(item, 'unit.reference', '')
        //   .toLowerCase()
        //   .includes(searchCriteriaPhrase.trim().toLowerCase());
        return isTitle;
      });
    }

    this.setState({
      searchCriteriaPhrase: e,
      criterias: criterias,
      filteredCriterias: filteredCriterias
    });
  }

  onCriteriaPageChange(e) {
    this.setState({ activeCriteriaPage: e });
  }

  onMapToCriteria(e, curentCriteria) {
    const { activeEvidence } = this.state;
    const temp = lodash.find(
      lodash.get(activeEvidence, ['mapped_criteria']),
      criteria =>
        criteria.assessment_criteria_id == curentCriteria.assessment_criteria_id
    );
    if (temp) {
      const mapped_criteria = activeEvidence.mapped_criteria.filter(
        c => c.assessment_criteria_id != curentCriteria.assessment_criteria_id
      );
      this.setState({
        activeEvidence: {
          ...activeEvidence,
          mapped_criteria: activeEvidence.mapped_criteria.filter(
            c =>
              c.assessment_criteria_id != curentCriteria.assessment_criteria_id
          )
        },
        isActiveSave: this.isChangedEvidence(
          mapped_criteria,
          lodash.get(activeEvidence, ['evidence_details', 'evidence_rating'])
        )
      });
    } else {
      const mapped_criteria = lodash.orderBy(
        activeEvidence.mapped_criteria.concat([
          lodash.pick(curentCriteria, [
            'assessment_criteria_id',
            'criteria_number',
            'outcome_number',
            'title'
          ])
        ]),
        ['outcome_number', 'criteria_number']
      );
      this.setState({
        activeEvidence: { ...activeEvidence, mapped_criteria: mapped_criteria },
        isActiveSave: this.isChangedEvidence(
          mapped_criteria,
          lodash.get(activeEvidence, ['evidence_details', 'evidence_rating'])
        )
      });
    }
  }

  onSetEvidenceRating(e) {
    const { activeEvidence } = this.state;
    const { assessmentEvidenceDetails } = this.props;

    this.setState({
      activeEvidence: {
        ...activeEvidence,
        evidence_details: {
          ...activeEvidence.evidence_details,
          evidence_rating: e
        }
      },
      isActiveSave: this.isChangedEvidence(
        lodash.get(activeEvidence, ['mapped_criteria']) || null,
        e,
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'tutor_comments'
        ]),
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'learner_comments'
        ]),
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'qa_comments'
        ])
      )
    });
  }

  isChangedEvidence(
    mapped_criteria,
    evidence_rating,
    tutor_comments,
    learner_comments,
    qa_comments
  ) {
    const { assessmentEvidenceDetails } = this.props;
    const temp1 = lodash.map(
      lodash.get(assessmentEvidenceDetails, ['mapped_criteria']),
      c => lodash.get(c, 'assessment_criteria_id')
    );
    const temp2 = lodash.map(mapped_criteria, c =>
      lodash.get(c, 'assessment_criteria_id')
    );

    return (
      !lodash.isEqual(temp1, temp2) ||
      !lodash.isEqual(
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'evidence_rating'
        ]),
        evidence_rating
      ) ||
      !lodash.isEqual(
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'tutor_comments'
        ]),
        tutor_comments
      ) ||
      !lodash.isEqual(
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'learner_comments'
        ]),
        learner_comments
      ) ||
      !lodash.isEqual(
        lodash.get(assessmentEvidenceDetails, [
          'evidence_details',
          'qa_comments'
        ]),
        qa_comments
      )
    );
  }

  onSaveEvidence() {
    const {
      assessmentEvidenceDetails,
      params,
      postAssessmentUpdateEvidenceAttempt
    } = this.props;
    const { activeEvidence, isActiveSave } = this.state;
    const member_id = lodash.get(params, 'memberId');
    const qualification_id = lodash.get(params, 'qualificationId');
    const currentEvidenceId = lodash.get(assessmentEvidenceDetails, [
      'evidence_details',
      'learning_progress_evidence_id'
    ]);

    if (isActiveSave) {
      postAssessmentUpdateEvidenceAttempt(
        member_id,
        qualification_id,
        currentEvidenceId,
        {
          assessment_criteria: activeEvidence.mapped_criteria.map(
            c => c.assessment_criteria_id
          ),
          evidence_rating:
            lodash.get(activeEvidence, [
              'evidence_details',
              'evidence_rating'
            ]) || null
        }
      );
    }
  }

  onCancelEvidence() {
    const { evidenceDetails } = this.props;
    this.setState({ activeEvidence: evidenceDetails });
  }

  onClickEvidence(evidenceId, hasMedia) {
    const {
      assessmentEvidenceDetails,
      getAssessmentMemberEvidenceDetailsAttempt,
      params
    } = this.props;
    const currentEvidenceId = lodash.get(assessmentEvidenceDetails, [
      'evidence_details',
      'learning_progress_evidence_id'
    ]);
    if (currentEvidenceId !== evidenceId) {
      this.setState({ isActiveSave: false });

      getAssessmentMemberEvidenceDetailsAttempt(
        params.memberId,
        params.qualificationId,
        evidenceId
      );
    }
  }

  setActiveActivity(workbook, activity) {
    this.setState({ activeWorkbook: workbook, activeActivity: activity });
  }

  renderMedias() {
    const { assessmentMemberEvidences } = this.props;
    const { filterEvidenceTypes, evidencesPerSlider } = this.state;

    const evidences = lodash.orderBy(
      lodash.filter(
        lodash.get(assessmentMemberEvidences, ['evidences']) || [],
        e =>
          lodash.intersection(e.evidence_type, filterEvidenceTypes).length > 0
      ),
      ['created'],
      ['desc']
    );
    const tempEvidences = lodash.chunk(evidences, evidencesPerSlider);

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    return (
      <div style={{ padding: '0 1.8rem' }}>
        {evidences.length > 0 ? (
          <div className="media-slider">
            <Slider {...settings}>
              {lodash.map(tempEvidences, (slider, i) => (
                <div key={`media-item-${i}`}>
                  <div className="gallery-images">
                    {slider.map((evidence, k) => {
                      const hasMedia =
                        !!evidence.cloudinary_file_id &&
                        !!evidence.cloudinary_file_type;

                      return (
                        <div
                          key={`evidence_${i}_${k}`}
                          className="evidence-image"
                          style={{
                            backgroundImage: !hasMedia
                              ? `url(${IconWorkbookActvity})`
                              : null
                          }}
                          onClick={() =>
                            this.onClickEvidence(
                              lodash.get(evidence, [
                                'learning_progress_evidence_id'
                              ]),
                              hasMedia
                            )
                          }
                        >
                          {hasMedia && (
                            <CloudinaryMedia
                              style={{ ...ImageDimesnions }}
                              mediaType={evidence.cloudinary_file_type}
                              fileId={evidence.cloudinary_file_id || ''}
                              transformations={{
                                width: ImageDimesnions.width,
                                height: ImageDimesnions.height,
                                crop: 'fill',
                                gravity: 'north',
                                quality: 100
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        ) : (
          <div className="media-slider p-t-30 semibold no-content">
            No Evidences
          </div>
        )}

        <div
          className="is-flex m-t-30"
          style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
        >
          <div className="m-r-20">
            <CriteriaTypeOptions
              activity={lodash.indexOf(filterEvidenceTypes, 'activity') >= 0}
              knowledge={lodash.indexOf(filterEvidenceTypes, 'knowledge') >= 0}
              observation={
                lodash.indexOf(filterEvidenceTypes, 'observation') >= 0
              }
              discussion={
                lodash.indexOf(filterEvidenceTypes, 'discussion') >= 0
              }
              onChangeOption={this.onSetFilterEvidenceTypes}
            />
          </div>

          <div className="m-r-20 m-b-5 text-emphasis">
            All Videos:{' '}
            {lodash.get(assessmentMemberEvidences, 'videos_total', 0)}
          </div>

          <div className="m-r-20 m-b-5 text-emphasis">
            All Images:{' '}
            {lodash.get(assessmentMemberEvidences, 'images_total', 0)}
          </div>

          <div className="m-r-30">
            <a
              className="button is-primary is-rounded"
              onClick={() => {
                this.evidenceAddModal.open();
              }}
            >
              ADD EVIDENCE
            </a>
          </div>
        </div>
      </div>
    );
  }

  renderUnits() {
    const { userRole, lang, assessmentMemberEvidences } = this.props;
    const {
      searchUnitPhrase,
      activeEvidence,
      activeUnit,
      activeActivity
    } = this.state;

    const evidences_by_units = lodash.get(
      assessmentMemberEvidences,
      'evidences_by_units',
      []
    );
    let filteredUnits = evidences_by_units;

    if (searchUnitPhrase) {
      filteredWorkbooks = filteredWorkbooks.filter(item => {
        const isTitle = lodash
          .get(item, 'unit.title', '')
          .toLowerCase()
          .includes(searchUnitPhrase.trim().toLowerCase());
        const isReference = lodash
          .get(item, 'unit.reference', '')
          .toLowerCase()
          .includes(searchUnitPhrase.trim().toLowerCase());
        return isTitle || isReference;
      });
    }

    return (
      <div className="guidance">
        <div
          className="subtitle is-flex border-bottom"
          style={{ marginBottom: '0', paddingBottom: '15px' }}
        >
          <span>
            {lodash.get(activeEvidence, 'evidence_details.title', '')} -
            Associate with units
          </span>
        </div>

        {
          // <div className="p-15 border-bottom">
          //   <div style={{ maxWidth: '300px', margin: 'auto' }}>
          //     <UISearch
          //       onSearch={e => this.onSearchUnits(e)}
          //       placeholder="Search Units"
          //       translate={true}
          //     />
          //   </div>
          // </div>
        }

        <div className="evidence-detail-units">
          {filteredUnits.map((u, i) => {
            return (
              <Collapsible
                trigger={
                  <div className="evidence-detail-unit">
                    <div className="unit-number semibold">
                      {'Unit' + lodash.get(u, 'unit_id') || ' '}
                    </div>
                    <div className="unit-title">
                      {lodash.get(u, 'title') +
                        ' ' +
                        lodash.get(u, 'reference')}
                    </div>
                    <div className="unit-completed">
                      {lodash.get(u, 'progress_percentage') || 0}% Completed
                    </div>
                  </div>
                }
                key={i}
                classParentString="is-border-bottom text-emphasis Collapsible"
                handleTriggerClick={() =>
                  this.setState({ activeUnit: activeUnit == u ? null : u })
                }
                open={u == activeUnit}
              >
                <div>
                  <table
                    className={classNames(
                      'table evidence-detail-outcomes-table'
                    )}
                    style={{ width: '100%' }}
                  >
                    <thead>
                      <tr>
                        <th className="outcome-no" />
                        <th className="semibold outcome-title">
                          Learning Outcomes
                        </th>
                        <th className="semibold outcome-elements">Elements</th>
                        <th className="semibold outcome-criteria">
                          Assessment Criteria
                        </th>
                        <th className="semibold evidence-no">Evidence No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(lodash.get(u, 'outcomes') || []).map((outcome, j) => {
                        return (
                          <tr key={`outcome${j}`}>
                            <td colSpan="5">
                              <table
                                className={classNames(
                                  'table evidence-detail-criteria-table'
                                )}
                              >
                                <tbody>
                                  {(
                                    lodash.get(outcome, [
                                      'assessment_criteria'
                                    ]) || []
                                  ).map((criteria, k) => {
                                    return (
                                      <tr key={`criteria${j}${k}`}>
                                        <td className="outcome-no">
                                          {(k == 0 &&
                                            lodash.get(outcome, ['number'])) ||
                                            ''}
                                        </td>
                                        <td className="outcome-title">
                                          {(k == 0 &&
                                            lodash.get(outcome, ['title'])) ||
                                            ''}
                                        </td>
                                        <td className="outcome-elements">
                                          {lodash.get(outcome, ['number']) ||
                                            ''}
                                          .
                                          {lodash.get(criteria, ['number']) ||
                                            ''}
                                        </td>
                                        <td className="outcome-criteria">
                                          <div
                                            className={classNames({
                                              'has-guidance':
                                                lodash.size(criteria.guidance) >
                                                0
                                            })}
                                          >
                                            <Collapsible
                                              trigger={
                                                <div className="">
                                                  {lodash.get(criteria, [
                                                    'title'
                                                  ]) || ''}
                                                </div>
                                              }
                                              classParentString="text-emphasis Collapsible"
                                            >
                                              <div />
                                            </Collapsible>
                                          </div>
                                        </td>
                                        <td className="evidence-no">
                                          {(
                                            lodash.get(criteria, [
                                              'evidence'
                                            ]) || []
                                          ).map((ev, l) => (
                                            <span
                                              key={`evidence_no${i}${j}${k}${l}`}
                                            >
                                              {l > 0 && <span>, </span>}
                                              <span
                                                onClick={() =>
                                                  this.onClickEvidence(ev)
                                                }
                                              >
                                                {ev}
                                              </span>
                                            </span>
                                          ))}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </div>
    );
  }

  currentRating(rate) {
    switch (rate) {
      case 1:
        return (
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <i className="fa fa-frown-o" aria-hidden="true" />
            &nbsp;&nbsp;
            <span className="semibold">Unsatisfactory</span>
          </div>
        );
      case 2:
        return (
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <i className="fa fa-meh-o" aria-hidden="true" />
            &nbsp;&nbsp;
            <span className="semibold">Satisfactory</span>
          </div>
        );
      case 3:
        return (
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <i className="fa fa-smile-o" aria-hidden="true" />
            &nbsp;&nbsp;
            <span className="semibold">Good</span>
          </div>
        );
      case 4:
        return (
          <div className="is-flex" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: '20px' }}>
              <Icon icon={grinIcon} />
            </span>
            &nbsp;
            <span className="semibold">Outstanding</span>
          </div>
        );
    }
    return null;
  }

  onChangeComments(e, target) {
    const { activeEvidence } = this.state;

    const evidence_details = {
      ...activeEvidence.evidence_details,
      target: e.target.value
    };
    evidence_details[target] = e.target.value;

    this.setState({
      activeEvidence: {
        ...activeEvidence,
        evidence_details: evidence_details
      },
      isActiveSave: this.isChangedEvidence(
        lodash.get(activeEvidence, ['mapped_criteria']) || null,
        lodash.get(activeEvidence, ['evidence_details', 'evidence_rating']) ||
          null,
        target == 'tutor_comments'
          ? e.target.value
          : lodash.get(activeEvidence, ['evidence_details', 'tutor_comments']),
        target == 'learner_comments'
          ? e.target.value
          : lodash.get(activeEvidence, [
              'evidence_details',
              'learner_comments'
            ]),
        target == 'qa_comments'
          ? e.target.value
          : lodash.get(activeEvidence, ['evidence_details', 'qa_comments'])
      )
    });
  }

  renderEvidenceDetail() {
    const {
      user,
      attemptingGetAssessmentMemberEvidenceDetails,
      attemptingPostUpdateAssessmentEvidence,
      assessmentCriterias
    } = this.props;
    const {
      activeGalleryDetailTab,
      activeEvidence,
      activeCriteriaPage,

      searchCriteriaPhrase,

      criterias,
      filteredCriterias,
      isActiveSave,

      commentEditMode
    } = this.state;

    const galleryDetailTabs = [
      'Map to Criteria',
      'Tutor Comments',
      'Learner Comments',
      'EQA Comments'
    ];

    const userRole = extractUserRole(user);

    const title =
      lodash.get(activeEvidence, 'evidence_details.title') || 'Evidence Title';
    const created =
      lodash.get(activeEvidence, 'evidence_details.created') || '';
    const createdBy =
      lodash.get(activeEvidence, 'evidence_details.created_by.screen_name') ||
      '';
    const activeRatingButton =
      lodash.get(activeEvidence, ['evidence_details', 'evidence_rating']) ||
      null;
    const mapped_criteria = lodash.get(activeEvidence, 'mapped_criteria') || [];
    const units_tags = lodash.filter(
      lodash.get(activeEvidence, 'units_tags') || [],
      ut => ut.mapped_outcomes && ut.mapped_outcomes.length > 0
    );

    let curentCriteria =
      lodash.get(filteredCriterias, [activeCriteriaPage - 1]) || null;
    let comments = '';
    let isAdded = false;

    switch (activeGalleryDetailTab) {
      case 'Map to Criteria':
        comments =
          lodash.get(activeEvidence, 'evidence_details.description') || '';

        if (curentCriteria) {
          isAdded =
            lodash.findIndex(
              mapped_criteria,
              criteria =>
                criteria.assessment_criteria_id ==
                lodash.get(curentCriteria, 'assessment_criteria_id')
            ) >= 0;
        }

        break;
      case 'Tutor Comments':
        comments =
          lodash.get(activeEvidence, 'evidence_details.learner_comments') || '';
        break;
      case 'Learner Comments':
        comments =
          lodash.get(activeEvidence, 'evidence_details.tutor_comments') || '';
        break;
      case 'EQA Comments':
        comments =
          lodash.get(activeEvidence, 'evidence_details.qa_comments') || '';
    }

    return (
      <div className="evidence-detail">
        <div className="evidence-detail-content">
          <div className="is-flex">
            <div className="evidence-title p-b-10">
              {title.length > 28 ? `${title.slice(0, 25)}...` : title}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ evidenceDetailView: false })}
              >
                Back to Gallery X
              </span>
            </div>
          </div>

          <div className="evidence-detail-tab-container">
            <div className="evidence-detail-tabs">
              {lodash.map(galleryDetailTabs, (tab, i) => {
                return (
                  <a
                    className={classNames('evidence-detail-tab', {
                      active: activeGalleryDetailTab == tab
                    })}
                    key={`detail-tab-${i}`}
                    onClick={() =>
                      this.setState({
                        activeGalleryDetailTab: tab,
                        commentEditMode: false
                      })
                    }
                  >
                    {tab}
                  </a>
                );
              })}
            </div>

            {activeGalleryDetailTab == 'Map to Criteria' && (
              <div className="evidence-detail-tab-content map-to-criteria">
                <div className="is-flex" style={{ paddingTop: '0.75rem' }}>
                  <div
                    style={{
                      margin: 'auto',
                      marginLeft: '0',
                      padding: '0 15px',
                      minWidth: '250px',
                      width: '40%'
                    }}
                  >
                    <UISearch
                      searchValue={searchCriteriaPhrase}
                      onSearch={e => this.onSearchCriterias(criterias, e)}
                      placeholder="Search Criteria"
                      translate={true}
                    />
                  </div>

                  {
                    <div style={{ padding: '0.5rem 1.5em 0 1.5em' }}>
                      <Pagination
                        itemsLength={
                          lodash.get(filteredCriterias, 'length') || 0
                        }
                        itemsPerPage={1}
                        forcePage={activeCriteriaPage - 1}
                        maxPagesDisplayed={4}
                        onPageChange={e => {
                          this.onCriteriaPageChange(e);
                        }}
                      />
                    </div>
                  }
                </div>

                {curentCriteria ? (
                  <div className="border-bottom p-10">
                    <div
                      className="is-flex p-10 background-default"
                      style={{ justifyContent: 'space-between' }}
                    >
                      <div
                        className="unit-title semibold"
                        style={{ fontSize: '18px' }}
                      >
                        <div>
                          Unit &nbsp;
                          {lodash.get(curentCriteria, ['unit_id']) || ''}
                          &nbsp;
                          {lodash.get(curentCriteria, ['unit_reference']) || ''}
                        </div>
                        <div>
                          {lodash.get(curentCriteria, ['unit_title']) || ''}
                        </div>
                      </div>
                      <div>
                        <CriteriaTypeOptions
                          activity={
                            lodash.get(curentCriteria, ['require_activity']) ||
                            false
                          }
                          knowledge={
                            lodash.get(curentCriteria, ['require_knowledge']) ||
                            false
                          }
                          observation={
                            lodash.get(curentCriteria, [
                              'require_observation'
                            ]) || false
                          }
                          discussion={
                            lodash.get(curentCriteria, [
                              'require_discussion'
                            ]) || false
                          }
                        />
                      </div>
                    </div>
                    <div className="background-default p-l-10">
                      <div className="criteria-item p-t-15 p-b-15">
                        <div className="criteria-number semibold">
                          Criteria No{' '}
                          {lodash.get(curentCriteria, ['outcome_number']) || ''}
                          .
                          {lodash.get(curentCriteria, ['criteria_number']) ||
                            ''}
                        </div>
                        <div className="criteria-title">
                          {lodash.get(curentCriteria, ['title']) ||
                            'Criteria Title'}
                        </div>
                        <div className="criteria-checkbox">
                          <label className="custom checkbox m-l-5">
                            <input
                              type="radio"
                              checked={isAdded}
                              onClick={e =>
                                this.onMapToCriteria(e, curentCriteria)
                              }
                              onChange={() => {}}
                            />
                            <span className="ui" />
                          </label>
                          <div>ADD</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-bottom p-30 semibold no-content">
                    No Criterias
                  </div>
                )}

                <div className="evidence-detail-tags p-15">
                  <div className="semibold m-b-10" style={{ fontSize: '18px' }}>
                    Evidence Tags
                  </div>
                  {units_tags.map((u, i) => {
                    return (
                      <div key={`unit_tag${i}`} className="m-b-10">
                        <div className="semibold m-b-5">
                          Unit {lodash.get(u, 'unit_id') || ''}{' '}
                          {lodash.get(u, 'title') || 'Unit Title'}
                        </div>
                        <div className="is-flex">
                          {(lodash.get(u, 'mapped_outcomes') || []).map(
                            (mo, j) => {
                              return (
                                <div
                                  key={`mapped_outcome${i}${j}`}
                                  className="evidence-tag"
                                >
                                  {lodash.get(mo, 'outcome_number')}.
                                  {lodash.get(mo, 'criteria_number')}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeGalleryDetailTab == 'Tutor Comments' && (
              <div className="evidence-detail-tab-content">
                <div className="is-flex">
                  <div className="semibold">My Comment &nbsp;&nbsp;&nbsp;</div>
                  {userRole == CentreTutor && !commentEditMode && (
                    <div
                      className="edit-button"
                      onClick={() => this.setState({ commentEditMode: true })}
                    >
                      <span>Edit</span>&nbsp;
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  )}
                  {userRole == CentreTutor && commentEditMode && (
                    <div
                      className="edit-button"
                      onClick={() => this.setState({ commentEditMode: false })}
                    >
                      <span>View</span>
                    </div>
                  )}
                  <div className="is-flex added-content">
                    <span>Added</span>&nbsp;&nbsp;
                    <span>03/09/2017 | 25.00</span> &nbsp;&nbsp;&nbsp;&nbsp;
                    {this.currentRating(activeRatingButton)}
                  </div>
                </div>

                <div className="evidence-detail-tab-comment">
                  {commentEditMode ? (
                    <div className="comments-edit">
                      <textarea
                        className="textarea"
                        onChange={e => {
                          this.onChangeComments(e, 'tutor_comments');
                        }}
                        value={comments}
                      />
                    </div>
                  ) : (
                    <div className="comments-edit">{comments}</div>
                  )}
                </div>
              </div>
            )}

            {activeGalleryDetailTab == 'Learner Comments' && (
              <div className="evidence-detail-tab-content">
                <div className="is-flex">
                  <div className="semibold">My Comment &nbsp;&nbsp;&nbsp;</div>
                  {userRole == CentreLearner && !commentEditMode && (
                    <div
                      className="edit-button"
                      onClick={() => this.setState({ commentEditMode: true })}
                    >
                      <span>Edit</span>&nbsp;
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  )}

                  {userRole == CentreTutor && commentEditMode && (
                    <div
                      className="edit-button"
                      onClick={() => this.setState({ commentEditMode: false })}
                    >
                      <span>View</span>
                    </div>
                  )}

                  <div className="added-content">
                    <span>Added</span>&nbsp;&nbsp;
                    <span>03/09/2017 | 25.00</span> &nbsp;&nbsp;&nbsp;
                    {this.currentRating(activeRatingButton)}
                  </div>
                </div>

                <div className="evidence-detail-tab-comment">
                  {commentEditMode ? (
                    <div className="comments-edit">
                      <textarea
                        className="textarea"
                        onChange={e => {
                          this.onChangeComments(e, 'learner_comments');
                        }}
                        value={comments}
                      />
                    </div>
                  ) : (
                    <div className="comments-edit">{comments}</div>
                  )}
                </div>
              </div>
            )}

            {activeGalleryDetailTab == 'EQA Comments' && (
              <div className="evidence-detail-tab-content">
                <div className="is-flex">
                  <div className="semibold">My Comment &nbsp;&nbsp;&nbsp;</div>
                  {!commentEditMode && (
                    <div
                      className="edit-button"
                      onClick={() => this.setState({ commentEditMode: true })}
                    >
                      <span>Edit</span>&nbsp;
                      <i className="fa fa-pencil" aria-hidden="true" />
                    </div>
                  )}

                  {commentEditMode && (
                    <div
                      className="edit-button"
                      onClick={() => this.setState({ commentEditMode: false })}
                    >
                      <span>View</span>
                    </div>
                  )}
                  <div className="added-content">
                    <span>Added</span>&nbsp;&nbsp;
                    <span>03/09/2017 | 25.00</span> &nbsp;&nbsp;&nbsp;
                    {this.currentRating(activeRatingButton)}
                  </div>
                </div>

                <div className="evidence-detail-tab-comment">
                  {commentEditMode ? (
                    <div className="comments-edit">
                      <textarea
                        className="textarea"
                        onChange={e => {
                          this.onChangeComments(e, 'qa_comments');
                        }}
                        value={comments}
                      />
                    </div>
                  ) : (
                    <div className="comments-edit">{comments}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className="is-flex m-t-30"
            style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}
          >
            <button
              className={classNames('button is-primary is-rounded', {
                'is-loading': attemptingPostUpdateAssessmentEvidence
              })}
              disabled={!isActiveSave}
              onClick={() => this.onSaveEvidence()}
            >
              Save
            </button>
            &nbsp;&nbsp;
            <button
              className={classNames('button is-primary is-rounded is-outlined')}
              onClick={() => this.onCancelEvidence()}
            >
              Cancel
            </button>
            <div className="evidence-rating">
              <div className="member-name semibold">Evidence Rating</div>
              <div className="evidence-rating-buttons m-t-10">
                <div
                  className={classNames('evidence-rating-button', {
                    active: activeRatingButton == 1
                  })}
                  onClick={() => this.onSetEvidenceRating(1)}
                >
                  <i className="fa fa-frown-o" aria-hidden="true" />{' '}
                  &nbsp;&nbsp;
                  <span className="semibold">Unsatisfactory</span>
                </div>
                <div
                  className={classNames('evidence-rating-button', {
                    active: activeRatingButton == 2
                  })}
                  onClick={() => this.onSetEvidenceRating(2)}
                >
                  <i className="fa fa-meh-o" aria-hidden="true" /> &nbsp;&nbsp;
                  <span className="semibold">Satisfactory</span>
                </div>
                <div
                  className={classNames('evidence-rating-button', {
                    active: activeRatingButton == 3
                  })}
                  onClick={() => this.onSetEvidenceRating(3)}
                >
                  <i className="fa fa-smile-o" aria-hidden="true" />
                  &nbsp;&nbsp;
                  <span className="semibold">Good</span>
                </div>
                <div
                  className={classNames('evidence-rating-button', {
                    active: activeRatingButton == 4
                  })}
                  onClick={() => this.onSetEvidenceRating(4)}
                >
                  <span
                    style={{
                      fontSize: '20px',
                      marginBottom: '-6px',
                      marginRight: '2px'
                    }}
                  >
                    <Icon icon={grinIcon} />
                  </span>
                  &nbsp;
                  <span className="semibold">Outstanding</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mapped-criteria m-t-30">
            <div className="semibold content-title p-b-5">
              Previous Mapped Criteria
            </div>
            <div className="criterias">
              {mapped_criteria.map((c, m) => {
                return (
                  <div
                    key={`mapped_criteria${m}`}
                    className="criteria-item p-t-15 p-b-15 border-bottom"
                  >
                    <div className="criteria-number">
                      {lodash.get(c, 'outcome_number') || ''}.
                      {lodash.get(c, 'criteria_number') || ''}
                    </div>
                    <div className="criteria-title">
                      {lodash.get(c, 'title') || ''}
                    </div>
                    <div className="criteria-checkbox">
                      <label className="custom checkbox">
                        <input
                          type="radio"
                          value="1"
                          checked={true}
                          onChange={() => {}}
                        />
                        <span className="ui" />
                      </label>
                    </div>
                  </div>
                );
              })}
              <div />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderLearnerComment() {
    return (
      <div className="learner-comment">
        <div className="semibold m-b-10" style={{ fontSize: '18px' }}>
          Learner Comment
        </div>
        <div className="m-b-10">
          <div className="semibold m-b-5">Was it a fair Assessment?</div>
          <div className="is-flex">
            <label className="custom checkbox">
              <input
                type="radio"
                value="1"
                checked={true}
                onChange={() => {}}
              />
              <span className="ui" />
              <div>Yes</div>
            </label>
            <label className="custom checkbox">
              <input
                type="radio"
                value="0"
                checked={false}
                onChange={() => {}}
              />
              <span className="ui" />
              <div>No</div>
            </label>
          </div>
        </div>

        <div>
          <div className="semibold m-b-5">
            Do you understand the assessment decision?
          </div>
          <div className="is-flex">
            <label className="custom checkbox">
              <input
                type="radio"
                value="1"
                checked={true}
                onChange={() => {}}
              />
              <span className="ui" />
              <div>Yes</div>
            </label>
            <label className="custom checkbox">
              <input
                type="radio"
                value="0"
                checked={false}
                onChange={() => {}}
              />
              <span className="ui" />
              <div>No</div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      params,
      users,
      setSearchQuery,
      lang,
      assessmentMemberEvidences,
      attemptingGetAssessmentMemberEvidences
    } = this.props;

    const {
      activeEvidence,
      evidenceDetailView,
      activeGalleryDetailTab,
      containerClass,
      evidenceCardClass,
      evidenceCardHeight,
      evidenceCardTop
    } = this.state;

    const memberId = lodash.get(params, 'memberId');
    const qualificationId = lodash.get(params, 'qualificationId');

    const member = lodash.find(users, u => u.member_id == memberId);

    const workbooks = lodash.get(activeEvidence, 'workbooks', []);
    const member_qualification = lodash.get(
      assessmentMemberEvidences,
      'member_qualification'
    );

    return (
      <div className={`assessment-route ${containerClass}`}>
        {/* Modals */}
        <ContentModalNew
          className="unit-overview-modal"
          ref={e => {
            this.evidenceAddModal = e;
          }}
        >
          <EvidenceAddModal {...{ memberId, qualificationId }} />
        </ContentModalNew>

        {/* Header */}
        <HeaderView member={member} qualification={member_qualification} />

        {/* Nav */}
        <UIExplorerNav>
          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                active={`gallery-evidence`}
                tabs={navTabs}
                onSearch={value => {
                  this.onSearchEvidences(value);
                }}
                searchPlaceholder={_t('filter_evidences', lang)}
                translate={false}
              />
            </div>
          </section>
        </UIExplorerNav>
        {attemptingGetAssessmentMemberEvidences ? (
          <UILoading marginTop="100px" marginBottom="100px" />
        ) : (
          <section className="gallery-evidence-content-section">
            <div
              className={`container is-flex`}
              style={{ height: '100%', padding: '30px 1rem 0 1rem' }}
            >
              <div
                className={evidenceCardClass}
                style={{
                  height: evidenceCardHeight,
                  top: evidenceCardTop
                }}
              >
                {!evidenceDetailView && (
                  <div
                    className="gallery-info-button"
                    onClick={() => this.setState({ evidenceDetailView: true })}
                  >
                    <Isvg className="small" src={IconInfo} />
                  </div>
                )}
                <EvidenceCard
                  {...{ evidenceDetailView, memberId, qualificationId }}
                  evidence={activeEvidence}
                  onDetailView={() =>
                    this.setState({ evidenceDetailView: true })
                  }
                />

                {!evidenceDetailView && (
                  <div className="p-15">
                    <div className="m-b-15">
                      <div className="m-b-2 text-emphasis">
                        Evidence has been added to:
                      </div>
                      {workbooks.map((w, j) => {
                        return (
                          <div key={'workbook' + j}>
                            {(lodash.get(w, 'activities') || []).map((a, k) => {
                              return (
                                <div key={`w_unit${k}`} className="is-flex">
                                  <div className="m-r-5">
                                    {lodash.get(a, 'title') +
                                      ' #' +
                                      lodash.get(a, 'activity_id')}
                                  </div>
                                  <div>
                                    <a
                                      onClick={() =>
                                        this.setActiveActivity(w, a)
                                      }
                                    >
                                      view
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {evidenceDetailView &&
                  activeGalleryDetailTab == 'Tutor Comments' &&
                  this.renderLearnerComment()}
              </div>

              {evidenceDetailView ? (
                <div
                  id="gallery-evidence-details"
                  className="gallery-details-view"
                >
                  {this.renderEvidenceDetail()}
                  <div
                    className="gallery-info-button"
                    onClick={() => this.setState({ evidenceDetailView: false })}
                  >
                    <Isvg className="small" src={IconInfo} />
                  </div>
                  <Footer />
                </div>
              ) : (
                <div
                  id="gallery-evidence-details"
                  className="gallery-details-view"
                >
                  {this.renderMedias()}
                  {this.renderUnits()}
                  <Footer />
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, profile, community, assessment }) => {
  return {
    user: lodash.get(profile, 'user'),
    lang: lodash.get(persisted, 'lang'),
    users: lodash.get(community, 'users'),
    assessmentMemberEvidences: lodash.get(
      assessment,
      'assessmentMemberEvidences'
    ),
    assessmentEvidenceDetails: lodash.get(
      assessment,
      'assessmentEvidenceDetails'
    ),
    assessmentCriterias: lodash.get(assessment, 'assessmentCriterias'),

    attemptingGetAssessmentMemberEvidences: lodash.get(
      assessment,
      'attemptingGetAssessmentMemberEvidences'
    ),
    attemptingGetAssessmentMemberEvidenceDetails: lodash.get(
      assessment,
      'attemptingGetAssessmentMemberEvidenceDetails'
    ),
    attemptingGetAssessmentCriterias: lodash.get(
      assessment,
      'attemptingGetAssessmentCriterias'
    ),
    attemptingPostAssessmentEvidence: lodash.get(
      assessment,
      'attemptingPostAssessmentEvidence'
    ),
    attemptingPostUpdateAssessmentEvidence: lodash.get(
      assessment,
      'attemptingPostUpdateAssessmentEvidence'
    ),
    assessmentEvidenceChangeState: lodash.get(
      assessment,
      'assessmentEvidenceChangeState'
    )
  };
};

const mapDispatchToProps = dispatch => ({
  getAssessmentMemberEvidencesAttempt: (member_id, qualification_id) =>
    dispatch(
      AssessmentActions.getAssessmentMemberEvidencesAttempt(
        member_id,
        qualification_id,
        null
      )
    ),

  getAssessmentMemberEvidenceDetailsAttempt: (
    member_id,
    qualification_id,
    evidence_id
  ) =>
    dispatch(
      AssessmentActions.getAssessmentMemberEvidenceDetailsAttempt(
        member_id,
        qualification_id,
        evidence_id
      )
    ),

  getAssessmentAllCriteriasAttempt: (member_id, qualification_id) =>
    dispatch(
      AssessmentActions.getAssessmentAllCriteriasAttempt(
        member_id,
        qualification_id
      )
    ),

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
)(GalleryEvidenceRoute);
