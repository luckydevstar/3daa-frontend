import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { path } from 'ramda';

import { Field } from 'redux-form';

import common from 'app/common';

const {
  Form: { textarea }
} = common.components;
const TextareaField = textarea;
class QualificationUnitAmplification extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="qualifications">
        <div>
          <label htmlFor="unit_amplification_introduction">
            Unit amplification introduction
          </label>
          <Field
            name="unit_amplification_introduction"
            placeholder=""
            component={TextareaField}
            classForField="textarea"
          />
        </div>
        <div>
          <label htmlFor="relationship">
            Relationship betwwen amplification and assessment criteria
          </label>
          <Field
            name="amplification_and_criteria_relation"
            placeholder="Add Text"
            component={TextareaField}
            classForField="textarea"
          />
        </div>
        <div>
          <label htmlFor="amplification_structure">
            Amplification Structure
          </label>
          <Field
            name="amplification_structure"
            placeholder="Add Text"
            component={TextareaField}
            classForField="textarea"
          />
        </div>
        <div>
          <label htmlFor="legislation">Legislation</label>
          <Field
            name="legislation"
            placeholder="Add Text"
            component={TextareaField}
            classForField="textarea"
          />
        </div>
      </div>
    );
  }
}

export default QualificationUnitAmplification;
