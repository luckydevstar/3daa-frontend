import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from 'app/common';
import userUtil from 'app/user/util/';
import { uniq, without, map, addIndex, equals, path } from 'ramda';
import { connect } from 'react-redux';
import { Field, reduxForm, change, initialize } from 'redux-form';
import * as Papa from 'papaparse';
import XLSX from 'xlsx';
import classNames from 'classnames';
import { Label, Text } from 'app/intl';

const {
  components: { ContentModalNew }
} = common;

import Isvg from 'react-inlinesvg';
import IconEmailNotification from 'images/icon_email_notification.svg';

const {
  Form: { field, select, dropzone },
  UILoading,
  UISelectDropdown
} = common.components;

const FormField = field;
const { FormUtil } = userUtil;

const FORM_NAME = 'uploadUsersFileModal';
const errorMesage = "Data doesn't exist";

class UploadUsersFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };

    this.renderFileInput = this.renderFileInput.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState({});
  }

  UNSAFE_componentWillReceiveProps(nextProps) {}

  handleChooseFile(files) {
    this.setState({
      file: files[0]
    });

    if (files[0].type.indexOf('csv') >= 0) {
      Papa.parse(files[0], {
        complete: this.updateData,
        header: true
      });
    } else {
      // console.log(XLSX.readFile(files[0]))
      // console.log(XLSX.utils.sheet_to_json(files[0]))
    }
  }

  renderFileInput() {
    return (
      <div className="columns">
        <div className="column has-text-centered create-file-section">
          <div>
            <div
              className="section-title"
              style={{ fontSize: '22px', color: 'black' }}
            >
              Create a file with list of users
            </div>
          </div>
          <div className="description-1">
            <div>File should be in excel format. It should include</div>
          </div>
          <div />
          <div className="m-b-15 description-2">
            <div>3 columns: first name, surname, date of birth</div>
          </div>
          <div>
            <button className={`button is-primary is-outlined`}>
              or download our template
            </button>
          </div>
        </div>
        <div className="column uploading-list-section has-text-centered">
          <div>
            <div
              className="section-title"
              style={{ fontSize: '22px', color: 'black' }}
            >
              Drag & Drop your files here
            </div>
          </div>
          <div className="m-t-25 m-b-15">or</div>
          <div className="fileUploader">
            <label
              className="fileUploader__body fileUploader--labelOnly button is-primary is-outlined"
              htmlFor="invitesFile"
            >
              Choose File Manually
              <input
                type="file"
                name="invitesFile"
                accept=".csv, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={({ target: { files } }) =>
                  this.handleChooseFile(files)
                }
              />
            </label>
          </div>
          {/*
            <div className="columns is-marginless space-between p-t-15">
              {file && (
                <div className="column is-paddingless">
                  {'List of Learners(' + file.type + ' ' + file.size + 'KB)'}
                </div>
              )}
              {numberOfInvites > 0 && (
                <div className="column is-paddingless has-text-right">
                  {numberOfInvites + ' Learners detected'}
                </div>
              )}
            </div>
            */}
          <div />
        </div>
      </div>
    );
  }

  open() {
    this.modal.open();
  }
  close() {
    this.modal.close();
  }

  onSave(e) {}

  render() {
    return (
      <ContentModalNew
        ref={e => {
          this.modal = e;
        }}
        className="upload-users-file-modal"
      >
        <form onSubmit={e => e.preventDefault()}>
          <div className="title" />

          <div className="sub-title" />

          {/* Add from File */}
          {this.renderFileInput()}

          <div className="controls has-text-right">
            <div
              onClick={e => this.close(e)}
              className="button is-primary is-outlined m-r-15"
            >
              Cancel
            </div>
            <div onClick={e => this.onSave(e)} className="button is-primary">
              Save
            </div>
          </div>
        </form>
      </ContentModalNew>
    );
  }
}

export default UploadUsersFileModal;

// const validate = (values, props) => {
//   const errors = {};
//   return errors;
// };

// const UploadUsersFileModalForm = reduxForm({
//   form: FORM_NAME,
//   validate
// })(UploadUsersFileModal);

// const mapStateToProps = state => ({
//   uploadUsersFileModal: path(['form', 'uploadUsersFileModal'])(state),
// });

// const mapDispatchToProps = dispatch => ({
//   changeFieldValue: (field_name, value) => {
//     dispatch(change(FORM_NAME, field_name, value));
//   },

//   initializeForm: data => {
//     dispatch(initialize(FORM_NAME, data));
//   }
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(UploadUsersFileModalForm);

// <div className="m-l-15 m-r-15">
//           {/* Add Learners from File */}

//           {activeTab == 2 &&
//             currentStep > 2 && (
//               <div className="uploaded-result has-text-centered">
//                 <p>You have uploaded</p>
//                 <p>345 Learners in this Batch</p>
//                 <i className="fa fa-trash-o" style={{ cursor: 'pointer' }} />
//               </div>
//             )}
//         </div>
