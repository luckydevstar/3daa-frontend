import React, { Component } from 'react';
import common from 'app/common';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import {
  Field,
  FormSection,
  reduxForm,
  change,
  initialize,
  formValueSelector
} from 'redux-form';

import classNames from 'classnames';
import * as lodash from 'lodash';
import Isvg from 'react-inlinesvg';

import util from 'app/user/util/';

import { Creators as AssessmentActions } from '../../actions';

import IconStudy from 'images/icon_study.svg';
import IconHardDrive from 'images/icon_hard_drive.svg';

const {
  components: {
    CloudinaryMedia,
    ContentModalNew,
    Form: { field, select, radio, textarea },
    UILoading
  },
  util: {
    helpers: {
      extractUserRole,
      extractUserCentre,
      elementAboveHeader,
      UserAccess
    }
  }
} = common;

const FormField = field;

const { FormUtil } = util;
const FORM_NAME = 'evidenceAdd';
const errorMesage = "Data doesn't exist";

class EvidenceAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.isValid = this.isValid.bind(this);
    this.onSaveEvidence = this.onSaveEvidence.bind(this);
  }

  isValid() {
    const { evidenceAdd } = this.props;
    // evidenceAdd.syncErrors
    return false;
  }

  onSaveEvidence(files) {
    const {
      postAssessmentEvidenceAttempt,
      memberId,
      qualificationId
    } = this.props;
    const file = lodash.get(files, ['0']);
    if (!file || !memberId || !qualificationId) return;

    postAssessmentEvidenceAttempt(memberId, qualificationId, {
      file: file,
      assessment_criteria: [10019]
    });
  }

  render() {
    const {
      handleSubmit,
      user,
      evidenceDetails,
      attemptingPostAssessmentEvidence
    } = this.props;

    const member_id = lodash.get(user, 'member_id');
    const learner_id = lodash.get(
      evidenceDetails,
      'evidence_details.member_id'
    );

    return (
      <form onSubmit={handleSubmit(() => {})}>
        <div className="evidence-edit p-30 p-t-50">
          <div
            className="has-text-centered semibold border-bottom p-b-30"
            style={{ fontSize: '24px' }}
          >
            Choose where you want to select the Evidence from
          </div>

          {attemptingPostAssessmentEvidence ? (
            <UILoading marginTop="100px" marginBottom="100px" />
          ) : (
            <div className="p-t-30">
              <div className="has-text-centered p-b-15">
                <Link
                  to={{
                    pathname: `/profile/${member_id}/photos`,
                    state: { prevPath: location.pathname }
                  }}
                >
                  <Isvg className="small" src={IconStudy} />
                </Link>
                <div>My Media</div>
              </div>
              <div className="has-text-centered p-b-15">
                <Link
                  to={{
                    pathname: `/profile/${learner_id}/photos`,
                    state: { prevPath: location.pathname }
                  }}
                >
                  <Isvg className="small" src={IconStudy} />
                </Link>
                <div>Learner Media</div>
              </div>
              <div className="has-text-centered">
                <div className="fileUploader">
                  <label
                    className="fileUploader__body fileUploader--labelOnly"
                    htmlFor="evidenceFile"
                  >
                    <input
                      type="file"
                      name="evidenceFile"
                      accept="image/*"
                      style={{
                        minWidth: '100px',
                        minHeight: '50px',
                        width: '100px',
                        height: '50px',
                        top: '-30px'
                      }}
                      onChange={({ target: { files } }) => {
                        this.onSaveEvidence(files);
                      }}
                    />
                    <span style={{ cursor: 'pointer' }}>
                      <Isvg className="small" src={IconHardDrive} />
                    </span>
                  </label>
                </div>
                <div>My Drive</div>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  FormUtil.validate(values, errors, 'title').required();
  FormUtil.validate(values, errors, 'type').required();
  return errors;
};

const EvidenceAddModalForm = reduxForm({
  form: FORM_NAME,
  validate
})(EvidenceAddModal);

const mapStateToProps = ({ form, profile, assessment, persisted }) => ({
  user: lodash.get(profile, 'user'),
  evidenceAdd: lodash.get(form, `${FORM_NAME}.values`),
  evidenceDetails: lodash.get(assessment, 'assessmentEvidenceDetails'),
  attemptingPostAssessmentEvidence: lodash.get(
    assessment,
    'attemptingPostAssessmentEvidence'
  )
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue: (field_name, value) => {
    dispatch(change(FORM_NAME, field_name, value));
  },

  initializeForm: data => {
    dispatch(initialize(FORM_NAME, data));
  },

  postAssessmentEvidenceAttempt: (member_id, qualification_id, payload) =>
    dispatch(
      AssessmentActions.postAssessmentEvidenceAttempt(
        member_id,
        qualification_id,
        payload
      )
    )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvidenceAddModalForm);
