import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex } from 'ramda';
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

import QualificationOutcomeElement from './qualification-outcome-element';

import Isvg from 'react-inlinesvg';
import IconRemove from 'images/icon_remove.svg';

class QualificationOutcomeElementList extends Component {
  constructor() {
    super();
    this.state = {};
  }

  UNSAFE_componentWillMount() {}

  render() {
    const { outcome, outcomeIndex } = this.props;

    return (
      <div>
        {outcome &&
          outcome.assessment_criteria &&
          outcome.assessment_criteria.map((item, i) => (
            <div
              key={i}
              className="qualifications qualification-panel p-b-10"
              style={{ width: 'auto', backgroundColor: 'white' }}
            >
              <QualificationOutcomeElement
                outcome={outcome}
                outcomeIndex={outcomeIndex}
                criteria={item}
                criteriaIndex={i}
              />
            </div>
          ))}
      </div>
    );
  }
}

QualificationOutcomeElementList.defaultProps = {
  outcome: null
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationOutcomeElementList);
