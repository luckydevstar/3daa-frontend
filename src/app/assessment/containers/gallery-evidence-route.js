import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { path, map } from 'ramda';

import { Creators as Actions } from '../actions';
import { HeaderView, GalleryEvidence } from '../components';
import { _t } from 'app/intl';
import navTabs from '../config/navs';
import common from 'app/common';

const {
  components: { UIExplorerNav, UINavigation, Footer }
} = common;

function GalleryEvidenceRouteNew({
  member,
  lang,
  evidences = [],
  units,
  user,
  allCriterias,
  assessmentActivities,
  assessmentEvidenceDetails,
  getAssessmentMemberEvidences,
  getAssessmentMemberEvidenceDetails,
  getAssessmentAllCriterias,
  postAssessmentEvidence,
  postAssessmentUpdateEvidence,
  deleteAssessmentEvidenceAttempt,
  attemptingPostUpdateAssessmentEvidence,
  attemptingPostAssessmentEvidence,
  attemptingGetAssessmentMemberEvidences,
  attemptingDeleteAssessmentEvidence,
  attemptingPostAssessmentEvidenceComment,
  postAssessmentEvidenceComment,
  getWorkbookActivities
}) {
  const convertActivityToEvidence = activity => {
    return {
      learning_progress_evidence_id: activity.activity_id,
      title: activity.title,
      description: activity.description,
      isActivity: true
    };
  };

  const activitiesConverted = assessmentActivities.map(
    convertActivityToEvidence
  );

  useEffect(() => {
    getAssessmentAllCriterias(1538, 77);
    if (!member) return;
    const qualification_id = path(
      ['current_qualification', 'qualification_id'],
      member
    );
    const member_id = path(['member_id'], member);
    getAssessmentMemberEvidences(member_id, qualification_id, {});
    getAssessmentAllCriterias(member_id, qualification_id);
  }, []);

  return (
    <div>
      <HeaderView
        {...{
          member,
          qualification: path(['current_qualification'])(member),
          showDownloadCV: false,
          bgColor: '#182170'
        }}
      />

      <UIExplorerNav>
        <section className="content-section navigation-section">
          <div className="container">
            <UINavigation
              active={`gallery-evidence`}
              tabs={navTabs}
              onSearch={() => {}}
              searchPlaceholder={_t('filter_evidences', lang)}
              translate={false}
            />
          </div>
        </section>
      </UIExplorerNav>
      <div className="content-section">
        <div className="container">
          <GalleryEvidence
            {...{
              evidences: [...activitiesConverted, ...evidences],
              member,
              units,
              user,
              allCriterias,
              assessmentActivities,
              assessmentEvidenceDetails,
              getAssessmentMemberEvidenceDetails,
              postAssessmentEvidence,
              postAssessmentUpdateEvidence,
              deleteAssessmentEvidenceAttempt,
              attemptingPostUpdateAssessmentEvidence,
              attemptingPostAssessmentEvidence,
              attemptingGetAssessmentMemberEvidences,
              attemptingDeleteAssessmentEvidence,
              attemptingPostAssessmentEvidenceComment,
              postAssessmentEvidenceComment,
              getWorkbookActivities
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

const mapStateToProps = state => ({
  member: path(['assessment', 'assessmentMember'], state),
  user: path(['profile', 'user'], state),
  lang: path(['persisted', 'lang'], state),
  evidences: path(
    ['assessment', 'assessmentMemberEvidences', 'evidences'],
    state
  ),
  units: path(
    ['assessment', 'assessmentMemberEvidences', 'evidences_by_units'],
    state
  ),
  assessmentActivities: path(['assessment', 'assessmentActivities'], state),
  allCriterias: path(['assessment', 'assessmentCriterias'], state),
  assessmentEvidenceDetails: path(
    ['assessment', 'assessmentEvidenceDetails'],
    state
  ),
  attemptingPostUpdateAssessmentEvidence: path(
    ['assessment', 'attemptingPostUpdateAssessmentEvidence'],
    state
  ),
  attemptingPostAssessmentEvidence: path(
    ['assessment', 'attemptingPostAssessmentEvidence'],
    state
  ),
  attemptingGetAssessmentMemberEvidences: path(
    ['assessment', 'attemptingGetAssessmentMemberEvidences'],
    state
  ),
  attemptingDeleteAssessmentEvidence: path(
    ['assessment', 'attemptingDeleteAssessmentEvidence'],
    state
  ),
  attemptingPostAssessmentEvidenceComment: path(
    ['assessment', 'attemptingPostAssessmentEvidenceComment'],
    state
  ),
  state
});

const mapDispatchToProps = dispatch => ({
  getAssessmentMemberEvidences: (member_id, qualification_id, params) =>
    dispatch(
      Actions.getAssessmentMemberEvidencesAttempt(
        member_id,
        qualification_id,
        params
      )
    ),
  getAssessmentMemberEvidenceDetails: (
    member_id,
    qualification_id,
    evidence_id
  ) =>
    dispatch(
      Actions.getAssessmentMemberEvidenceDetailsAttempt(
        member_id,
        qualification_id,
        evidence_id
      )
    ),
  postAssessmentUpdateEvidence: (
    member_id,
    qualification_id,
    evidence_id,
    params
  ) =>
    dispatch(
      Actions.postAssessmentUpdateEvidenceAttempt(
        member_id,
        qualification_id,
        evidence_id,
        params
      )
    ),
  getAssessmentAllCriterias: (member_id, qualification_id) =>
    dispatch(
      Actions.getAssessmentAllCriteriasAttempt(member_id, qualification_id)
    ),
  postAssessmentEvidence: (
    member_id,
    qualification_id,
    onUploadProgress,
    params
  ) =>
    dispatch(
      Actions.postAssessmentEvidenceAttempt(
        member_id,
        qualification_id,
        onUploadProgress,
        params
      )
    ),
  deleteAssessmentEvidenceAttempt: (member_id, qualification_id, evidence_id) =>
    dispatch(
      Actions.deleteAssessmentEvidenceAttempt(
        member_id,
        qualification_id,
        evidence_id
      )
    ),
  postAssessmentEvidenceComment: (
    member_id,
    qualification_id,
    evidence_id,
    params
  ) =>
    dispatch(
      Actions.postAssessmentEvidenceCommentAttempt(
        member_id,
        qualification_id,
        evidence_id,
        params
      )
    ),
  getWorkbookActivities: (
    workbooks,
    member_id,
    qualification_id,
    assessment_criteria
  ) =>
    dispatch(
      Actions.getWorkbookActivitiesAttempt(
        workbooks,
        member_id,
        qualification_id,
        assessment_criteria
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GalleryEvidenceRouteNew);
