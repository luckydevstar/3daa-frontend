import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, change, initialize } from 'redux-form';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import { Creators as unitsActions } from 'app/units/actions';
import common from 'app/common';
import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationUnitAdd from '../components/unit/qualification-unit-add';
import QualificationUnitEdit from '../components/unit/qualification-unit-edit';
import QualificationUnitList from '../components/unit/qualification-unit-list';

import QualificationOutcomeAdd from '../components/outcome/qualification-outcome-add';
import QualificationOutcomeList from '../components/outcome/qualification-outcome-list';

const { UILoading } = common.components;
class QualificationUnit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewMode: 2, // 1: New Unit Edit Mode, 2: Unit List View Mode, 3: Outcome List View
      unit: null
    };
  }

  UNSAFE_componentWillMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { initializeForm } = this.props;
    const { unit } = this.state;

    if (nextProps.viewMode != this.state.viewMode) {
      this.setState({ viewMode: nextProps.viewMode });
    }

    if (nextProps.unit !== unit) {
      this.setState({ unit: nextProps.unit });
      initializeForm('learningUnitEdit', nextProps.unit);
    }
  }

  filterResults(items, phrase) {
    phrase = phrase.trim().toLowerCase();
    let result = items.filter(item => {
      if (!phrase || phrase === '') return true;
      return (
        item.title.toLowerCase().indexOf(phrase) >= 0 ||
        (item.reference &&
          ('' + item.reference).toLowerCase().indexOf(phrase) >= 0)
      );
    });
    return result;
  }

  render() {
    const { units, searchQuery } = this.props;
    const { viewMode } = this.state;

    const items = this.filterResults(units, searchQuery);

    return (
      <div>
        {/* {attemptingGetQualificationUnits && <UILoading isLoadingOverlay />} */}
        {viewMode != 3 ? (
          <section className="background-gray content-section">
            <QualificationUnitAdd />
          </section>
        ) : (
          <section className="background-gray content-section">
            <QualificationOutcomeAdd />
          </section>
        )}

        {viewMode == 1 && (
          <section className="container content-section">
            <QualificationUnitEdit />
          </section>
        )}

        {viewMode == 2 && items && items.length > 0 && (
          <section className="container content-section">
            <QualificationUnitList units={items} />
          </section>
        )}

        {viewMode == 3 && (
          <section className="container content-section">
            <QualificationOutcomeList />
          </section>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  qualification: path([
    'qualifications',
    'currentQualification',
    'qualification'
  ])(state),
  units: path(['qualifications', 'currentQualification', 'units'])(state),
  unit: path(['qualifications', 'currentLearningUnit'])(state),

  outcomes: path(['form', 'learningUnitEdit', 'values', 'outcomes'])(state),
  newUnitTitle: path(['form', 'learningUnitAdd', 'values', 'title'])(state),
  newOutcomeTitle: path(['form', 'learningUnitOutcomeAdd', 'values', 'title'])(
    state
  ),
  errorCode: state.qualificationUnits.errorCode
});

const mapDispatchToProps = dispatch => ({
  setCurrentLearningUnit: payload =>
    dispatch(QualificationActions.setCurrentLearningUnit(payload)),

  initializeForm: (form_name, data) => dispatch(initialize(form_name, data)),

  changeFieldValue: (form_name, field_name, value) => {
    dispatch(change(form_name, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationUnit);
