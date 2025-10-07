import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
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
import * as lodash from 'lodash';

import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';

import QualificationUnitSummary from './qualification-unit-summary';
import QualificationModalUnitLocked from '../modals/qualification-modal-unit-locked';
import QualificationModalWarning from '../modals/qualification-modal-warning';
import QualificationTestActivity from '../test/qualification-test-activity';

import { Creators as QualificationActions } from 'app/qualifications/actions';

import Isvg from 'react-inlinesvg';

import IconUnLock from 'images/icon-unlock.svg';
import IconLock1 from 'images/icon-lock1.svg';
import IconForm from 'images/icon-form.svg';
import IconPlus from 'images/icon-plus.svg';
import IconWorkbooks from 'images/icon_workbooks.svg';
import IconTrash from 'images/icon-trash.svg';

const { UIProgressCircle, ContentModal, UILoading } = common.components;
class QualificationUnitList extends Component {
  constructor() {
    super();
    this.state = {
      expandedUnit_id: null,
      selectedUnit: null
    };
    this.onExpand = this.onExpand.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onEditUnit = this.onEditUnit.bind(this);
    this.onDeleteUnit = this.onDeleteUnit.bind(this);
    this.onViewCriteria = this.onViewCriteria.bind(this);
    this.onSelectUnit = this.onSelectUnit.bind(this);
    this.onCloseUnitLockedModal = this.onCloseUnitLockedModal.bind(this);
  }

  componentWillMount() {}

  onEditUnit(e, unit) {
    e.preventDefault();
    e.stopPropagation();
    if (unit.status) {
      this.setState({ selectedUnit: unit });
      this.unitLockedModal.open(unit);
    } else {
      this.gotoEditUnit(unit);
    }
  }

  onDeleteUnit(e, unit) {
    e.preventDefault();
    e.stopPropagation();

    if (unit.status) {
      this.setState({ selectedUnit: null });
      this.unitLockedModal.open(unit);
    } else {
      this.setState({ selectedUnit: unit });
      this.unitDeleteModal.open();
    }
  }

  gotoEditUnit(unit) {
    const {
      persistedSector,
      qualification,
      getLearningUnitAttempt
    } = this.props;

    getLearningUnitAttempt(
      lodash.get(qualification, 'qualification_id', ''),
      lodash.get(unit, 'unit_id', '')
    );

    browserHistory.push(
      `/qualifications/${persistedSector.title}/${qualification.qualification_id}/${unit.unit_id}/edit`
    );
  }

  onViewCriteria(e, unit) {
    e.preventDefault();
    e.stopPropagation();
    const {
      persistedSector,
      qualification,
      getLearningUnitAttempt
    } = this.props;

    getLearningUnitAttempt(
      lodash.get(qualification, 'qualification_id', ''),
      lodash.get(unit, 'unit_id', '')
    );

    browserHistory.push(
      `/qualifications/${persistedSector.title}/${qualification.qualification_id}/${unit.unit_id}/outcomes`
    );
  }

  onSelectUnit(unit) {
    const { setCurrentLearningUnit } = this.props;
    // setCurrentLearningUnit(unit);
  }

  onExpand(id) {
    if (this.state.expandedUnit_id == id)
      this.setState({ expandedUnit_id: null });
    else this.setState({ expandedUnit_id: id });
  }

  onCloseUnitLockedModal() {
    this.unitLockedModal.close();
    if (this.state.selectedUnit) this.gotoEditUnit(this.state.selectedUnit);
  }

  onCloseUnitDeleteModal(d: boolean) {
    const {
      deleteLearningUnitAttempt,
      qualification,
      updateQualification,
      units
    } = this.props;
    const { selectedUnit } = this.state;
    this.unitDeleteModal.close();
    if (d) {
      updateQualification(
        {
          units: units.filter(unit => unit.unit_id !== selectedUnit.unit_id)
        },
        qualification.qualification_id
      );
      // deleteLearningUnitAttempt(this.state.selectedUnit.unit_id);
    }
  }

  onChangeStatus(item) {
    const { changeLearningUnitStatusAttempt } = this.props;
    changeLearningUnitStatusAttempt(item.status ? 0 : 1, item.unit_id);
  }

