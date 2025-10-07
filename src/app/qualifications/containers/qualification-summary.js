import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector,
  getFormValues
} from 'redux-form';
import classNames from 'classnames';
import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import { Creators as QualificationActions } from 'app/qualifications/actions';

import QualificationDetails from '../components/qualification-details';
import QualificationDetailsMedia from '../components/qualification-details-media';
import QualificationDetailsMediaBanner from '../components/qualification-details-media-banner';
import QualificationModalUserConfirm from '../components/modals/qualification-modal-user-confirm';

import IconMedia from 'images/icon_media.svg';
import IconPlus from 'images/icon_media_plus.svg';

const {
  components: { ContentModal, UILoading },
  util: {
    helpers: { UserAccess }
  }
} = common;

const FORM_NAME = 'qualificationEdit';

class QualificationSummary extends Component {
  constructor() {
    super();
    this.state = {
      attemptingToDeleteQualification: false
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddToStore = this.handleAddToStore.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.qualificationTypes) {
      this.props.getQualificationTypes();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { attemptingToDeleteQualification } = this.state;
    const { persistedSector } = this.props;

    if (
      attemptingToDeleteQualification &&
      !nextProps.attemptingToDeleteQualification &&
      persistedSector
    ) {
      browserHistory.push(`/qualifications/${persistedSector.title}`);
    }
  }

  componentDidMount() {}

  openModal() {
    this.qualificationModalUserConfirm.open();
  }

  closeModal() {
    this.qualificationModalUserConfirm.close();
  }

  handleSubmit() {
    this.qualificationModalUserConfirm.close();
    this.setState({ attemptingToDeleteQualification: true });
    this.props.deleteQualificationAttempt(
      this.props.qualification.qualification_id
    );
  }

  handleEdit(editMode) {
    this.props.setQualificationEditMode(editMode);
  }

  handleCopy() {
    this.props.copyCurrentQualification();
  }

  handleDelete() {
    this.qualificationModalUserConfirm.open();
  }

  handleAddToStore() {
    this.props.onAddToStore();
  }

  render() {
    const {
      qualification,
      qualificationTypes,
      qualificationEditMode,
      sectors,
      colour,
      coverType,
      defaultSectorKey,
      defaultTypeKey,
      defaultLevelKey,
      defaultHourKey,
      reference,
      specification,
      changeFieldValue,
      setDesktopBanner,
      setMobileBanner,
      mobileBanner,
      desktopBanner
    } = this.props;

    const editable =
      qualificationEditMode == 2 ||
      !qualification ||
      !qualification.qualification_id;

    return (
      <div className="content-section">
        <ContentModal
          ref={e => {
            this.qualificationModalUserConfirm = e;
          }}
        >
          <QualificationModalUserConfirm
            editMode="2"
            qualificationTitle={qualification ? qualification.title : ''}
            closeModal={() => this.closeModal()}
            handleSubmit={e => this.handleSubmit(e)}
          />
        </ContentModal>
        <div className="columns p-t-20 p-b-20 justify-content around background-gray">
          <div className="column is-5">
            <QualificationDetails
              editable={editable}
              handleEdit={() => this.handleEdit(2)}
              handleCopy={this.handleCopy}
              handleDelete={this.handleDelete}
              handleAddToStore={this.handleAddToStore}
              isSummary
              {...{
                changeFieldValue,
                qualification,
                qualificationTypes,
                sectors,
                defaultSectorKey,
                defaultTypeKey,
                defaultLevelKey,
                defaultHourKey,
                reference,
                specification
              }}
            />
          </div>
          <div className="column is-5">
            <div className="m-b-10">
              <QualificationDetailsMedia
                formName={FORM_NAME}
                fieldName="cover"
                editable={editable}
                mediaType={coverType ? coverType : 'both'}
                isColour={true}
                colour={colour}
                desc1="No workbook cover yet. Why don’t you upload one?"
                desc2="Upload a video for your new workbook cover."
                buttonText="Add Video Cover"
                existingButtonText="Change Video Cover"
                mediaIcon={IconMedia}
              />
            </div>
            <div>
              <QualificationDetailsMedia
                formName={FORM_NAME}
                fieldName="digital_badge"
                editable={editable}
                mediaType="image"
                desc1="No Digital Badge added yet. Why don’t you upload one?"
                desc2="Upload an image for your new Digital Badget for your workbook cover."
                buttonText="Add Digital Badge"
                existingButtonText="Change Digital Badge"
                mediaIcon={IconPlus}
              />
            </div>
            <QualificationDetailsMediaBanner
              {...{
                setDesktopBanner,
                setMobileBanner,
                mobileBanner,
                desktopBanner,
                editable
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

QualificationSummary.defaultProps = {
  qualification: null,
  qualificationTypes: [],
  sectors: [],
  colour: null,

  getQualificationTypes: () => {},
  onDeleteQualification: qualification_id => {},
  onCopyQualification: () => {},
  onAddToStore: () => {},

  values: null
};

QualificationSummary.propTypes = {
  qualification: PropTypes.object,
  qualificationTypes: PropTypes.object,
  sectors: PropTypes.array,
  colour: PropTypes.any,

  getQualificationTypes: PropTypes.func,

  onDeleteQualification: PropTypes.func,
  onCopyQualification: PropTypes.func,
  onAddToStore: PropTypes.func
};

const mapStateToProps = state => {
  return {
    qualificationTypes: path(['qualifications', 'qualificationTypes'])(state),
    qualification: path([
      'qualifications',
      'currentQualification',
      'qualification'
    ])(state),
    qualificationEditMode: path(['qualifications', 'qualificationEditMode'])(
      state
    ),
    persistedSector: path(['persisted', 'sector'])(state),
    sectors: path(['sectors', 'sectors', 'sectors'])(state),

    qualificationEdit: path(['form', FORM_NAME])(state),
    colour: path(['form', FORM_NAME, 'values', 'colour'])(state),
    coverType: path(['form', FORM_NAME, 'values', 'cover_type'])(state),
    defaultSectorKey: path(['form', FORM_NAME, 'values', 'sector_id'])(state),
    defaultTypeKey: path([
      'form',
      FORM_NAME,
      'values',
      'qualification_type_id'
    ])(state),
    defaultLevelKey: path(['form', FORM_NAME, 'values', 'level'])(state),
    defaultHourKey: path([
      'form',
      FORM_NAME,
      'values',
      'guided_learning_hours'
    ])(state),
    reference: path(['form', FORM_NAME, 'values', 'reference'])(state),
    specification: path(['form', FORM_NAME, 'values', 'specification'])(state),

    attemptingToDeleteQualification: path([
      'qualifications',
      'attemptingToDeleteQualification'
    ])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  getQualificationTypes: () =>
    dispatch(QualificationActions.getQualificationTypesAttempt()),

  copyCurrentQualification: () =>
    dispatch(QualificationActions.copyCurrentQualification()),

  deleteQualificationAttempt: qualification_id =>
    dispatch(QualificationActions.deleteQualificationAttempt(qualification_id)),

  setQualificationEditMode: mode =>
    dispatch(QualificationActions.setQualificationEditMode(mode))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationSummary);
