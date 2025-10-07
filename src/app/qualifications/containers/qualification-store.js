import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { uniq, without, map, addIndex, path, prop, filter, sum } from 'ramda';
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

import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as QualificationStoreActions } from 'app/store/actions';

import QualificationDetails from '../components/qualification-details';
import QualificationDetailsMedia from '../components/qualification-details-media';
import QualificationModalUserConfirm from '../components/modals/qualification-modal-user-confirm';
import QualificationStoreUnitSelector from '../components/store/qualification-store-unit-selector';
import QualificationStoreOverView from '../components/store/qualification-store-overview';

import IconMedia from 'images/icon_media.svg';

const {
  components: {
    ContentModal,
    CloudinaryMedia,
    UILoading,
    Form: { field, select, textarea }
  },
  util: {
    helpers: { UserAccess }
  }
} = common;
const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;

const { FormUtil } = userUtil;
const FormField = field;
const { TextEditor } = unitsUtil;
const FORM_NAME = 'qualificationStoreEdit';
const errorMesage = "Data doesn't exist";
class QualificationStore extends Component {
  constructor() {
    super();

    this.state = {
      initedUnits: false,
      initedForm: false,
      mandatoryUnits: [],
      mandatorySelected: [],
      optionalUnits: [],
      optionalSelected: [],
      credits: 0,
      learningHours: 0
    };

    this.mandatoryChanged = this.mandatoryChanged.bind(this);
    this.optionalChanged = this.optionalChanged.bind(this);
    this.handleEditUnits = this.handleEditUnits.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUploadSpecification = this.handleUploadSpecification.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      qualification,
      units,
      initializeForm,
      qualificationInStore,
      getQualificationInStoreAttempt
    } = this.props;

    if (qualification) {
      let mandatoryUnits = units.filter(unit => unit.is_mandatory);
      let optionalUnits = units.filter(unit => !unit.is_mandatory);
      let mandatorySelected = map(prop('unit_id'), mandatoryUnits);

      this.setState({
        initedUnits: true,
        mandatoryUnits: mandatoryUnits,
        optionalUnits: optionalUnits,
        mandatorySelected: mandatorySelected
      });

      initializeForm({
        mandatorySelected: mandatorySelected
      });

      if (!qualificationInStore || qualification.qualification_id) {
        getQualificationInStoreAttempt(qualification.qualification_id, false);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      qualification,
      qualificationInStore,
      unitsInStore,
      units,
      initializeForm
    } = nextProps;
    const { initedForm, initedUnits } = this.state;

    if (!initedUnits && units && units.length > 0) {
      let mandatoryUnits = units.filter(unit => unit.is_mandatory);
      let optionalUnits = units.filter(unit => !unit.is_mandatory);
      this.setState({
        initedUnits: true,
        mandatoryUnits: mandatoryUnits,
        optionalUnits: optionalUnits,
        mandatorySelected: map(prop('unit_id'), mandatoryUnits)
      });
    }

    if (
      !initedForm &&
      qualification &&
      qualificationInStore &&
      qualification.qualification_id == qualificationInStore.qualification_id
    ) {
      let sumOfUnitCredits = sum(map(prop('credit_value'), unitsInStore));
      let sumOfUnitLearningHours = sum(
        map(prop('guided_learning_hours'), unitsInStore)
      );
      let mandatoryUnits = filter(u => u.is_mandatory, unitsInStore);
      let optionalUnits = filter(u => !u.is_mandatory, unitsInStore);

      this.setState({
        mandatorySelected: map(prop('unit_id'), mandatoryUnits),
        optionalSelected: map(prop('unit_id'), optionalUnits),
        credits: sumOfUnitCredits,
        learningHours: sumOfUnitLearningHours,
        initedForm: true
      });

      initializeForm({
        course_overview: qualificationInStore.course_overview,
        price: qualificationInStore.price,
        introduction_video: qualificationInStore.introduction_video,
        mandatorySelected: map(prop('unit_id'), mandatoryUnits),
        optionalSelected: map(prop('unit_id'), optionalUnits)
      });
    }
  }

  handleEditUnits() {
    const { persistedSector, qualification } = this.props;
    if (!qualification || !qualification.qualification_id) return;
    browserHistory.push(
      `/qualifications/${persistedSector.title}/${
        qualification.qualification_id
      }/units`
    );
  }

  handleEdit() {}

  handleUploadSpecification() {}

  createVideoPreview(video) {
    let result = null;
    if (!video) return result;

    if (typeof video === 'string') {
      result = (
        <CloudinaryMedia
          fileId={video}
          mediaType="video"
          attributes={{ controls: true }}
          transformations={{
            crop: 'fill',
            gravity: 'center'
          }}
          style={{
            height: '100%',
            width: '100%'
          }}
        />
      );
    } else if (!video.preview) {
      // if Preview isn't ready yet
      const videoUrl = window.URL.createObjectURL(video);
      result = <video src={videoUrl} controls />;
    } else {
      result = <video src={video.preview} controls />;
    }

    return result;
  }

  mandatoryChanged(unit) {
    const { mandatorySelected, credits, learningHours } = this.state;
    let unitIds = mandatorySelected;
    let credits_temp = credits;
    let learningHours_temp = learningHours;
    const temp = unitIds.indexOf(unit.unit_id);

    if (temp >= 0) {
      unitIds = unitIds.filter(u => u != unit.unit_id);
      credits_temp -= unit.credit_value;
      learningHours_temp -= unit.guided_learning_hours;
    } else {
      unitIds = [...unitIds, unit.unit_id];
      credits_temp += unit.credit_value;
      learningHours_temp += unit.guided_learning_hours;
    }

    this.setState({
      mandatorySelected: unitIds,
      credits: credits_temp,
      learningHours: learningHours_temp
    });
    this.props.changeFieldValue('mandatorySelected', unitIds);
  }

