import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import classNames from 'classnames';
import Collapsible from 'react-collapsible';
import Slider from 'react-slick';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';
import { path } from 'ramda';

import config from 'brand/config';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Text, Option, _t, _tf, _tLevel } from 'app/intl';

import { Creators as AssessmentActions } from '../actions';
import { HeaderView } from '../components';
import UnitProgressCard from '../components/unit-progress/unit-progress-card';
import AssessmentActivityModal from '../components/modals/assessment-activity-modal';
import EvidenceDetailsModal from '../components/evidence/evidence-details-modal';
import navTabs from '../config/navs';

import IconRun from 'images/icon-run.svg';
import IconBinoculars from 'images/icon-binoculars.svg';
import IconQuote from 'images/icon-quote.svg';
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
    UIProgressBar
  },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      createCloudinaryUrl,
      elementAboveHeader
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

const unitTabs = [
  {
    key: 'unit-progress',
    text: 'unit_progress'
  }
  // {
  //   key: 'professional-discussion',
  //   text: 'professional_discussion'
  // },
  // {
  //   key: 'written-observations',
  //   text: 'gallery_evidence'
  // },
  // {
  //   key: 'observation-range',
  //   text: 'action_plan'
  // },
  // {
  //   key: 'feedback',
  //   text: 'Feedback'
  // }
];

class UnitProgressRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      units: [],
      activeUnit: null,
      activeUnitId: null,
      activeUnitTab: 'unit-progress',
      activeOutcome: 0,
      activeEvidence: null
    };

    this.setActiveUnit = this.setActiveUnit.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { getAssessmentMemberQualificationAttempt, member } = this.props;

    const member_id = lodash.get(member, 'member_id');
    const qualification = lodash.get(member, 'current_qualification');
    const qualification_id = lodash.get(qualification, 'qualification_id');

    if (!member || qualification_id == 0) {
      browserHistory.replace('/assessment/assessment-progress');
      return;
    }

    getAssessmentMemberQualificationAttempt(member_id, qualification_id);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      attemptingGetAssessmentMemberQualification,
      attemptingGetAssessmentMemberUnit,
      assessmentMemberQualification,
      assessmentMemberUnit
    } = nextProps;

    if (attemptingGetAssessmentMemberQualification) {
      this.setState({ units: [], activeUnit: null });
    } else if (
      !lodash.head(this.state.units) &&
      assessmentMemberQualification
    ) {
      const units = lodash.get(assessmentMemberQualification, 'units', []);

      if (units.length > 0) {
        this.setState({ units: units });
        this.setActiveUnit(lodash.head(units));
      }
    }

    if (attemptingGetAssessmentMemberUnit) {
      this.setState({ activeUnit: null });
    } else if (!this.state.activeUnit && assessmentMemberUnit) {
      this.setState({
        activeUnit: assessmentMemberUnit,
        activeOutcome: lodash.head(
          lodash.get(assessmentMemberUnit, 'unit.outcomes', [])
        )
      });
    }
  }

  setActiveUnit(unit) {
    const { getAssessmentMemberUnitAttempt, member } = this.props;
    if (unit && unit.unit_id) {
      this.setState({ activeUnitId: unit.unit_id });
      getAssessmentMemberUnitAttempt(
        member.member_id,
        path(['current_qualification', 'qualification_id'], member),
        unit.unit_id
      );
    }
  }

  onClickEvidence(evidence, hasMedia) {
    this.setState({ activeEvidence: evidence });
    if (!hasMedia) {
      // setTimeout(()=>{
      //   this.assessmentActivityModal.open();
      // });
    } else {
      setTimeout(() => {
        this.evidenceDetailModal.open();
      });
    }
  }

  renderUnits() {
    const { units, activeUnit, activeUnitId } = this.state;
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1
    };

    return (
      <div className="chart-slider">
        <Slider {...settings}>
          {lodash.map(
            units,
            (unit, i) =>
              unit && (
                <div
                  key={`unit-item-${i}`}
                  onClick={() => {
                    this.setActiveUnit(unit);
                  }}
                >
                  <UnitProgressCard
                    isActive={unit.unit_id == activeUnitId}
                    {...{ unit }}
                  />
                </div>
              )
          )}
        </Slider>
      </div>
    );
  }

  renderUnitProgress() {
    const { assessmentMemberUnit } = this.props;
    const { activeUnit, activeOutcome } = this.state;
    const outcomes = lodash.get(assessmentMemberUnit, 'unit.outcomes', []);
    const elements = lodash.get(activeOutcome, 'elements', []);
    const evidences = lodash.get(activeOutcome, 'evidences', []);
    const stars = lodash.range(
      0,
      lodash.get(activeOutcome, 'unit.quality_score', 0)
    );

    const imageDimesnions = {
      width: 120,
      height: 120
    };

    return (
      <div className="unit-progress">
        <div className="p-t-30 p-b-15 unit-title">
          Unit Progress - {lodash.get(activeUnit, 'unit.unit_reference')}&nbsp;
          {lodash.get(activeUnit, 'unit.title')}
        </div>

        <div className="columns">
          <div className="column is-4 is-paddingless outcome-progresses">
            {outcomes.map((outcome, i) => {
              return (
                <div
                  key={`outcome${i}`}
                  className={classNames('outcome-progress', {
                    active: outcome == activeOutcome
                  })}
                  onClick={() => this.setState({ activeOutcome: outcome })}
                >
                  <div className="outcome-title m-b-10">Outcome {i + 1}</div>
                  <div className="is-flex" style={{ alignItems: 'center' }}>
                    <UIProgressBar
                      progress={lodash.get(outcome, 'assessment_progress', 0)}
                    />
                    <div className="m-l-10">
                      {lodash.get(outcome, 'assessment_progress', 0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="column is-8 outcome-details">
            <div
              className="is-flex p-b-15 border-bottom"
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  display: 'flex',
                  position: 'absolute',
                  justifyContent: 'space-between',
                  minWidth: '120px',
                  right: '0',
                  bottom: '0'
                }}
              >
                <div className="tooltip">
                  <Isvg className="small" src={IconRun} />
                  <span className="tooltiptext">Activity</span>
                </div>
                <div className="tooltip">
                  <Isvg className="small" src={IconBinoculars} />
                  <span className="tooltiptext">Knowledge</span>
                </div>
                <div className="tooltip">
                  <i className="fa fa-eye" />
                  <span className="tooltiptext">Observation</span>
                </div>
                <div className="tooltip">
                  <Isvg className="small" src={IconQuote} />
                  <span className="tooltiptext">Discussion</span>
                </div>
              </div>
              <div className="outcome-title">
                {lodash.get(activeOutcome, 'title', '')}
              </div>
              <div
                className="is-flex p-l-10 p-r-10"
                style={{
                  minWidth: '110px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'orange'
                }}
              >
                {lodash.map(stars, (star, i) => {
                  return <i key={i} className="fa fa-star" />;
                })}
              </div>
            </div>

            <div className="">
              {elements.map((element, j) => {
                return (
                  <div
                    key={`element${j}`}
                    className="criteria-item p-t-15 p-b-15 border-bottom"
                  >
                    <div className="criteria-number">
                      {lodash.get(activeOutcome, 'number')}.
                      {lodash.get(element, 'number')}
                    </div>
                    <div className="criteria-title">
                      {lodash.get(element, 'title', '')}
                    </div>
                    <div className="criteria-checkboxes">
                      <label className="custom checkbox m-l-0 m-r-0">
                        <input
                          type="checkbox"
                          checked={
                            lodash.get(element, 'require_activity') &&
                            lodash.get(element, 'activity_completed')
                          }
                          onChange={() => {}}
                        />
                        <span className="ui m-r-0" />
                      </label>
                      <label className="custom checkbox m-l-0 m-r-0">
                        <input
                          type="checkbox"
                          checked={
                            lodash.get(element, 'require_knowledge') &&
                            lodash.get(element, 'knowledge_completed')
                          }
                          onChange={() => {}}
                        />
                        <span className="ui m-r-0" />
                      </label>
                      <label className="custom checkbox m-l-0 m-r-0">
                        <input
                          type="checkbox"
                          checked={
                            lodash.get(element, 'require_observation') &&
                            lodash.get(element, 'observation_completed')
                          }
                          onChange={() => {}}
                        />
                        <span className="ui m-r-0" />
                      </label>
                      <label className="custom checkbox m-l-0 m-r-0">
                        <input
                          type="checkbox"
                          checked={
                            lodash.get(element, 'require_discussion') &&
                            lodash.get(element, 'discussion_completed')
                          }
                          onChange={() => {}}
                        />
                        <span className="ui m-r-0" />
                      </label>
                    </div>
                  </div>
                );
              })}
              <div />
            </div>

            <div>
              <div className="outcome-title p-t-15 p-b-15">Evidence</div>
              <div className="is-flex">
                {evidences.map((evidence, k) => {
                  const hasMedia =
                    evidence.cloudinary_file_id &&
                    evidence.cloudinary_file_type;

                  return (
                    <div
                      key={`evidence${k}`}
                      className="evidence-image"
                      style={{
                        backgroundImage: !hasMedia
                          ? `url(${IconWorkbookActvity})`
                          : null
                      }}
                      onClick={() => this.onClickEvidence(evidence, hasMedia)}
                    >
                      {hasMedia && (
                        <CloudinaryMedia
                          style={{ ...imageDimesnions }}
                          mediaType={evidence.cloudinary_file_type}
                          fileId={evidence.cloudinary_file_id}
                          transformations={{
                            width: imageDimesnions.width,
                            height: imageDimesnions.height,
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
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      params,
      users,
      lang,
      assessmentMemberQualification,
      member,
      attemptingGetAssessmentMemberQualification,
      attemptingGetAssessmentMemberUnit
    } = this.props;

    const { activeUnitTab, activeEvidence } = this.state;

    return (
      <div className="qualification-progress-route min-content-height">
        <HeaderView
          member={member}
          qualification={lodash.get(
            assessmentMemberQualification,
            'member_qualification'
          )}
        />
        {(attemptingGetAssessmentMemberQualification ||
          attemptingGetAssessmentMemberUnit) && (
          <UILoading isLoadingOverlay alignMiddle />
        )}

        {/* Nav */}
        <UIExplorerNav>
          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                active={activeUnitTab}
                tabs={navTabs}
                change={e => this.setState({ activeUnitTab: e })}
                translate={false}
              />
            </div>
          </section>
        </UIExplorerNav>

        <section className="content-section p-t-30 p-b-30">
          <div
            className="container"
            style={{ maxWidth: '1140px', margin: 'auto' }}
          >
            {this.renderUnits()}
          </div>
        </section>

        <section
          className="content-section p-t-15 p-b-30"
          style={{ background: 'white' }}
        >
          <div
            className="container"
            style={{ maxWidth: '1140px', margin: 'auto' }}
          >
            <div className="border-bottom">
              <UINavigation
                active={`unit-progress`}
                tabs={unitTabs}
                showSearch={false}
                translate={false}
              />
            </div>
            {this.renderUnitProgress()}
          </div>
        </section>

        <ContentModalNew
          size="larger"
          className="assessment-activity-modal"
          ref={e => {
            this.assessmentActivityModal = e;
          }}
        >
          <AssessmentActivityModal evidence={activeEvidence} />
        </ContentModalNew>

        <ContentModalNew
          size="larger"
          className="assessment-activity-modal"
          ref={e => {
            this.evidenceDetailModal = e;
          }}
        >
          <EvidenceDetailsModal
            evidence={activeEvidence}
            memberId={params.memberId}
            qualificationId={params.qualificationId}
          />
        </ContentModalNew>

        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ({ persisted, profile, assessment, community }) => {
  return {
    user: lodash.get(profile, 'user'),
    lang: lodash.get(persisted, 'lang'),
    users: lodash.get(community, 'users'),
    member: lodash.get(assessment, 'assessmentMember'),
    assessmentMemberQualification: lodash.get(
      assessment,
      'assessmentMemberQualification'
    ),
    assessmentMemberUnit: lodash.get(assessment, 'assessmentMemberUnit'),

    attemptingGetAssessmentMemberQualification: lodash.get(
      assessment,
      'attemptingGetAssessmentMemberQualification'
    ),
    attemptingGetAssessmentMemberUnit: lodash.get(
      assessment,
      'attemptingGetAssessmentMemberUnit'
    ),
    errorCode: lodash.get(assessment, 'errorCode')
  };
};

const mapDispatchToProps = dispatch => ({
  getAssessmentMemberQualificationAttempt: (member_id, qualification_id) =>
    dispatch(
      AssessmentActions.getAssessmentMemberQualificationAttempt(
        member_id,
        qualification_id,
        null
      )
    ),
  getAssessmentMemberUnitAttempt: (member_id, qualification_id, unit_id) =>
    dispatch(
      AssessmentActions.getAssessmentMemberUnitAttempt(
        member_id,
        qualification_id,
        unit_id
      )
    )
});

export default connect(mapStateToProps, mapDispatchToProps)(UnitProgressRoute);
