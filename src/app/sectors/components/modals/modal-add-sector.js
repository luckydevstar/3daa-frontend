import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, path } from 'ramda';
import { Field, reduxForm, change, initialize } from 'redux-form';
import { connect } from 'react-redux';
import classNames from 'classnames';
import common from 'app/common';
import userUtil from 'app/user/util/';
import { Creators as SectorsActions } from 'app/sectors/actions';

import Isvg from 'react-inlinesvg';
import IconImagePreview from 'images/icon_image_preview.svg';
import IconSaveDone from 'images/icon-save-done.svg';

const {
  Form: { field, dropzone, textarea }
} = common.components;

const { FormUtil } = userUtil;
const FormField = field;
const FormTextArea = textarea;

const FormDropzone = dropzone;

const FORM_NAME = 'sectorEdit';
const errorMesage = "Data doesn't exist";

class ModalAddSector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sector: null,
      attemptingPostSectorState: false
    };

    this.onSetMedia = this.onSetMedia.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { sector, initializeForm } = this.props;
    if (sector) {
      initializeForm(sector);
      this.setState({ sector: sector });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // try {
    //   const { attemptingPostSector } = nextProps;
    //   const { attemptingPostSectorState } = this.state;
    //   if (attemptingPostSector) {
    //     this.setState({ attemptingPostSectorState: attemptingPostSector });
    //   } else if (attemptingPostSectorState) {
    //     this.props.closeModal();
    //   }
    // } catch(e) {
    // }
  }

  handleSubmit() {
    const { sector } = this.state;
    const { sectorEdit, createSectorAttempt, updateSectorAttempt } = this.props;

    let value = { ...sectorEdit.values };

    if (value.image)
      value.image =
        typeof value.image === 'string' ? value.image : value.image[0];

    if (value.sector_icon) {
      value.sector_icon =
        typeof value.sector_icon === 'string'
          ? value.sector_icon
          : value.sector_icon[0];
    }

    if (sector) {
      updateSectorAttempt(value, sector.sector_id);
    } else {
      createSectorAttempt(value);
    }
  }

  onSetMedia(file, filedName) {}

  render() {
    const { closeModal, sectorEdit, attemptingPostSector } = this.props;

    const { sector } = this.state;

    return (
      <div className="modal-add-sector p-40">
        <div className="has-text-centered">
          <h3 className="title">{sector ? 'Edit a Sector' : 'Add a Sector'}</h3>
        </div>

        <div className="has-text-centered">
          <h4 className="sub-title">
            Please provide a Sector title and group image
          </h4>
        </div>

        <div className="m-t-15 m-b-25">
          <form onSubmit={e => e.preventDefault()}>
            <div className="m-b-10">
              <div>
                <label>Sector Title:</label>
              </div>
              <div>
                <Field
                  placeholder="Add News Sector Title"
                  name="title"
                  type="text"
                  component={FormField}
                  className="control"
                />
              </div>
            </div>

            <div className="m-b-10">
              <div>
                <label htmlFor="description">Description</label>
              </div>
              <div>
                <Field
                  placeholder="Provide a full description"
                  name="description"
                  type="textarea"
                  component={FormTextArea}
                  className="control"
                />
              </div>
            </div>

            <div
              className="columns"
              style={{ maxHeight: '100px', alignItems: 'center' }}
            >
              <div className="column no-grow sector-icon">
                <Field
                  name="sector_icon"
                  mediaType="image"
                  component={FormDropzone}
                  buttonText=""
                  existingButtonText=""
                  mediaIcon={IconImagePreview}
                  // handleDrop={file => this.onDrop(file)}
                  multiple={false}
                  onOpenFileRef={ref => (this.fileOpen1 = ref)}
                  onChange={({ target: { files } }) => {
                    this.onSetMedia(files[0], 'sector_icon');
                  }}
                />
              </div>
              <div className="column">
                <span
                  className="open-file"
                  onClick={() => this.fileOpen1.click()}
                >
                  Add a Sector Icon
                </span>
              </div>
            </div>

            <div
              className="columns"
              style={{ maxHeight: '100px', alignItems: 'center' }}
            >
              <div
                className="column no-grow"
                style={{
                  minWidth: '100px',
                  minHeight: '100px',
                  height: '100px',
                  width: '100px'
                }}
              >
                <Field
                  name="image"
                  mediaType="image"
                  component={FormDropzone}
                  buttonText=""
                  existingButtonText=""
                  mediaIcon={IconImagePreview}
                  // handleDrop={file => this.onDrop(file)}
                  multiple={false}
                  onOpenFileRef={ref => (this.fileOpen2 = ref)}
                  onChange={({ target: { files } }) => {
                    this.onSetMedia(files[0], 'image');
                  }}
                />
              </div>
              <div className="column">
                <span
                  className="open-file"
                  onClick={() => this.fileOpen2.click()}
                >
                  Upload a banner image
                </span>
              </div>
            </div>

            <div className="m-t-15 m-b-10" style={{ textAlign: 'right' }}>
              <button
                className="button is-outlined m-r-15"
                style={{ minWidth: '150px' }}
                onClick={() => closeModal()}
              >
                Cancel
              </button>
              <button
                className={classNames(['button', 'is-primary'], {
                  'is-loading': attemptingPostSector
                })}
                disabled={sectorEdit && sectorEdit.syncErrors}
                style={{ minWidth: '150px' }}
                onClick={() => this.handleSubmit()}
              >
                {sector ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  return errors;
};

const ModalAddSectorForm = reduxForm({
  form: FORM_NAME,
  validate
})(ModalAddSector);

const mapStateToProps = state => {
  return {
    sectorEdit: path(['form', FORM_NAME])(state),
    attemptingPostSector: path(['sectors', 'attemptingPostSector'])(state)
  };
};

const mapDispatchToProps = dispatch => ({
  createSectorAttempt: params =>
    dispatch(SectorsActions.createSectorAttempt(params)),
  updateSectorAttempt: (params, sector_id) =>
    dispatch(SectorsActions.updateSectorAttempt(params, sector_id)),

  initializeForm: data => dispatch(initialize(FORM_NAME, data)),

  changeFieldValue: (form_name, field_name, value) =>
    dispatch(change(form_name, field_name, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddSectorForm);
