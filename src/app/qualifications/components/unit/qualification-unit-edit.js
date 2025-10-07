import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, sum, prop, path } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  FormSection,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';

import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationDetails from '../qualification-details';
import QualificationDetailsMedia from '../qualification-details-media';
import QualificationModalUserConfirm from '../modals/qualification-modal-user-confirm';

import IconMedia from 'images/icon_media.svg';
import IconPlus from 'images/icon_media_plus.svg';

const {
  components: {
    ContentModal,
    UILoading,
    Form: { field, select }
  },
  util: {
    helpers: { UserAccess }
  }
} = common;

const { FormUtil } = userUtil;

const FORM_NAME = 'learningUnitEdit';
const errorMesage = "Data doesn't exist";

class QualificationUnitEdit extends Component {
  constructor() {
    super();
    this.state = {};
    this.onSetColour = this.onSetColour.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { initializeForm, unit } = this.props;

    if (!this.props.unitTypes) {
      this.props.getUnitTypes();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  onPreview() {}

  onSetColour(e) {
    this.props.changeFieldValue('workbook_colour', e);
  }

  render() {
    const {
      changeFieldValue,
      attemptingGetQualificationUnit,
      workbook_colour,
      defaultLevelKey,
      defaultHourKey,
      reference,
      specification,
      isMandatory,
      unit
    } = this.props;

    const { onSetColour } = this;

    return (
      <div className="min-content-height background-white">
        {attemptingGetQualificationUnit ? (
          <UILoading isLoadingOverlay />
        ) : (
          <form onSubmit={e => e.preventDefault()}>
            <div className="columns m-t-20 justify-content around">
              <div className="column is-6">
                <QualificationDetails
                  detailFor="2"
                  editable={unit && !unit.status}
                  {...{
                    changeFieldValue,
                    defaultLevelKey,
                    defaultHourKey,
                    reference,
                    specification,
                    isMandatory,
                    unit
                  }}
                />
              </div>

              <div className="column is-4">
                <div className="m-b-10">
                  <QualificationDetailsMedia
                    formName={FORM_NAME}
                    fieldName="cover"
                    colourFieldName="workbook_colour"
                    mediaType="video"
                    desc1="No workbook cover yet. Why don’t you upload one?"
                    desc2="pload a video for your new workbook cover."
                    buttonText="Add Video Cover"
                    existingButtonText="Change Video Cover"
                    mediaIcon={IconMedia}
                    isColour={true}
                    colour={workbook_colour}
                    changeFieldValue={changeFieldValue}
                    setColour={e => onSetColour(e)}
                  />
                </div>
                <div>
                  <QualificationDetailsMedia
                    formName={FORM_NAME}
                    fieldName="digital_badge"
                    mediaType="image"
                    desc1="No Digital Badge added yet. Why don’t you upload one?"
                    desc2="Upload an image for your new Digital Badget for your workbook cover."
                    buttonText="Add Digital Badge"
                    existingButtonText="Change Digital Badge"
                    mediaIcon={IconPlus}
                    changeFieldValue={changeFieldValue}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    );
  }
}

const validate = (values, props) => {
  const { qualification, units, unitEdit } = props;
  // let credit_value_error = null;

  // if (units) {
  //   let sumOfUnitCredits = sum(map(prop('credit_value'), units));
  //   if (unitEdit && unitEdit.credit_value)
  //     sumOfUnitCredits += Number(unitEdit.credit_value);
  //   credit_value_error =
  //     qualification && sumOfUnitCredits
  //       ? sumOfUnitCredits > qualification.minimum_credit
  //         ? { credit_value: 'Exceeded Credit Value' }
  //         : null
  //       : null;
  // }

  // ...credit_value_error

  const errors = {};

  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'reference').required();
  FormUtil.validate(values, errors, 'level')
    .numbersOnly()
    .required();
  FormUtil.validate(values, errors, 'guided_learning_hours')
    .numbersOnly()
    .required();
  return errors;
};

QualificationUnitEdit.defaultProps = {
  unit: null,
  unitTypes: [],
  getUntTypes: () => {}
};

const QualificationUnitEditForm = reduxForm({
  form: FORM_NAME,
  validate
})(QualificationUnitEdit);

const mapStateToProps = state => ({
  attemptingGetQualificationUnit: path([
    'qualificationUnits',
    'attemptingGetQualificationUnit'
  ])(state),
  unit: path(['qualifications', 'currentLearningUnit'])(state),
  qualification: path([
    'qualifications',
    'currentQualification',
    'qualification'
  ])(state),
  units: path(['qualifications', 'currentQualification', 'units'])(state),
  unitEdit: path(['form', FORM_NAME, 'values'])(state),
  workbook_colour: path(['form', FORM_NAME, 'values', 'workbook_colour'])(
    state
  ),
  defaultLevelKey: path(['form', FORM_NAME, 'values', 'level'])(state),
  defaultHourKey: path(['form', FORM_NAME, 'values', 'guided_learning_hours'])(
    state
  ),
  reference: path(['form', FORM_NAME, 'values', 'reference'])(state),
  specification: path(['form', FORM_NAME, 'values', 'specification'])(state),
  isMandatory: path(['form', FORM_NAME, 'values', 'is_mandatory'])(state)
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationUnitEditForm);
