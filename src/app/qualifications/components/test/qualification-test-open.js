import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
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
import unitsUtil from 'app/units/util/';
import common from 'app/common';
import units from 'app/units';
import IconMedia from 'images/icon_media.svg';

import QualificationModalInsertMedia from '../modals/qualification-modal-insert-media';
import { Creators as QualificationActions } from 'app/qualifications/actions';

const {
  Form: { field, dropzone },
  ContentModal
} = common.components;

const FormField = field;
const FormDropzone = dropzone;

const { FormUtil } = userUtil;

const FORM_NAME = 'qualificationTestEdit';
const errorMesage = "Data doesn't exist";

class QualificationTestOpen extends Component {
  constructor() {
    super();
    this.state = {
      preview: false
    };
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onPreview = this.onPreview.bind(this);
  }

  UNSAFE_componentWillMount() {}

  onPreview() {
    this.setState({ preview: !this.state.preview });
  }

  onSave() {}

  onCancel() {}

  closeModalAddResult() {
    this.addModalResult.close();
  }

  handleModalAddResultSubmit() {
    this.addModalResult.close();
  }

  // his.addModalResult.open();

  render() {
    const { preview } = this.state;
    const { changeFieldValue, attemptingSave, open_media } = this.props;
    const { onSave, onCancel, onPreview } = this;

    return (
      <div>
        <ContentModal
          ref={e => {
            this.addModalResult = e;
          }}
        >
          <QualificationModalInsertMedia
            closeModal={() => this.closeModalAddResult()}
            onSubmit={() => this.handleModalAddResultSubmit()}
          />
        </ContentModal>
        <section>
          <div className="cloumns">
            <div className="column has-text-centered">
              <div style={{ minHeight: '150px' }}>
                <Field
                  name="open_media"
                  mediaType="both"
                  component={FormDropzone}
                  buttonText="Add Signature"
                  preview={true}
                  uploadedMedia={open_media ? open_media : null}
                  // handleDrop={file => this.onDrop(file)}
                  multiple={false}
                />
              </div>
              {!preview && (
                <div>
                  {!open_media && (
                    <h3 className="p-15">Upload a background image or video</h3>
                  )}
                  <div>
                    <a
                      className="qualifications button is-primary is-rounded"
                      onClick={() => this.addModalResult.open()}
                    >
                      Add Media
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="qualifications background-white p-t-10 has-text-right">
            <a
              className="qualifications button is-rounded"
              onClick={() => onPreview()}
            >
              {preview ? 'Exit Page' : 'Preview Page'}
            </a>
            <button
              className="qualifications button is-rounded m-l-20"
              onClick={() => onCancel()}
            >
              Cancel
            </button>
            <button
              type="button"
              //disabled={!valid}
              className={classNames(
                'qualifications button is-rounded add-qualification-button m-l-20',
                'is-primary',
                {
                  'is-loading': attemptingSave
                }
              )}
              onClick={e => onSave(e)}
            >
              {'Save Change'}
            </button>
          </div>
        </section>
      </div>
    );
  }
}

QualificationTestOpen.defaultProps = {};
const mapStateToProps = state => ({
  open_media: path(['form', 'qualificationTestEdit', 'values', 'open_media'])(
    state
  )
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationTestOpen);
