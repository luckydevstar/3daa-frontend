import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, sum, prop, path } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import common from 'app/common';

import { Creators as QualificationActions } from 'app/qualifications/actions';

import AttachUnitsModal from '../modals/qualification-modal-attach-units';
import WarningModal from '../modals/qualification-modal-warning';

const {
  Form: { field },
  UILoading,
  ContentModal
} = common.components;

const FormField = field;
const { FormUtil } = userUtil;

const FORM_NAME = 'learningUnitAdd';
const errorMesage = "Data doesn't exist";

class QualificationUnitAdd extends Component {
  constructor() {
    super();
    this.onAdd = this.onAdd.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.setCurrentLearningUnit({
      title: '',
      reference: null,
      level: null,
      credit_value: null,
      guided_learning_hours: null,
      overview: null,
      outcomes: []
    });
  }

  onAdd() {
    const {
      setCurrentLearningUnit,
      title,
      persistedSector,
      qualification,
      units
    } = this.props;

    if (!title || !title.trim()) return;

    setCurrentLearningUnit({
      title: title,
      reference: null,
      level: null,
      credit_value: null,
      guided_learning_hours: null,
      overview: null,
      outcomes: []
    });
    browserHistory.push(
      `/qualifications/${persistedSector.title}/${qualification.qualification_id}/units/add`
    );
  }

  openAttatchModal() {
    this.attachUnitsModal.open();
  }

  closeAttatchModal() {
    this.attachUnitsModal.close();
  }

  openWarningModal() {
    this.warningModal.open();
  }

  closeWarningModal() {
    this.warningModal.close();
  }

  render() {
    const { title } = this.props;
    const { onAdd } = this;
    return (
      <div className="container">
        <ContentModal
          ref={e => {
            this.attachUnitsModal = e;
          }}
          className="qualification-creator-modal"
        >
          <AttachUnitsModal closeModal={() => this.closeModal()} />
        </ContentModal>

        <ContentModal
          ref={e => {
            this.warningModal = e;
          }}
          className="qualification-creator-modal"
        >
          <WarningModal
            title="Warning"
            content=""
            closeModal={() => this.closeModal()}
          />
        </ContentModal>

        <div className="columns space-between qualifications is-centered">
          <div
            className="column no-grow has-text-black font-family-semibold"
            style={{ whiteSpace: 'nowrap' }}
          >
            Add A Unit{' '}
          </div>
          <div className="column p-t-20">
            <Field
              placeholder="Type unit title"
              name="title"
              type="text"
              component={FormField}
            />
          </div>

          <div className="column no-grow">
            <button
              type="button"
              disabled={!title}
              className={classNames(
                'button is-rounded is-primary',
                'is-secondary'
              )}
              onClick={() => onAdd()}
            >
              Add Unit +
            </button>
          </div>

          <div className="column no-grow">
            <button
              type="button"
              className={classNames(
                'qualifications button is-rounded is-outlined',
                'is-secondary'
              )}
              onClick={() => this.openAttatchModal()}
            >
              Attatch Units
            </button>
          </div>
        </div>
      </div>
    );
  }
}

QualificationUnitAdd.defaultProps = {
  title: '',
  attemptingCreateUnit: false
};

const QualificationUnitAddForm = reduxForm({
  form: FORM_NAME
})(QualificationUnitAdd);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => ({
  title: selector(state, 'title'),
  persistedSector: path(['persisted', 'sector'])(state),
  qualification: path([
    'qualifications',
    'currentQualification',
    'qualification'
  ])(state),
  units: path(['qualifications', 'currentQualification', 'units'])(state)
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
)(QualificationUnitAddForm);
