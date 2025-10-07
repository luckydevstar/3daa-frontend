import React from 'react';
import cx from 'classnames';
import { path } from 'ramda';

import common from 'app/common';
import { Roles } from 'app/core/config/constants';

const {
  util: {
    helpers: { extractUserRole }
  }
} = common;

const { CentreLearner, CentreEQA, CentreIQA } = Roles;

const FormActions = ({
  activity_id,
  activityLoading,
  handleSubmit,
  onSaveActivity,
  onSubmit,
  onTutorDecision,
  readOnly,
  valid,
  solution,
  dirty,
  user,
  learnerID,
  onClose,
  formValues,
  activity,
  workbook
}) => {
  const input0 = path(['input0'], formValues);
  // const isApproveDisabled =
  //   activity.activity_type_id === 5 && input0 !== 'answer';
  // const isRejectDisabled =
  //   activity.activity_type_id === 5 && input0 === 'answer';

  return extractUserRole(user) === CentreLearner ? (
    <div className="workbook-activity-modal-footer workbook-activity-modal-footer--learner">
      <div className="workbook-activity-modal-footer__cancel-save">
        <button
          disabled={activityLoading}
          onClick={onClose}
          className={cx(['button', 'is-outlined'])}
        >
          Cancel
        </button>
        <button
          disabled={activityLoading || readOnly || !dirty}
          onClick={() =>
            onSaveActivity(user.member_id, workbook.workbook_id, activity_id)
          }
          className={cx(['button', 'is-info', 'is-outlined'], {
            'is-loading': activityLoading === 'save'
          })}
        >
          Save
        </button>
      </div>
      <button
        disabled={activityLoading || readOnly || !valid}
        onClick={handleSubmit(onSubmit)}
        type="submit"
        className={cx(['button', 'is-success'], {
          'is-loading': activityLoading === 'submit'
        })}
      >
        Submit
      </button>
    </div>
  ) : (
    <div className="workbook-activity-modal-footer">
      {extractUserRole(user) === CentreIQA ||
      extractUserRole(user) === CentreEQA ? (
        <div>{solution.approved && 'VERIFIED'}</div>
      ) : (
        <div>
          <button
            // disabled={activityLoading || !solution || solution.approved}
            disabled={activityLoading}
            onClick={handleSubmit(() =>
              onTutorDecision(learnerID, activity_id, false)
            )}
            className={cx(['button', 'is-danger'], {
              'is-loading': activityLoading === 'save'
            })}
          >
            Reject
          </button>
          <button
            // disabled={activityLoading || !solution || solution.approved}
            disabled={activityLoading}
            type="submit"
            onClick={handleSubmit(() =>
              onTutorDecision(learnerID, activity_id, true)
            )}
            className={cx(['button', 'is-success'], {
              'is-loading': activityLoading === 'submit'
            })}
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
};

export default FormActions;
