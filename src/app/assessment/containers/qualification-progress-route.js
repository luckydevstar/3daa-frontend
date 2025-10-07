import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import * as lodash from 'lodash';
import classNames from 'classnames';
import Collapsible from 'react-collapsible';
import Slider from 'react-slick';
import Isvg from 'react-inlinesvg';
import {
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import config from 'brand/config';
import common from 'app/common';
import { Roles } from 'app/core/config/constants';
import { Creators as AssessmentActions } from '../actions';
import { Text, Option, _t, _tf, _tLevel } from 'app/intl';

import { HeaderView } from '../components';

import navTabs from '../config/navs';
import IconListHeader from 'images/icon-list-header.svg';

const {
  components: {
    EmptyView,
    Footer,
    ContentModalNew,
    ConvertDraftObjectToHtml,
    ProgressBadge,
    UIExplorerNav,
    UINavigation,
    UILoading,
    UIProgressCircle
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

const LEVELS = [
  'Level One',
  'Level Two',
  'Level Three',
  'Level Four',
  'Level Five'
];

class QualificationProgressRoute extends React.Component {
  constructor(props) {
    super(props);

    this.renderProgresses = this.renderProgresses.bind(this);
    this.renderGuidance = this.renderGuidance.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      getHoursMemberActivityQualificationAttempt,
      getAssessmentGuidanceAttempt,
      getAssessmentMemberQualificationAttempt,
      member
    } = this.props;

    const member_id = lodash.get(member, 'member_id');
    const qualification = lodash.get(member, 'current_qualification');
    const qualification_id = lodash.get(qualification, 'qualification_id');

    if (!member || qualification_id == 0) {
      browserHistory.replace('/assessment/assessment-progress');
      return;
    }

    // if (centres.length > 0) {
    //   const centre_id = lodash.get(centres[0], 'centre_id');
    //   getElearningHoursAttempt(centre_id, null);
    // }
    getHoursMemberActivityQualificationAttempt(member_id, qualification_id);
    getAssessmentGuidanceAttempt();
  }

  componentWillUnmount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {}

  onClickBookItem(e, workbook) {
    this.setState({ workbook }, () => {
      this.unitOverviewModal.open();
    });
  }

  renderProgresses() {
    const { qualificationLearningHours } = this.props;

    const e_learning_hours = lodash.get(
      qualificationLearningHours,
      'e_learning_hours',
      0
    );
    const possible_hours = lodash.get(
      qualificationLearningHours,
      'possible_hours',
      0
    );
    const total_hours = lodash.get(
      qualificationLearningHours,
      'total_hours',
      0
    );
    const on_site_assessment = lodash.get(
      qualificationLearningHours,
      'on_site_assessment',
      0
    );

    const progress_percentage = lodash.get(
      qualificationLearningHours,
      'qualification.progress_percentage',
      0
    );
    const level = lodash.get(
      qualificationLearningHours,
      'qualification.level',
      1
    );

    return (
      <div className="progresses">
        <div
          className="progress-item"
          style={{ width: '150px', height: '150px' }}
        >
          <div className="progress-item-title has-text-centered">
            {lodash.get(qualificationLearningHours, 'qualification.sector', '')}
          </div>
          <div className="progress-item-content">
            <UIProgressCircle
              percentage={progress_percentage}
              strokeWidth={8}
              diameter={160}
              blurSize={0}
            />
            <div className="learning-info primary">
              <p className="percent">
                <b>{Math.round(progress_percentage)}</b>%
              </p>
              <div className="divider" />
              <p className="level">{LEVELS[level]}</p>
            </div>
          </div>
        </div>
        <div className="progress-item">
          <div className="progress-item-title has-text-centered">
            E-LEARNING HOURS
          </div>
          <div className="progress-item-content">
            <UIProgressCircle
              percentage={
                !possible_hours ? 0 : (e_learning_hours / possible_hours) * 100
              }
              strokeWidth={8}
              diameter={120}
              blurSize={0}
              innerPaddingScale={0}
            />
            <div className="learning-info third">
              <p className="hour p-t-4 p-b-2">
                <b>{e_learning_hours}</b>HRS
              </p>
              <p>
                View
                <br />
                Activity
              </p>
            </div>
          </div>
        </div>
        {/*
          <div className="progress-sign">+</div>
          <div className="progress-item">
            <div className="progress-item-title has-text-centered">
              ON-SITE ASSESSMENT
            </div>
            <div className="progress-item-content">
              <UIProgressCircle
                percentage={
                  !possible_hours
                    ? 0
                    : (on_site_assessment / possible_hours) * 100
                }
                strokeWidth={8}
                diameter={120}
                blurSize={0}
                innerPaddingScale={0}
              />
              <div className="learning-info secondary">
                <p className="hour">{on_site_assessment}hrs</p>
              </div>
            </div>
          </div>
          <div className="progress-sign">=</div>
          */}
        <div className="progress-item">
          <div className="progress-item-title has-text-centered">
            TOTAL HOURS
          </div>
          <div className="progress-item-content">
            <UIProgressCircle
              percentage={
                !possible_hours ? 0 : (total_hours / possible_hours) * 100
              }
              strokeWidth={8}
              diameter={120}
              blurSize={0}
              innerPaddingScale={0}
            />
            <div className="learning-info secondary">
              <p className="hour p-t-3">
                <b>{total_hours}</b>HRS
              </p>
              <p className="desc">of a possible</p>
              <p className="semi-hour">{possible_hours}HRS</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderGuidance() {
    const { assessmentGuidance } = this.props;
    const titles = lodash.keys(assessmentGuidance);
    return (
      <div className="guidance">
        <div className="subtitle is-flex">
          <span className="m-r-15">
            <Isvg className="small" src={IconListHeader} />
          </span>
          <span>Guidance on assessing students</span>
        </div>
        {titles.map((title, i) => {
          return (
            <Collapsible
              trigger={title}
              key={i}
              classParentString="is-rounded is-border-bottom Collapsible"
            >
              <div
                dangerouslySetInnerHTML={{ __html: assessmentGuidance[title] }}
              />
            </Collapsible>
          );
        })}
      </div>
    );
  }

  renderCharts() {
    const { qualificationLearningHours } = this.props;

    const hours_by_activity = lodash.get(
      qualificationLearningHours,
      'hours_by_activity',
      []
    );

    const charts = ['TOTAL HOURS BREAKDOWN'];

    // 'E-LEARNING HOURS BREAKDOWN',
    // 'ON-SITE ASSESSMENT BREAKDOWN',

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    return (
      <div className="chart-slider">
        <Slider {...settings}>
          {lodash.map(charts, (chart, i) => (
            <div key={`chart-item-${i}`}>
              <h3 className="p-l-30">{chart}</h3>
              <ResponsiveContainer>
                <AreaChart
                  data={hours_by_activity}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="title" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total_time_spent"
                    stroke={config.primaryColor}
                    strokeWidth={3}
                    fill={config.primaryColor}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </Slider>
      </div>
    );
  }

  render() {
    const {
      setSearchQuery,
      lang,
      params,
      user,
      attemptingElearningHours,
      attemptingGetAssessmentGuidance,
      qualificationLearningHours,
      errorCode,
      member
    } = this.props;

    const qualification = lodash.get(
      qualificationLearningHours,
      'qualification'
    );

    const tempNavTabs = navTabs;

    return (
      <div className="qualification-progress-route min-content-height">
        <HeaderView
          member={member}
          qualification={qualification}
          showDownloadCV={false}
        />

        {attemptingElearningHours || attemptingGetAssessmentGuidance ? (
          <UILoading isLoadingOverlay alignMiddle />
        ) : (
          <div>
            {/* Nav */}
            <UIExplorerNav>
              <section className="content-section navigation-section">
                <div className="container">
                  <UINavigation
                    active={`qualification-progress`}
                    tabs={tempNavTabs}
                    showSearch={false}
                    translate={false}
                  />
                </div>
              </section>
            </UIExplorerNav>

            <section className="content-section p-t-30 p-b-30">
              <div className="container">{this.renderProgresses()}</div>
            </section>

            <section className="content-section">
              <div
                className="container p-b-30"
                style={{ maxWidth: '1140px', margin: 'auto' }}
              >
                {this.renderCharts()}
              </div>
            </section>

            <section
              className="content-section p-t-30 p-b-30"
              style={{ background: 'white' }}
            >
              <div
                className="container p-t-30 p-b-30"
                style={{ maxWidth: '1140px', margin: 'auto' }}
              >
                {this.renderGuidance()}
              </div>
            </section>
            <Footer />
          </div>
        )}
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
    eLearningHours: lodash.get(assessment, 'eLearningHours'),
    qualificationLearningHours: lodash.get(
      assessment,
      'qualificationLearningHours'
    ),
    assessmentGuidance: lodash.get(assessment, 'assessmentGuidance'),
    attemptingElearningHours: lodash.get(
      assessment,
      'attemptingElearningHours'
    ),
    attemptingGetAssessmentGuidance: lodash.get(
      assessment,
      'attemptingGetAssessmentGuidance'
    ),
    errorCode: lodash.get(assessment, 'errorCode')
  };
};

const mapDispatchToProps = dispatch => ({
  getElearningHoursAttempt: (centre_id, parmas) =>
    dispatch(AssessmentActions.getElearningHoursAttempt(centre_id, parmas)),
  getHoursMemberActivityAttempt: member_id =>
    dispatch(AssessmentActions.getHoursMemberActivityAttempt(member_id)),
  getAssessmentGuidanceAttempt: parmas =>
    dispatch(AssessmentActions.getAssessmentGuidanceAttempt(parmas)),

  getHoursMemberActivityQualificationAttempt: (member_id, qualification_id) =>
    dispatch(
      AssessmentActions.getHoursMemberActivityQualificationAttempt(
        member_id,
        qualification_id
      )
    ),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationProgressRoute);