  render() {
    const {
      units,
      isTestMode,
      attemptingDeleteLearningUnit,
      attemptingUpdateLearningUnit
    } = this.props;
    const {
      onExpand,
      onChangeStatus,
      onEditUnit,
      onViewCriteria,
      onSelectUnit,
      onDeleteUnit
    } = this;
    const { expandedUnit_id } = this.state;

    return (
      <div className="min-content-height qualifications">
        <ContentModal
          ref={e => {
            this.unitLockedModal = e;
          }}
        >
          <QualificationModalUnitLocked
            title={'The unit is locked'}
            content={'You can not change or delete the unit'}
            button_text={'OK'}
            closeModal={() => this.onCloseUnitLockedModal()}
            handleSubmit={() => this.onCloseUnitLockedModal()}
          />
        </ContentModal>

        <ContentModal
          ref={e => {
            this.unitDeleteModal = e;
          }}
        >
          <QualificationModalWarning
            title={'You are about to delete the unit'}
            content={'Are you sure you want to delete it?'}
            button_text={'OK'}
            is_cancel={true}
            closeModal={() => this.onCloseUnitDeleteModal(false)}
            handleSubmit={() => this.onCloseUnitDeleteModal(true)}
          />
        </ContentModal>

        {attemptingDeleteLearningUnit || attemptingUpdateLearningUnit ? (
          <UILoading isLoadingOverlay />
        ) : null}

        {units &&
          units.map((item, i) => (
            <div
              key={i}
              className="item-panel unit-panel m-t-20 m-b-20"
              style={{ width: 'auto', backgroundColor: 'white' }}
              onClick={e => onSelectUnit(item)}
            >
              <div className="columns is-marginless space-between background-white">
                <div
                  className="column is-paddingless no-grow"
                  style={{
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    height: '90px'
                  }}
                >
                  <UIProgressCircle
                    percentage={0}
                    strokeWidth={8}
                    diameter={100}
                    blurSize={0}
                  />
                  <div
                    className="text"
                    style={{
                      position: 'absolute',
                      top: '25px',
                      left: '20px',
                      fontFamily: 'Open Sans Regular',
                      textAlign: 'center',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ fontSize: '18px' }}>
                      <b>
                        <span>0</span>
                        <span>%</span>
                      </b>
                    </div>
                    <div>
                      <span>COMPLETE</span>
                    </div>
                  </div>
                </div>
                <div className="column is-paddingless m-l-30">
                  <div className="columns is-marginless">
                    <div className="column is-paddingless">
                      <h4 className="item-title m-t-15 has-text-black">
                        Unit {i + 1} : {item ? item.title : ''}
                      </h4>
                      <div className="p-t-10">
                        <span>Total</span> &nbsp;
                        <span>0 Question</span>
                      </div>
                    </div>
                    <div className="column is-paddingless no-grow">
                      <a
                        className="button is-small is-rounded is-outlined is-primary m-l-20"
                        onClick={e => onEditUnit(e, item)}
                      >
                        Edit Unit
                      </a>
                    </div>
                    <div className="column is-paddingless no-grow">
                      <a
                        className="button is-small is-rounded is-outlined is-danger m-l-20"
                        onClick={e => onDeleteUnit(e, item)}
                      >
                        Delete Unit
                      </a>
                    </div>
                    <div className="column is-paddingless no-grow">
                      <a
                        className="button is-small is-rounded is-outlined m-l-20"
                        onClick={e => onViewCriteria(e, item)}
                      >
                        View Criteria
                      </a>
                    </div>
                    <div
                      className="column is-paddingless no-grow has-text-right"
                      style={{ minWidth: '30px' }}
                    >
                      <a onClick={() => onChangeStatus(item)}>
                        {item.status == 0 && <Isvg src={IconUnLock} />}
                        {item.status == 1 && <Isvg src={IconLock1} />}
                      </a>
                    </div>
                  </div>
                  <div
                    className="columns is-marginless"
                    style={{ alignItems: 'center' }}
                  >
                    <div
                      className="is-flex"
                      style={{ alignItems: 'center', minWidth: '280px' }}
                    >
                      <span className="has-text-black">Mandatory &nbsp;</span>
                      <label className="custom radio">
                        <input
                          name="status"
                          type="checkbox"
                          defaultChecked={item ? item.is_mandatory : false}
                        />
                        <span className="ui" />
                      </label>
                      {item.cover && (
                        <span className="m-r-15 m-t-5 unit-list-icons">
                          <Isvg src={IconWorkbooks} />
                        </span>
                      )}
                      {item.digital_badge && (
                        <span className="m-r-15 m-t-5 unit-list-icons">
                          <Isvg src={IconPlus} />
                        </span>
                      )}
                      {
                        <span className="m-r-15 m-t-5 unit-list-icons">
                          <Isvg src={IconForm} />
                        </span>
                      }
                      {
                        <span className="m-t-5 unit-list-icons">
                          <Isvg src={IconTrash} />
                        </span>
                      }
                    </div>

                    <div className="m-l-auto m-r-auto">
                      <span
                        className="view-summary has-text-black"
                        onClick={() => onExpand(item.unit_id)}
                      >
                        {expandedUnit_id == item.unit_id ? 'Close' : 'View'}{' '}
                        Unit Summary
                      </span>{' '}
                      &nbsp;
                      <span>
                        {expandedUnit_id == item.unit_id ? (
                          <i className="fa fa-angle-up fa-lg" />
                        ) : (
                          <i className="fa fa-angle-down fa-lg" />
                        )}
                      </span>
                    </div>
                    <div className="m-l-auto has-text-black p-r-10">
                      Total Outcomes:{' '}
                      {item.outcomes_number > 0 ? item.outcomes_number : 0}
                    </div>
                  </div>
                </div>
              </div>
              {expandedUnit_id == item.unit_id && (
                <div className="m-t-15 background-gray">
                  {!isTestMode && <QualificationUnitSummary unit={item} />}
                  {isTestMode && <QualificationTestActivity unit={item} />}
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
}

QualificationUnitList.defaultProps = {
  isTestMode: false,
  qualificationUnits: []
};

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  qualification: path([
    'qualifications',
    'currentQualification',
    'qualification'
  ])(state),
  attemptingDeleteLearningUnit: path([
    'qualifications',
    'attemptingDeleteLearningUnit'
  ])(state),
  attemptingUpdateLearningUnit: path([
    'qualifications',
    'attemptingUpdateLearningUnit'
  ])(state)
});

const mapDispatchToProps = dispatch => ({
  getLearningUnitAttempt: (qualification_id, unit_id) =>
    dispatch(
      QualificationActions.getLearningUnitAttempt(qualification_id, unit_id)
    ),
  updateQualification: (payload, qualification_id) =>
    dispatch(
      QualificationActions.updateQualificationAttempt(payload, qualification_id)
    ),
  deleteLearningUnitAttempt: unit_id =>
    dispatch(QualificationActions.deleteLearningUnitAttempt(unit_id)),
  changeLearningUnitStatusAttempt: (status, unit_id) =>
    dispatch(
      QualificationActions.changeLearningUnitStatusAttempt(status, unit_id)
    ),
  setCurrentLearningUnit: params =>
    dispatch(QualificationActions.setCurrentLearningUnit(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationUnitList);
