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

import CertificateSvg from 'images/slta-certificate.svg';
import IconImage from 'images/icon-image.svg';
import IconSignature from 'images/icon_signature.svg';

import { Creators as QualificationActions } from 'app/qualifications/actions';
import QualificationUnitList from '../unit/qualification-unit-list';

const {
  Form: { field, dropzone }
} = common.components;

const FormField = field;
const FormDropzone = dropzone;

const { FormUtil } = userUtil;

const FORM_NAME = 'qualificationTestEdit';
const errorMesage = "Data doesn't exist";

class QualificationTestClose extends Component {
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

  render() {
    const { preview } = this.state;
    const { changeFieldValue, testEditValues } = this.props;
    const { onSave, onCancel, onPreview } = this;

    return (
      <div>
        <div className="columns">
          <div className="column is-4 is-offset-4">
            <div className="has-text-centered">
              <Field
                name="result"
                mediaType="image"
                component={FormDropzone}
                preview={true}
                uploadedMedia={
                  testEditValues ? testEditValues.signature_file : null
                }
                mediaIcon={IconImage}
                dropzoneClassName="dropzone signature"
                // handleDrop={file => this.onDrop(file)}
                multiple={false}
              />
            </div>
            <div className="has-text-centered">Result</div>
            <div className="has-text-centered m-t-20">
              {preview ? (
                <h2>
                  {testEditValues && testEditValues.colse_text
                    ? testEditValues.colse_text
                    : 'Congratulations!'}
                </h2>
              ) : (
                <Field
                  placeholder="Congratulations!"
                  name="colse_text"
                  type="text"
                  className="no-border"
                  inputClassName={'input no-border'}
                  inputStyle={{ fontSize: 36, textAlign: 'center' }}
                  component={FormField}
                />
              )}
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="column" />
          <div className="column">
            <div style={{ maxWidth: 250, margin: 'auto' }}>
              <div className="has-text-centered">
                {preview ? (
                  <h3>
                    {testEditValues && testEditValues.close_sub_text
                      ? testEditValues.close_sub_text
                      : 'Well done! That is a great score'}
                  </h3>
                ) : (
                  <Field
                    placeholder="Well done! That is a great score"
                    name="close_sub_text"
                    type="text"
                    component={FormField}
                  />
                )}
              </div>
              <div className="p-15 has-text-centered">
                <a className="centred result-link is-link is-primary">
                  Click here to see your result
                </a>
              </div>
              <div className="has-text-centered">
                You have been awarded your digital badge and your certificate
                will be issued shortly.
              </div>
            </div>
          </div>
          <div className="column has-text-centered">
            <div className="has-text-centered">
              <Field
                name="signature_file"
                mediaType="image"
                component={FormDropzone}
                buttonText="Add Signature"
                preview={preview}
                uploadedMedia={
                  testEditValues ? testEditValues.signature_file : null
                }
                mediaIcon={IconSignature}
                dropzoneClassName="dropzone signature"
                // handleDrop={file => this.onDrop(file)}
                multiple={false}
              />
            </div>
            <div style={{ margin: 'auto', maxWidth: 240 }}>
              <div className="has-text-centered">
                {preview ? (
                  <h4 className="p-15">
                    {testEditValues && testEditValues.signature_name
                      ? testEditValues.signature_name
                      : 'Type the name of the signature'}
                  </h4>
                ) : (
                  <Field
                    placeholder="Type the name of the signature"
                    name="signature_name"
                    type="text"
                    component={FormField}
                    inputClassName={'input no-border'}
                  />
                )}
              </div>
              <div className="has-text-centered">
                {preview ? (
                  <h4 className="p-15">
                    {testEditValues && testEditValues.signature_title
                      ? testEditValues.signature_title
                      : 'Type the title of the signature'}
                  </h4>
                ) : (
                  <Field
                    placeholder="Type the title of the signature"
                    name="signature_title"
                    type="text"
                    component={FormField}
                    inputClassName={'input no-border'}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="qualifications background-white p-t-10 has-text-right">
          <a
            className="qualifications button is-rounded"
            onClick={() => onPreview()}
          >
            {preview ? 'Exit Page' : 'Preview Page'}
          </a>
          <a
            className="qualifications button is-rounded m-l-20"
            onClick={() => onCancel()}
          >
            Cancel
          </a>
          <button
            type="button"
            //disabled={!valid}
            className={classNames(
              'qualifications button is-rounded add-qualification-button m-l-20',
              'is-primary'
            )}
            onClick={e => onSave(e)}
          >
            {'Save Change'}
          </button>
        </div>
      </div>
    );
  }
}

QualificationTestClose.defaultProps = {};

const mapStateToProps = state => ({
  testEditValues: path(['form', 'qualificationTestEdit', 'values'])(state)
});

const mapDispatchToProps = dispatch => ({
  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QualificationTestClose);