  optionalChanged(unit) {
    const { optionalSelected, credits, learningHours } = this.state;
    let unitIds = optionalSelected;
    let credits_temp = credits;
    let learningHours_temp = learningHours;
    const temp = unitIds.indexOf(unit.unit_id);

    if (temp >= 0) {
      unitIds = unitIds.filter(u => u != unit.unit_id);
      credits_temp -= unit.credit_value;
      learningHours_temp -= unit.guided_learning_hours;
    } else {
      unitIds = [...unitIds, unit.unit_id];
      credits_temp += unit.credit_value;
      learningHours_temp += unit.guided_learning_hours;
    }

    this.setState({
      optionalSelected: unitIds,
      credits: credits_temp,
      learningHours: learningHours_temp
    });
    this.props.changeFieldValue('optionalSelected', unitIds);
  }

  render() {
    const {
      qualification,
      units,
      specification,
      courseOverview,
      changeFieldValue
    } = this.props;

    const {
      mandatorySelected,
      optionalSelected,
      optionalUnits,
      mandatoryUnits,
      credits,
      learningHours
    } = this.state;

    return (
      <div
        className="store qualifications container"
        style={{ padding: '1.5rem' }}
      >
        <form onSubmit={e => e.preventDefault()}>
          <div className="columns justify-content around">
            <div
              className="column is-6 background-gray"
              style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}
            >
              <QualificationDetails
                detailFor="3"
                editable={false}
                unitsNum={units ? units.length : 0}
                handleEditUnits={this.handleEditUnits}
                handleEdit={this.handleEdit}
                handleUploadSpecification={this.handleUploadSpecification}
                {...{
                  specification,
                  qualification
                }}
              />
            </div>
            <div
              className="column is-6 background-white"
              style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}
            >
              <div style={{ height: '300px', paddingBottom: '15px' }}>
                <QualificationDetailsMedia
                  formName={FORM_NAME}
                  fieldName="introduction_video"
                  mediaType="video"
                  onlyMedia="true"
                  mediaMaxWidth="100%"
                  buttonText="Add Video Cover"
                  existingButtonText="Change Video Cover"
                  placeholder="Video must be compressed to under 20MB"
                  mediaIcon={IconMedia}
                />
              </div>
              <div className="columns space-between">
                <div className="column p-t-20">Qualification Price</div>
                <div className="column" style={{ position: 'relative' }}>
                  <Field
                    name="price"
                    type="text"
                    component={FormField}
                    className="control has-text-right price"
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '23px',
                      left: '20px',
                      zIndex: '100'
                    }}
                  >
                    Price £
                  </span>
                </div>
              </div>
              <Collapsible trigger="Mandatory Units">
                <div className="option-status">
                  <a>{mandatorySelected.length} Selected</a>
                </div>
                <QualificationStoreUnitSelector
                  units={mandatoryUnits}
                  checked={mandatorySelected}
                  onUnitSelect={e => this.mandatoryChanged(e)}
                />
              </Collapsible>
              <Collapsible trigger="Optional Units">
                <div className="option-status">
                  <a>{optionalSelected.length} Selected</a>
                </div>
                <QualificationStoreUnitSelector
                  units={optionalUnits}
                  checked={optionalSelected}
                  onUnitSelect={e => this.optionalChanged(e)}
                />
              </Collapsible>
              <Collapsible trigger="About the course">
                <div className="option-status">
                  {courseOverview && <a>Completed</a>}
                </div>
                <TextEditor
                  affectThisField="course_overview"
                  changeFieldValue={changeFieldValue}
                />
              </Collapsible>
              <Collapsible trigger="Overview">
                <QualificationStoreOverView
                  mandatory={mandatorySelected.length}
                  optional={optionalSelected.length}
                  credits={credits}
                  learningHours={learningHours}
                  credits_percent={
                    qualification && qualification.minimum_credit
                      ? Math.min(
                          (credits / qualification.minimum_credit) * 100,
                          100
                        )
                      : 0
                  }
                  learningHours_percent={
                    qualification && qualification.guided_learning_hours
                      ? Math.min(
                          (learningHours /
                            qualification.guided_learning_hours) *
                            100,
                          100
                        )
                      : 0
                  }
                />
              </Collapsible>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  return errors;
};

QualificationStore.defaultProps = {
  qualification: null,
  units: [],
  getUnits: () => {}
};

QualificationStore.propTypes = {
  qualification: PropTypes.object
};

const QualificationStoreForm = reduxForm({
  form: FORM_NAME,
  validate
})(QualificationStore);

const selector = formValueSelector(FORM_NAME);

const mapStateToProps = state => ({
  persistedSector: path(['persisted', 'sector'])(state),
  qualification: path([
    'qualifications',
    'currentQualification',
    'qualification'
  ])(state),
  units: path(['qualifications', 'currentQualification', 'units'])(state),
  qualificationInStore: path([
    'store',
    'currentQualification',
    'qualification'
  ])(state),
  unitsInStore: path(['store', 'currentQualification', 'units'])(state),
  qualificationStoreEdit: path(['form', 'qualificationStoreEdit', 'values'])(
    state
  ),
  courseOverview: path([
    'form',
    'qualificationStoreEdit',
    'values',
    'course_overview'
  ])(state)
});

const mapDispatchToProps = dispatch => ({
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },

  changeFieldValue: (field_name, value) =>
    dispatch(change(FORM_NAME, field_name, value)),

  getQualificationInStoreAttempt: (qualification_id, view_error) =>
    dispatch(
      QualificationStoreActions.getQualificationInStoreAttempt(
        qualification_id,
        view_error
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationStoreForm);
