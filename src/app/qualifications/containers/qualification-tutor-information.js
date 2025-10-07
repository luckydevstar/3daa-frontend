import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Field } from 'redux-form';
import classNames from 'classnames';
import common from 'app/common';

const {
  Form: { textarea }
} = common.components;
const TextareaField = textarea;
class QualificationTutorInformation extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="qualifications">
        <div>
          <label htmlFor="tutor_information">Information for Tutors</label>
          <Field
            name="tutor_information"
            placeholder=""
            component={TextareaField}
            classForField="textarea"
          />
        </div>
      </div>
    );
  }
}

export default QualificationTutorInformation;
