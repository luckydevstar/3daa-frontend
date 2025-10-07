import React from 'react';
import { connect } from 'react-redux';
import { getFormValues, reduxForm } from 'redux-form';
import {
  always,
  cond,
  pathEq,
  join,
  length,
  pathOr,
  propOr,
  defaultTo,
  pipe,
  gt,
  __,
  contains,
  identity,
  T,
  path
} from 'ramda';
import { Creators } from 'app/workbooks/actions';
import common from 'app/common';
import { noop } from 'app/common/util/helpers';
import { Roles } from 'app/core/config/constants';
import FreeTextActivity from './free-text-activity';
import MultipleFreeTextActivity from './multiple-free-text-activity';
import DragAndDropOrderActivity from './drag-and-drop-order-activity';
import DragAndDropAreaActivity from './drag-and-drop-area-activity';
import EvidenceUploadActivity from './evidence-upload-activity';
import MultipleChoiceActivity from './multiple-choice-activity';
import FormActions from './form-actions';

const {
  util: {
    helpers: { extractUserRole }
  },
  components: { UILoading }
} = common;

const { CentreAdmin, CentreTutor } = Roles;

const REDUX_FORM_NAME = 'activity-modal';

const activityEq = pathEq(['activity', 'activity_type_id']);

const isFormReadOnly = ({ solution }) => {
  const iSubmitted = propOr(false, 'submitted', solution);
  if (iSubmitted) return true;
  return false;
};

const renderActivity = cond([
  [activityEq(1), args => <FreeTextActivity {...args} />],
  [activityEq(2), args => <MultipleFreeTextActivity {...args} />],
  [activityEq(3), args => <DragAndDropOrderActivity {...args} />],
  [activityEq(4), args => <DragAndDropAreaActivity {...args} />],
  [activityEq(5), args => <MultipleChoiceActivity {...args} />],
  [activityEq(7), args => <EvidenceUploadActivity {...args} />],
  [activityEq(1), always(null)]
]);

const WorkbookActivityForm = ({
  activity_id,
  handleSubmit,
  onSubmitActivity,
  onTutorDecision,
  user,
  workbook,
  learnerID,
  ...args
}) => {
  const role = extractUserRole(user);
  const readOnly = isFormReadOnly(args);
  const canApprove = contains(role, [CentreAdmin, CentreTutor]);
  const onSubmit = cond([
    [
      x => identity(x) && canApprove,
      always(() => onTutorDecision(learnerID, activity_id, true))
    ],
    [identity, always(noop)],
    [
      T,
      always(x =>
        onSubmitActivity(user.member_id, workbook.workbook_id, activity_id, x)
      )
    ]
  ])(readOnly);
  return (
    <form>
      <div className="container">
        {renderActivity({
          activity_id,
          onSubmitActivity,
          readOnly,
          user,
          ...args
        })}
      </div>
      <FormActions
        {...{
          activity_id,
          handleSubmit,
          onSubmit,
          readOnly,
          user,
          onTutorDecision,
          learnerID,
          workbook,
          ...args
        }}
      />
    </form>
  );
};

const WorkbookActivityModalConnected = reduxForm({
  form: REDUX_FORM_NAME,
  enableReinitialize: true
})(WorkbookActivityForm);

class WorkbookActivityModal extends React.Component {
  render() {
    const {
      activity,
      workbook,
      onTutorDecision,
      onSubmitActivity,
      activityLoading,
      onSaveActivity,
      formValues,
      cloudinaryProgress,
      solution,
      approved,
      attempts,
      initialValues,
      learnerID,
      user,
      onClose
    } = this.props;

    if (!activity) return <UILoading customClass="m-t-50 m-b-50" />;
    const subtitle = [];

    const { activity_id, activity_code, covers_criteria, title } = activity;

    if (activity_code) subtitle.push(`Activity ${activity_code}`);

    if (pipe(defaultTo([]), length, gt(__, 0))(covers_criteria))
      subtitle.push(`Covering outcome criteria ${join(', ', covers_criteria)}`);

    return (
      <div className="workbook-activity-modal">
        <div className="workbook-activity-modal-header">
          <h1>{title}</h1>
          {length(subtitle) > 0 && <h2>{join(' - ', subtitle)}</h2>}
        </div>
        <WorkbookActivityModalConnected
          {...{
            onSaveActivity: onSaveActivity(formValues),
            cloudinaryProgress,
            onSubmitActivity,
            activityLoading,
            initialValues,
            activity_id,
            onTutorDecision,
            formValues,
            activity,
            workbook,
            solution,
            approved,
            attempts,
            user,
            learnerID,
            onClose
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const solutionContent = JSON.parse(
    pathOr(
      JSON.stringify({}),
      ['workbooks', 'solution', 'evidence', 'content'],
      state
    )
  );
  const solution = path(['workbooks', 'solution'], state);
  const attempt = state.workbooks.attempts[0];

  let initialValues = {};
  if (attempt) {
    initialValues = JSON.parse(attempt.evidence.content);
  } else if (solution.submitted) {
    initialValues = solutionContent;
  }

  return {
    // activity: state.workbooks.activity,
    activityLoading: state.workbooks.activityLoading,
    formValues: getFormValues(REDUX_FORM_NAME)(state),
    cloudinaryProgress: state.ui.cloudinaryProgress,
    initialValues,
    user: state.profile.user,
    workbook: path(['workbooks', 'workbook'], state),
    learnerID: path(['workbooks', 'activeLearnerId'], state),
    solution,
    approved: state.workbooks.approved,
    attempts: state.workbooks.attempts
  };
};

const mapDispatchToProps = dispatch => ({
  onSaveActivity: evidence => (member_id, workbook_id, activity_id) =>
    dispatch(
      Creators.submitWorkbookActivityAttempt(
        member_id,
        workbook_id,
        activity_id,
        evidence,
        true
      )
    ),
  onSubmitActivity: (member_id, workbook_id, activity_id, evidence) =>
    dispatch(
      Creators.submitWorkbookActivityAttempt(
        member_id,
        workbook_id,
        activity_id,
        evidence
      )
    ),
  onTutorDecision: (learnerID, activity_id, accept) =>
    dispatch(Creators.submitWorkbookDecision(learnerID, activity_id, accept))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkbookActivityModal);
