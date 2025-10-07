import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { pipe, head } from 'ramda';
import common from 'app/common';
import ActivityTout from './activity-tout';
import { required } from 'app/common/util/form-utils';

const {
  components: {
    Form: { textarea }
  }
} = common;

const FreeTextActivity = ({
  activity: { content, tout, tout_type, subtitle },
  readOnly
}) => (
  <div className="workbook-activity-modal-body">
    <div className="columns">
      <div className="column is-half">
        <div className="workbook-activity-modal-tout">
          <ActivityTout {...{ tout, toutType: tout_type }} />
        </div>
      </div>
      <div className="column is-half">
        <h4>Activity</h4>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
    <div className="free-text-activity">
      {pipe(JSON.parse, ({ activityText, promptTitles }) => (
        <div key={0} className="text-activity-slide">
          <strong className="workbook-activity-modal-label">
            {activityText}
          </strong>
          <Field
            name="input0"
            component={textarea}
            fieldClassName="workbook-activity-modal-textarea"
            placeholder={head(promptTitles)}
            disabled={readOnly}
            validate={[required]}
            defaultValue="asd"
          />
        </div>
      ))(content)}
    </div>
  </div>
);

FreeTextActivity.propTypes = {
  activity: PropTypes.object.isRequired
};

export default FreeTextActivity;
