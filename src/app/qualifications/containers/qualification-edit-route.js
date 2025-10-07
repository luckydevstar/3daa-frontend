import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import {
  Field,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';

import { uniq, without, map, addIndex, equals, path, clone } from 'ramda';

import classNames from 'classnames';

import userUtil from 'app/user/util/';
import unitsUtil from 'app/units/util/';
import { Creators as unitsActions } from 'app/units/actions';
import common from 'app/common';

import { Creators as QualificationActions } from 'app/qualifications/actions';
import { Creators as SectorsActions } from 'app/sectors/actions';

import Isvg from 'react-inlinesvg';
import IconWorkbooks from 'images/icon_workbooks_fat_grey_1.svg';
import IconImagePreview from 'images/icon_image_preview.svg';

import QualificationSummary from './qualification-summary';
import QualificationUnit from './qualification-unit';
import QualificationStore from './qualification-store';
import QualificationUnitAmplification from './qualification-unit-amplification';
import QualificationTutorInformation from './qualification-tutor-information';

import QualificationTest from '../components/test/qualification-test';
import QualificationModalAddResult from '../components/modals/qualification-modal-add-result';

const createCloudinaryUrl = common.util.helpers.createCloudinaryUrl;
const {
  Form: { field, select, radio, textarea, file },
  CloudinaryMedia,
  Footer,
  UILoading,
  ContentModal,
  UINavigation
} = common.components;

const { FormUtil } = userUtil;

const FORM_NAME = 'qualificationEdit';
const errorMesage = "Data doesn't exist";

class QualificationEditRoute extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      subpage: 0,
      visibleSubmitButton: true,
      availableLevels: [
        'Summary',
        'Units',
        'Unit Amplification',
        'Tutor Information',
        'Test',
        'Store'
      ],
      filteredResults: null,
      add_result_modal_success: true,
      add_result_modal_title: 'Qualification Added',
      add_result_modal_content:
        'Your qualification has been successfully added. Now add the units to your qualification.',
      add_result_modal_submit_text: 'Add Units',

      qualification: null,
      unit: null,
      viewUnitMode: 2, //list view
      searchQuery: '',
      headerError: null,
      desktopBanner: null,
      mobileBanner: null
    };

    this.goBack = this.goBack.bind(this);
    this.setActive = this.setActive.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onAddQualificationToStore = this.onAddQualificationToStore.bind(this);
    this.isValid = this.isValid.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.onVisibleSubmitButton = this.onVisibleSubmitButton.bind(this);
    this.createBothPreview = this.createBothPreview.bind(this);
    this.setDesktopBanner = this.setDesktopBanner.bind(this);
    this.setMobileBanner = this.setMobileBanner.bind(this);
  }

  UNSAFE_componentWillMount() {
    const {
      sectors,
      qualification,
      unit,
      getSectors,
      getQualificationAttempt,
      params
    } = this.props;

    if (!qualification && params.qualification_id != 'add') {
      getQualificationAttempt(params.qualification_id);
    }
    if (!sectors) {
      getSectors();
    }
    this.setState({
      unit: unit
    });
  }

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.attemptingPostQualification &&
      this.props.attemptingPostQualification
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    const { setQualificationEditMode } = this.props;
    setQualificationEditMode(1);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { qualification, unit, viewUnitMode, subpage } = this.state;
    const {
      initializeForm,
      qualificationEdit,
      getLearningUnitAttempt,
      attemptingGetLearningUnit
    } = this.props;
    const params = nextProps.params;
    const path = browserHistory.getCurrentLocation().pathname;

    if (params) {
      if (params.unit_id == 'units') {
        this.setState({ subpage: 1 });
        if (path.indexOf('/add') >= 0) {
          this.setState({ viewUnitMode: 1, visibleSubmitButton: true });
        } else {
          this.setState({ viewUnitMode: 2, visibleSubmitButton: false });
        }
      } else if (params.unit_id == 'amplification') {
        this.setState({ subpage: 2, visibleSubmitButton: true });
      } else if (params.unit_id == 'tutor') {
        this.setState({ subpage: 3, visibleSubmitButton: true });
      } else if (params.unit_id == 'test') {
        this.setState({ subpage: 4 });
      } else if (params.unit_id == 'store') {
        this.setState({ subpage: 5, visibleSubmitButton: true });
      } else if (params.unit_id) {
        if (subpage != 1) {
          this.setState({ subpage: 1 });
        }
        if (path.indexOf('/edit') >= 0) {
          // if (!attemptingGetLearningUnit && (!unit || unit.unit_id != params.unit_id))
          //   getLearningUnitAttempt(params.unit_id);
          this.setState({ viewUnitMode: 1, visibleSubmitButton: true });
        } else if (path.indexOf('/outcomes') >= 0) {
          this.setState({ viewUnitMode: 3, visibleSubmitButton: true });
        } else if (viewUnitMode != 2) {
          this.setState({ viewUnitMode: 2, visibleSubmitButton: false });
        }
      } else {
        this.setState({ subpage: 0, visibleSubmitButton: true });
      }
    }

    // if (!nextProps.qualification && qualification ||
    //     !qualificationEdit ||
    //     nextProps.qualification && nextProps.qualification.qualification_id != qualificationEdit.values && qualificationEdit.values.qualification_id
    //   ) {
    //     console.log(nextProps.qualification, qualificationEdit);
    //     initializeForm(nextProps.qualification);
    // }
    // this.setState({ qualification: nextProps.qualification });

    if (
      nextProps.qualification !== qualification &&
      (!nextProps.qualification ||
        (nextProps.qualification && !qualification) ||
        (nextProps.qualification &&
          nextProps.qualification.qualification_id !=
            qualification.qualification_id))
    ) {
      this.setState({
        qualification: nextProps.qualification
      });
      if (nextProps.qualification) {
        this.setState({
          desktopBanner: nextProps.qualification.banner_desktop
            ? {
                url: nextProps.qualification.banner_desktop,
                isImage: nextProps.qualification.banner_desktop_type === 'image'
              }
            : null,
          mobileBanner: nextProps.qualification.banner_mobile
            ? {
                url: nextProps.qualification.banner_mobile,
                isImage: nextProps.qualification.banner_mobile_type === 'image'
              }
            : null
        });
      }
      initializeForm(nextProps.qualification);
    }
  }

  goBack() {
    const { persistedSector } = this.props;
    browserHistory.push(`/qualifications/${persistedSector.title}`);
  }

  onChangeTitle(e) {
    const { subpage } = this.state;
    const { changeFieldValue } = this.props;

    if (subpage == 0) {
      changeFieldValue('qualificationEdit', 'title', e.target.value);
    } else {
      changeFieldValue('learningUnitEdit', 'title', e.target.value);
    }
  }

  validateVideo(video, callback) {
    const error = [];
    const { max_video_file_size, video_formats } = this.props;

    if (
      video_formats &&
      video_formats.every(e => video.type.indexOf(e) === -1)
    ) {
      error.push(
        `We're accepting${video_formats.map(
          video_format => ` .${format}`
        )} only`
      );
      return callback(false, error);
    }

    if (video.size > max_video_file_size) {
      error.push(
        `Your video is bigger than: ${max_video_file_size / 1024 / 1024}MB`
      );
      return callback(false, error);
    }

    return callback(true);
  }

  validateImage(image, callback) {
    const img = new Image();
    const error = [];
    const {
      max_image_resolution,
      min_image_resolution,
      max_image_file_size,
      image_formats
    } = this.props;

    img.src = image.preview;
    img.type = image.type;

    if (
      image_formats &&
      image_formats.every(e => image.type.indexOf(e) === -1)
    ) {
      error.push(
        `We're accepting${image_formats.map(format => ` .${format}`)} only`
      );
      return callback(false, error);
    }

    if (image.size > max_image_file_size) {
      error.push(
        `Your image is bigger than: ${max_image_file_size / 1024 / 1024}MB`
      );
    }

    img.onload = () => {
      if (img.type.indexOf('svg') > -1) {
        return callback(true, null);
      }
      if (
        img.width > max_image_resolution.width ||
        img.height > max_image_resolution.height
      ) {
        error.push(
          `Your image is larger than ${max_image_resolution.width}x${max_image_resolution.height}`
        );
      }
      if (
        img.width < min_image_resolution.width ||
        img.height < min_image_resolution.height
      ) {
        error.push(
          `Your image is smaller than ${min_image_resolution.width}x${min_image_resolution.height}`
        );
      }
      return callback(!error.length, error.length ? error : null);
    };
    return null;
  }

  detectMediaType(file) {
    let result = null;

    if (file && file.type) {
      if (file.type.indexOf('image') > -1) {
        result = 'image';
      } else if (file.type.indexOf('video') > -1) {
        result = 'video';
      }
    }
    return result;
  }

  setHeaderMedia(file) {
    this.props.changeFieldValue('learningUnitEdit', 'header', file);
  }

  handleHeaderUpload(files) {
    const file = files[0];
    const mediaType = this.detectMediaType(file);
    const setHeader = (status, error) => {
      if (status) {
        this.setState({ headerError: null }, () => {
          this.setHeaderMedia(file);
        });
      } else {
        this.setState({ headerError: error[0] });
      }
    };

    switch (mediaType) {
      case 'video':
        this.validateVideo(file, setHeader);
        break;
      case 'image':
        this.validateImage(file, setHeader);
        break;
      default:
        break;
    }
  }

  /**
   * @param {number[]} units
   * units id
   */
  addSelectedUnits(units) {
    const selectedUnits = uniq([...this.state.selectedUnits, ...units]);
    this.setState({ selectedUnits });
  }

  removeSelectedUnits(units) {
    const selectedUnits = without([...units], this.state.selectedUnits);
    this.setState({ selectedUnits });
  }

  isUnitSelected(unit_id) {
    return this.state.selectedUnits.includes(unit_id);
  }

  handleUnitClick(unit_id) {
    if (this.isUnitSelected(unit_id)) {
      this.removeSelectedUnits([unit_id]);
    } else {
      this.addSelectedUnits([unit_id]);
    }
  }

  setActive(key) {
    const {
      persistedSector,
      qualification,
      setQualificationEditMode
    } = this.props;
    let subpage = +key.substr(7);
    if ((subpage == 1 || subpage == 4 || subpage == 5) && !qualification)
      return;

    let route = `/qualifications/${persistedSector.title}`;

    if (qualification) route += `/${qualification.qualification_id}`;
    else route += '/add';

    switch (subpage) {
      case 1:
        setQualificationEditMode(1);
        route = route + '/units';
        break;
      case 2:
        route = route + '/amplification';
        break;
      case 3:
        route = route + '/tutor';
        break;
      case 4:
        route = route + '/test';
        break;
      case 5:
        route = route + '/store';
    }
    // this.setState({ subpage: subpage, visibleSubmitButton: subpage != 1 });
    this.setState({ visibleSubmitButton: subpage != 1 && subpage != 4 });
    browserHistory.push(route);
  }

  getTabs() {
    return this.state.availableLevels.map((label, i) => ({
      key: `wb-nav-${i}`,
      text: label
    }));
  }

  closeModalAddResult() {
    this.addModalResult.close();
  }

  handleModalAddResultSubmit() {
    this.addModalResult.close();
  }

  isValid() {
    const { subpage, mobileBanner, desktopBanner } = this.state;
    const {
      qualification,
      qualificationEdit,
      unit,
      unitEdit,
      storeEdit
    } = this.props;
    switch (subpage) {
      case 0:
        if (!qualification)
          return qualificationEdit && !qualificationEdit.syncErrors;
        else
          return (
            qualificationEdit &&
            !qualificationEdit.syncErrors &&
            !equals(qualification, {
              ...qualificationEdit.values,
              banner_desktop: desktopBanner,
              banner_mobile: mobileBanner
            })
          );
      case 1:
        if (!unit) return unitEdit && !unitEdit.syncErrors;
        else
          return (
            unitEdit && !unitEdit.syncErrors && !equals(unit, unitEdit.values)
          );
      case 2:
        if (!qualificationEdit || qualificationEdit.syncErrors) return false;

        let values = { ...qualificationEdit.values };

        if (!qualification) {
          if (
            values.unit_amplification_introduction ||
            values.amplification_and_criteria_relation ||
            values.amplification_structure ||
            values.legislation
          )
            return true;
          return false;
        } else {
          if (
            !values.unit_amplification_introduction &&
            !values.amplification_and_criteria_relation &&
            !values.amplification_structure &&
            !values.legislation
          )
            return false;

          if (
            !equals(
              qualification.unit_amplification_introduction,
              values.unit_amplification_introduction
            ) ||
            !equals(
              qualification.amplification_and_criteria_relation,
              values.amplification_and_criteria_relation
            ) ||
            !equals(
              qualification.amplification_structure,
              values.amplification_structure
            ) ||
            !equals(qualification.legislation, values.legislation)
          )
            return true;
          return false;
        }
      case 3:
        if (!qualification)
          return (
            qualificationEdit &&
            !qualificationEdit.syncErrors &&
            qualificationEdit.values.tutor_information
          );
        else
          return (
            qualificationEdit &&
            !qualificationEdit.syncErrors &&
            !equals(
              qualification.tutor_information,
              qualificationEdit.values.tutor_information
            )
          );
      case 4:
        return true;
      case 5:
        if (!storeEdit || storeEdit.syncErrors) return false;
        values = { ...storeEdit.values };
        if (!values.course_overview || !values.price) return false;
        return true;
    }
  }

  isLoading() {
    const { subpage } = this.state;
    const {
      qualification,
      unit,
      attemptingPostQualification,
      attemptingCreateLearningUnit,
      attemptingUpdateLearningUnit,
      attemptingAddQualificationStore
    } = this.props;

    switch (subpage) {
      case 0:
      case 2:
      case 3:
        if (!qualification) return attemptingPostQualification;
        else return attemptingPostQualification;
      case 1:
        if (!unit) return attemptingCreateLearningUnit;
        else
          return attemptingCreateLearningUnit || attemptingUpdateLearningUnit;
      case 4:
        return false;
      case 5:
        return attemptingAddQualificationStore;
    }
  }

  onVisibleSubmitButton(value) {
    this.setState({ visibleSubmitButton: value });
  }

  getHandleEdit() {}

  handleChange(e) {
    this.setState({ searchQuery: e });
  }

  onCancel() {
    const {
      qualificationEditMode,
      setQualificationEditMode,
      qualification,
      initializeForm
    } = this.props;
    const { subpage } = this.state;
    if ([0, 2, 3].indexOf(subpage) >= 0) {
      this.setActive('wb-nav-0');
      setQualificationEditMode(1);
      initializeForm(qualification);
      this.setState({
        desktopBanner: qualification.banner_desktop
          ? {
              url: qualification.banner_desktop,
              isImage: qualification.banner_desktop_type === 'image'
            }
          : null,
        mobileBanner: qualification.banner_mobile
          ? {
              url: qualification.banner_mobile,
              isImage: qualification.banner_mobile_type === 'image'
            }
          : null
      });
    } else if ([1].indexOf(subpage) >= 0) {
      this.setActive('wb-nav-1');
    }
  }

  onSave() {
    const { subpage, viewUnitMode, desktopBanner, mobileBanner } = this.state;
    const {
      persistedSector,
      qualification_category_id,
      qualification,
      qualificationEdit,
      createQualificationAttempt,
      updateQualificationAttempt,
      addQualificationStoreAttempt,
      createLearningUnitAttempt,
      updateLearningUnitAttempt,
      unit,
      unitAdd,
      unitEdit,
      storeEdit
    } = this.props;
    let value;

    switch (subpage) {
      case 0:
      case 2:
      case 3:
        value = { ...qualificationEdit.values };

        if (value.cover)
          value.cover =
            typeof value.cover === 'string' ? value.cover : value.cover[0];

        if (value.video)
          value.video =
            typeof value.video === 'string' ? value.video : value.video[0];

        if (!value.digital_badge) {
          value.digital_badge = null;
        } else if (
          typeof value.digital_badge !== 'string' &&
          value.digital_badge[0]
        ) {
          value.digital_badge = value.digital_badge[0];
        } else if (value.digital_badge.cloudinary_file_id) {
          value.digital_badge = value.digital_badge.cloudinary_file_id;
        }

        if (!value.specification) {
          value.specification = null;
        } else if (
          typeof value.specification !== 'string' &&
          value.specification[0]
        ) {
          value.specification = value.specification[0];
        }

        value.qualification_category_id = qualification_category_id;
        if (!value.qualification_id) {
          createQualificationAttempt(value);
        } else {
          updateQualificationAttempt(
            {
              ...value,
              banner_desktop: desktopBanner ? desktopBanner.file : null,
              banner_mobile: mobileBanner ? mobileBanner.file : null
            },
            qualification.qualification_id
          );
        }
        break;
      case 1:
        value = { ...unitEdit.values };

        if (value.cover)
          value.cover =
            typeof value.cover === 'string' ? value.cover : value.cover[0];

        // delete value.digital_badge;

        if (!value.digital_badge) {
          value.digital_badge = null;
        } else if (
          typeof value.digital_badge !== 'string' &&
          value.digital_badge[0]
        ) {
          value.digital_badge = value.digital_badge[0];
        } else if (value.digital_badge.cloudinary_file_id) {
          value.digital_badge = value.digital_badge.cloudinary_file_id;
        }

        if (!value.specification) {
          value.specification = null;
        } else if (
          typeof value.specification !== 'string' &&
          value.specification[0]
        ) {
          value.specification = value.specification[0];
        }

        if (!value.outcomes) {
          value.outcomes = [];
        }

        value.qualification_id = qualification.qualification_id;

        if (!path(['values', 'unit_id'])(unitEdit)) {
          value.title = unitAdd.values ? unitAdd.values.title : '';
          createLearningUnitAttempt(value);
        } else {
          updateLearningUnitAttempt(value, value.unit_id);
        }
        break;
      case 5:
        value = { ...storeEdit.values };
        let unitIds = [];
        if (value.mandatorySelected) unitIds = value.mandatorySelected;
        if (value.optionalSelected)
          unitIds = [...unitIds, ...value.optionalSelected];

        if (value.introduction_video)
          value.introduction_video =
            typeof value.introduction_video === 'string'
              ? value.introduction_video
              : value.introduction_video[0];

        addQualificationStoreAttempt(
          {
            course_overview: value.course_overview,
            price: value.price,
            introduction_video: value.introduction_video,
            units: unitIds
          },
          qualification.qualification_id
        );
    }
    // this.props.createQualificationAttempt(value);
    // this.addModalResult.open();

    // if(values.qualification_id)
    //   this.props.updateQualificationAttempt(value, value.qualification_id)
    // else
    //   this.props.createQualificationAttempt(value);
  }

  onAddQualificationToStore() {
    this.setActive('wb-nav-5');
  }

  createPhotoPreview(item) {
    let result = null;
    const photo = (item && item.digital_badge) || null;
    const uploadedMedia = photo && photo['cloudinary_file_id'];

    if (uploadedMedia) {
      result = (
        <CloudinaryMedia
          fileId={uploadedMedia}
          mediaType="image"
          transformations={{
            width: 150,
            height: 150,
            crop: 'fit'
          }}
        />
      );
    } else if (photo && photo[0] && photo[0].preview) {
      result = <img src={photo[0].preview} alt="" style={{ width: '150px' }} />;
    } else {
      result = (
        <div
          className="columns"
          style={{
            maxWidth: 150,
            margin: 'auto'
          }}
        >
          <div className="column">
            <Isvg className="small" src={IconImagePreview} />
          </div>
        </div>
      );
    }
    return result;
  }

  createBothPreview(file, cloudinaryMediaType) {
    let result = null;
    if (file) {
      if (file.fileId)
        switch (cloudinaryMediaType) {
          case 'image':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                transformations={{
                  width: 200,
                  height: 200,
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          case 'video':
            result = (
              <CloudinaryMedia
                fileId={file}
                mediaType={cloudinaryMediaType}
                thumbnail
                transformations={{
                  width: 200,
                  height: 200,
                  crop: 'fill',
                  gravity: 'center'
                }}
              />
            );
            break;
          default:
        }

      if (typeof file !== 'string') {
        if (file.type.includes('video')) {
          result = (
            <video
              src={file.preview}
              controls
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else if (file.type.includes('image')) {
          result = (
            <img
              src={file.preview}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'fill' }}
            />
          );
        } else {
          result = <div />;
        }
      }
    }
    return result;
  }

  setDesktopBanner(desktopBanner) {
    this.setState({
      desktopBanner
    });
  }

  setMobileBanner(mobileBanner) {
    this.setState({
      mobileBanner
    });
  }

  render() {
    const {
      subpage,
      searchQuery,
      viewUnitMode,
      visibleSubmitButton,
      add_result_modal_success,
      add_result_modal_title,
      add_result_modal_content,
      add_result_modal_submit_text,

      headerError,
      mobileBanner,
      desktopBanner
    } = this.state;

    const {
      goBack,
      onChangeTitle,
      onSave,
      onCancel,
      onVisibleSubmitButton,
      isValid,
      isLoading,
      createBothPreview
    } = this;

    const {
      persistedSector,
      qualification,
      qualification_category_id,
      qualificationEditMode,

      qualificationEdit,
      qualificationTitle,
      qualification_colour,

      unitEdit,
      unitTitle,
      unit_colour,

      attemptingPostQualification,
      attemptingGetQualification
    } = this.props;

    const colour =
      subpage == 1 && unit_colour ? unit_colour : qualification_colour;

    const tabs = this.getTabs();

    return (
      <div className="qualifications">
        <div className="workbook-sector-container min-content-height">
          {/* Header */}
          <ContentModal
            ref={e => {
              this.addModalResult = e;
            }}
          >
            <QualificationModalAddResult
              title={add_result_modal_title}
              content={add_result_modal_content}
              success={add_result_modal_success}
              button_text={add_result_modal_submit_text}
              closeModal={() => this.closeModalAddResult()}
              handleSubmit={() => this.handleModalAddResultSubmit()}
            />
          </ContentModal>

          <section
            className="hero smaller gray"
            style={{ position: 'relative' }}
          >
            <div
              className="header-background"
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                background: colour
              }}
            >
              {subpage == 1 &&
                unitEdit &&
                unitEdit.values &&
                createBothPreview(unitEdit.values.header, 'image')}
            </div>
            <div className="hero-body">
              <div className="container">
                <div className="media">
                  <div className="media-left">
                    <a className="back-button" onClick={() => goBack()} />
                  </div>
                  <div className="media-content">
                    {[0, 1].indexOf(subpage) >= 0 ? (
                      <input
                        placeholder={
                          subpage != 1
                            ? 'Add A Qualification Name Here'
                            : 'Add Unit Title'
                        }
                        name="title"
                        type="text"
                        value={
                          subpage == 0
                            ? qualificationTitle || ''
                            : unitTitle || ''
                        }
                        className="control"
                        style={{
                          fontSize: '32px',
                          background: 'transparent',
                          border: 'none',
                          width: '100%'
                        }}
                        onChange={e => onChangeTitle(e)}
                      />
                    ) : (
                      <h1 className="title">
                        {[2, 3].indexOf(subpage) >= 0
                          ? qualificationTitle || ''
                          : subpage == 4
                          ? 'Test'
                          : 'Store'}
                      </h1>
                    )}

                    {[0, 2, 3].indexOf(subpage) >= 0 ? (
                      <h2 className="subtitle">
                        {(persistedSector && persistedSector.title) || ''}
                      </h2>
                    ) : [1].indexOf(subpage) >= 0 ? (
                      <h2 className="subtitle">{qualificationTitle || ''}</h2>
                    ) : (
                      <span />
                    )}
                  </div>

                  {[2, 3, 4].indexOf(subpage) >= 0 && (
                    <div
                      className="media-right align-right"
                      style={{ maxWidth: '350px' }}
                    >
                      {[2, 3].indexOf(subpage) >= 0 &&
                        this.createPhotoPreview(qualificationEdit.values)}
                      {[4].indexOf(subpage) >= 0 &&
                        this.createPhotoPreview(qualification)}
                    </div>
                  )}

                  {/* subpage == 1 && (
                      <div className="media-right align-right">
                        <Dropzone
                          className="cover-video-upload"
                          onDrop={files => this.handleHeaderUpload(files)}
                        >
                          <div
                            className="has-text-centered"
                            style={{ cursor: 'pointer' }}
                          >
                            <div style={{ opacity: '0.3' }}>
                              <Isvg src={IconWorkbooks} />
                            </div>

                            {unitEdit &&
                            unitEdit.values &&
                            unitEdit.values.header ? (
                              <span>Change Header Media</span>
                            ) : (
                              <span>Add Header Image/Animation</span>
                            )}
                            {headerError ? (
                              <span className="field-error">{headerError}</span>
                            ) : null}
                          </div>
                        </Dropzone>
                      </div>
                    )*/}
                </div>
              </div>
            </div>
          </section>

          {/* Navigation */}

          <section className="content-section navigation-section">
            <div className="container">
              <UINavigation
                tabs={tabs}
                active={`wb-nav-${subpage}`}
                showSearch={subpage == 1}
                change={e => {
                  this.setActive(e);
                }}
                onSearch={e => this.handleChange(e)}
                searchPlaceholder="Search all units"
              />
            </div>
          </section>

          {attemptingGetQualification ? (
            <UILoading isLoadingOverlay />
          ) : (
            <section className="background-white">
              <div className="item-edit-container">
                {[0, 2, 3].indexOf(subpage) >= 0 ? (
                  <form onSubmit={e => e.preventDefault()}>
                    <div className="container content-section m-t-20">
                      {subpage == 0 ? (
                        <QualificationSummary
                          qualification={qualification}
                          attemptingPostQualification={
                            attemptingPostQualification
                          }
                          onAddToStore={() => this.onAddQualificationToStore()}
                          setDesktopBanner={this.setDesktopBanner}
                          setMobileBanner={this.setMobileBanner}
                          mobileBanner={mobileBanner}
                          desktopBanner={desktopBanner}
                        />
                      ) : subpage == 2 ? (
                        <QualificationUnitAmplification />
                      ) : (
                        <QualificationTutorInformation />
                      )}
                    </div>
                  </form>
                ) : (
                  <div>
                    {subpage == 1 ? (
                      <QualificationUnit
                        viewMode={viewUnitMode}
                        searchQuery={searchQuery}
                        onVisibleSubmitButton={e => onVisibleSubmitButton(e)}
                      />
                    ) : subpage == 4 ? (
                      <QualificationTest />
                    ) : (
                      <QualificationStore />
                    )}
                  </div>
                )}
                <div />
              </div>
            </section>
          )}

          {visibleSubmitButton && subpage != 4 && (
            <section className="content-section background-white m-t-5 top-box-shadow">
              <div className="container p-t-15 p-b-15 has-text-right">
                <button
                  className="button is-rounded"
                  disabled={isLoading()}
                  onClick={e => onCancel()}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isValid() || isLoading()}
                  className={classNames(
                    'button is-rounded add-qualification-button m-l-20',
                    'is-primary',
                    {
                      'is-loading': isLoading()
                    }
                  )}
                  onClick={e => onSave()}
                >
                  {[0, 2, 3].indexOf(subpage) >= 0
                    ? qualificationEdit &&
                      qualificationEdit.values &&
                      qualificationEdit.values.qualification_id
                      ? 'Save Change'
                      : 'Add Qualification'
                    : subpage == 1
                    ? unitEdit && unitEdit.values && unitEdit.values.unit_id
                      ? 'Save Change'
                      : 'Add Unit'
                    : 'Save Change'}
                </button>
              </div>
            </section>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'reference').required();
  FormUtil.validate(values, errors, 'sector_id').required();
  // FormUtil.validate(values, errors, 'level').required();
  FormUtil.validate(values, errors, 'guided_learning_hours')
    .numbersOnly()
    .required();
  FormUtil.validate(values, errors, 'minimum_credit')
    .numbersOnly()
    .required();
  FormUtil.validate(values, errors, 'overview').required();
  return errors;
};

const QualificationEditForm = reduxForm({
  form: FORM_NAME,
  validate
})(QualificationEditRoute);

const mapStateToProps = state => {
  return {
    persistedSector: path(['persisted', 'sector'])(state),
    sectors: path(['sectors', 'sectors', 'sectors'])(state),

    qualification_category_id: path([
      'qualifications',
      'currentQualificationCategoryId'
    ])(state),
    qualificationTypes: path(['qualifications', 'qualificationTypes'])(state),
    qualificationEditMode: path(['qualifications', 'qualificationEditMode'])(
      state
    ),

    qualification: path([
      'qualifications',
      'currentQualification',
      'qualification'
    ])(state),
    qualificationEdit: path(['form', FORM_NAME])(state),
    qualificationTitle: path(['form', 'qualificationEdit', 'values', 'title'])(
      state
    ),

    unit: path(['qualifications', 'currentLearningUnit'])(state),
    unitEdit: path(['form', 'learningUnitEdit'])(state),
    unitTitle: path(['form', 'learningUnitEdit', 'values', 'title'])(state),
    unitAdd: path(['form', 'learningUnitAdd'])(state),

    storeEdit: path(['form', 'qualificationStoreEdit'])(state),

    attemptingGetQualification: path([
      'qualifications',
      'attemptingGetQualification'
    ])(state),
    attemptingGetLearningUnit: path([
      'qualifications',
      'attemptingGetLearningUnit'
    ])(state),
    attemptingPostQualification: path([
      'qualifications',
      'attemptingPostQualification'
    ])(state),
    attemptingCreateLearningUnit: path([
      'qualifications',
      'attemptingCreateLearningUnit'
    ])(state),
    attemptingUpdateLearningUnit: path([
      'qualifications',
      'attemptingUpdateLearningUnit'
    ])(state),

    attemptingAddQualificationStore: path([
      'qualifications',
      'attemptingAddQualificationStore'
    ])(state),

    errorCode: path(['qualifications', 'errorCode'])(state),

    max_image_file_size: path(['config', 'config', 'image', 'max_file_size'])(
      state
    ),
    max_image_resolution: path(['config', 'config', 'image', 'max'])(state),
    min_image_resolution: path(['config', 'config', 'image', 'min'])(state),
    image_formats: path(['config', 'config', 'image', 'formats'])(state),

    max_video_file_size: path(['config', 'config', 'video', 'max_file_size'])(
      state
    ),
    video_formats: path(['config', 'config', 'video', 'formats'])(state),

    qualification_colour: path([
      'form',
      'qualificationEdit',
      'values',
      'colour'
    ])(state),

    unit_colour: path([
      'form',
      'learningUnitEdit',
      'values',
      'workbook_colour'
    ])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  getSectors: () => dispatch(SectorsActions.getSectorsAttempt()),

  clearCurrentQualification: () =>
    dispatch(QualificationActions.clearCurrentQualification()),

  createQualificationAttempt: payload =>
    dispatch(QualificationActions.createQualificationAttempt(payload)),

  updateQualificationAttempt: (payload, qualification_id) =>
    dispatch(
      QualificationActions.updateQualificationAttempt(payload, qualification_id)
    ),

  getQualificationAttempt: qualification_id =>
    dispatch(QualificationActions.getQualificationAttempt(qualification_id)),

  addQualificationStoreAttempt: (payload, qualification_id) =>
    dispatch(
      QualificationActions.addQualificationStoreAttempt(
        payload,
        qualification_id
      )
    ),

  setQualificationEditMode: mode =>
    dispatch(QualificationActions.setQualificationEditMode(mode)),

  getLearningUnitAttempt: (qualification_id, unit_id) =>
    dispatch(
      QualificationActions.getLearningUnitAttempt(qualification_id, unit_id)
    ),

  createLearningUnitAttempt: payload =>
    dispatch(QualificationActions.createLearningUnitAttempt(payload)),

  updateLearningUnitAttempt: (payload, qualification_id) =>
    dispatch(
      QualificationActions.updateLearningUnitAttempt(payload, qualification_id)
    ),

  initializeForm: data => dispatch(initialize(FORM_NAME, data)),

  changeFieldValue: (form_name, field_name, value) =>
    dispatch(change(form_name, field_name, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationEditForm);
