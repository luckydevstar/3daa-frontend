import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import cx from 'classnames';
import ActivityTout from './activity-tout';
import common from 'app/common';
import { required } from 'app/common/util/form-utils';

const Progress = common.components.Progress;
const { dropzone: FormDropzone } = common.components.Form;

const EvidenceUploadActivity = ({
  readOnly,
  activity,
  change,
  cloudinaryProgress
}) => {
  const activityText =
    (activity.content && JSON.parse(activity.content).activityText) || null;

  return (
    <div className="workbook-activity-modal-body">
      <div className="columns">
        <div className="column">
          <h4>Activity</h4>
          {activityText &&
            <p>
              {activityText}
            </p>}
        </div>
      </div>
      <div className="columns is-mobile activity-tout">
        <div className="column is-half">
          <div className="workbook-activity-modal-tout">
            <ActivityTout tout={activity.tout} toutType={activity.tout_type} />
          </div>
        </div>
        <div
          className={cx('column is-half is-centered', {
            uploading: cloudinaryProgress
          })}
        >
          {cloudinaryProgress
            ? <Progress {...{ percent: cloudinaryProgress }} />
            : null}
          <Field
            name="input0"
            className={cx('dropzone', { 'is-hidden': cloudinaryProgress })}
            mediaType="image"
            cloudinaryMediaType="image"
            component={FormDropzone}
            multiple={false}
            handleDrop={e => change('input0', e)}
            disabled={readOnly}
            validate={[required]}
          />
        </div>
      </div>
    </div>
  );
};

EvidenceUploadActivity.propTypes = {
  activity: PropTypes.object.isRequired
};

export default EvidenceUploadActivity;
