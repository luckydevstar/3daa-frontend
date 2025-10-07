import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, path } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector,
  FormSection,
  FieldArray
} from 'redux-form';
import Collapsible from 'react-collapsible';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';

import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationOutcomeElementAdd from './qualification-outcome-element-add';
import QualificationOutcomeElementList from './qualification-outcome-element-list';

import Isvg from 'react-inlinesvg';
import IconRemove from 'images/icon_remove.svg';

const FORM_NAME = 'learningUnitEdit';
const errorMesage = "Data doesn't exist";

class QualificationOutcomeList extends Component {
  constructor() {
    super();
    this.state = {
      unit: null,
      expanded: null
    };
    this.onExpand = this.onExpand.bind(this);
  }

  UNSAFE_componentWillMount() {}

  onExpand(i) {
    if (this.state.expanded == i) this.setState({ expanded: null });
    else this.setState({ expanded: i });
  }

  onDeleteOutcome(item) {
    const { changeFieldValue, outcomes } = this.props;
    let temp = outcomes || [];

    changeFieldValue(
      'learningUnitEdit',
      'outcomes',
      temp.filter(o => o != item)
    );
  }

  render() {
    const { onExpand } = this;
    const { expanded } = this.state;
    const { outcomes } = this.props;

    return (
      <div className="workbook-sector-container min-content-height">
        <div className="qualifications p-t-30">
          {outcomes &&
            outcomes.map((item, i) => (
              <div
                key={'outcome' + i}
                className="qualifications qualification-panel p-b-10"
                style={{ width: 'auto', backgroundColor: 'white' }}
              >
                <div className="columns space-between qualifications background-white is-centered">
                  <div className="column no-grow">
                    <span>
                      {expanded == i ? (
                        <i className="fa fa-angle-up fa-lg" />
                      ) : (
                        <i className="fa fa-angle-down fa-lg" />
                      )}
                    </span>
                  </div>
                  <div className="column">
                    <a onClick={() => onExpand(i)}>
                      <h5 className="has-text-black font-family-semibold">
                        Outcome {i + 1}: {item.title}
                      </h5>
                    </a>
                  </div>
                  <div className="column no-grow">
                    <a onClick={() => this.onDeleteOutcome(item)}>
                      <Isvg src={IconRemove} />
                    </a>
                  </div>
                </div>
                {expanded == i && (
                  <div>
                    <QualificationOutcomeElementAdd
                      outcome={item}
                      outcomeIndex={i}
                    />
                    <QualificationOutcomeElementList
                      outcome={item}
                      outcomeIndex={i}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  }
}

QualificationOutcomeList.defaultProps = {
  outcomes: []
};

const mapStateToProps = state => ({
  newOutcomeElementTitle: path(['form', 'learningUnitAdd', 'values', 'title']),
  unit: path(['qualifications', 'currentLearningUnit'])(state),
  outcomes: path(['form', 'learningUnitEdit', 'values', 'outcomes'])(state),

  attemptingGetLearningUnit: path([
    'qualifications',
    'attemptingGetQualificationUnit'
  ])(state)
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  },
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationOutcomeList);
