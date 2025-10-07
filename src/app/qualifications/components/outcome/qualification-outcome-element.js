import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, path, clone } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';
import Collapsible from 'react-collapsible';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';

import Isvg from 'react-inlinesvg';
import IconRemove from 'images/icon_remove.svg';

class QualificationOutcomeElement extends Component {
  constructor() {
    super();
    this.onAddToTest = this.onAddToTest.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  UNSAFE_componentWillMount() {}

  onAddToTest() {
    // const {changeFieldValue, outcomes, outcome, criteria, outcomeIndex, criteriaIndex}=this.props;
    // let newOutcomes = [].concat(outcomes);
    // let newOutcome = clone(outcome);
    // criteria.in_test = criteria.in_test ? 0 : 1;
    // newOutcome.assessment_criteria.splice(criteriaIndex, 1, criteria);
    // newOutcomes.splice(outcomeIndex, 1, newOutcome);
    // changeFieldValue('learningUnitEdit', 'outcomes', newOutcomes);
  }

  onDelete() {
    const {
      changeFieldValue,
      outcomes,
      outcome,
      criteria,
      outcomeIndex,
      criteriaIndex
    } = this.props;
    let newOutcomes = [].concat(outcomes);
    let newOutcome = clone(outcome);
    newOutcome.assessment_criteria.splice(criteriaIndex, 1);
    newOutcomes.splice(outcomeIndex, 1, newOutcome);
    changeFieldValue('learningUnitEdit', 'outcomes', newOutcomes);
  }

  render() {
    const { criteria, outcomeIndex, criteriaIndex } = this.props;
    const { onAddToTest, onDelete } = this;

    return (
      <div className="columns space-between qualifications background-white is-centered">
        <div className="column">
          <h5>
            {criteriaIndex + 1}: {criteria.title}
          </h5>
        </div>
        <div className="column no-grow">
          <div className="columns">
            <div className="column p-r-0" style={{ whiteSpace: 'nowrap' }}>
              <span>Add to Test &nbsp;</span>
            </div>
            <div className="column">
              <label className="custom radio">
                <input
                  type="checkbox"
                  checked={criteria.in_test}
                  onChange={() => onAddToTest()}
                />
                <span className="ui" />
              </label>
            </div>
          </div>
        </div>
        <div className="column no-grow">
          <div className="columns">
            <div className="column p-r-0" style={{ whiteSpace: 'nowrap' }}>
              <span>Delete</span>
            </div>
            <div className="column">
              <a onClick={() => onDelete()}>
                <Isvg src={IconRemove} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

QualificationOutcomeElement.defaultProps = {};

const mapStateToProps = state => ({
  outcomes: path(['form', 'learningUnitEdit', 'values', 'outcomes'])(state)
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationOutcomeElement);
